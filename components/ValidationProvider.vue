<script setup lang="ts">
import {computed, defineEmits, onBeforeUnmount, onMounted, watch} from "vue";
import {type InputType, type RuleExpression, useField} from "vee-validate";
import {useStore} from "~/store";

const props = withDefaults(
    defineProps<{
      modelValue: string | boolean;
      name: string;
      rules: RuleExpression<any>;
      type?: InputType;
      vid: string;
      mode?: Mode;
    }>(),
    {
      mode: "eager",
      type: "default"
    }
)
defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();

const store = useStore();

type Mode = "passive" | "lazy" | "aggressive" | "eager" | "validateOnUpdate"
type EventType = "input" | "blur" | "change"
type InteractionEventGetter = (errorMessage: string | undefined) => EventType[];

const passive: InteractionEventGetter = () => [];
const lazy: InteractionEventGetter = () => ["change"];
const aggressive: InteractionEventGetter = () => ["input", "blur"];
const eager: InteractionEventGetter = (errorMessage) =>
    errorMessage ? ["input"] : ["change", "blur"];

const modes = {
  passive,
  lazy,
  aggressive,
  eager,
  validateOnUpdate: passive,
} satisfies Record<Mode, InteractionEventGetter>

const { name, rules, vid, type, mode, modelValue } = toRefs(props);

const {value,uncheckedValue,meta,setValue,validate,label,checkedValue,checked,keepValueOnUnmount,resetField,handleReset,handleChange,handleBlur,errors,setErrors,errorMessage,setState,setTouched,bails} = useField(vid, rules, {
  initialValue: modelValue?.value,
  validateOnMount: !!modelValue?.value,
  uncheckedValue: type.value === "checkbox" ? false : undefined,
  validateOnValueUpdate:
      mode?.value === "validateOnUpdate" || type?.value === "checkbox",
  label: name?.value,
  type: type?.value,
  syncVModel: type?.value !== "checkbox",
});

const callHandleChange: HandleChangeFunc = (e, shouldValidate) => {
  handleChange(
      props.type === "checkbox" && e.target instanceof HTMLInputElement
          ? e.target.checked
          : e,
      shouldValidate
  )
}

const handlers = computed<ValidationHandlers>(() => {
  const on: ValidationHandlers = {
    blur: handleBlur,
    input: [(e, _) => handleChange(e, false)],
    change: [(e, _) => handleChange(e, false)],
  }
  const triggers = modes[type?.value === "checkbox" ? "lazy" : mode.value](
      errorMessage.value
  );
  triggers.forEach((t) => {
    const trigger = on[t];
    if(Array.isArray(trigger)){
      trigger.push(callHandleChange);
    } else {
      on[t] = callHandleChange;
    }
  });
  return on;
})

const saveValidationObserverFields = (valid: boolean): void => {
  store.saveField({
    id: props.vid,
    name: props.name,
    valid
  });
}
onMounted(() => {
  if (!props.name || !props.vid) return;
  saveValidationObserverFields(meta.valid);
})
watch(
    () => meta.valid,
    (valid) => {
      if(valid) {
        setErrors([]);
      }
      saveValidationObserverFields(valid);
    }
)
// チェックボックスまたはvalidateOnUpdate
watch(
    () => props.modelValue,
    async (value) => {
      if (props.mode === "validateOnUpdate" || props.type === "checkbox") {
        setValue(value);
        saveValidationObserverFields((await validate()).valid);
      }
    }
);
onBeforeUnmount(() => {
  store.remove(props.vid);
})

defineExpose({value,uncheckedValue,meta,setValue})
</script>
<template>
  <slot
    :handlers="handlers"
    :meta="meta"
    :errors="errors"
    :setValue="setValue"
  />
</template>
