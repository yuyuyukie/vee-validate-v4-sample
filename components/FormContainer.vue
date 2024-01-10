<script setup lang="ts">
import {Form} from "vee-validate"
import ValidationProvider from "~/components/ValidationProvider.vue";

const agreement = ref(false);
const agreement2 = ref(false);
const passConfirm = ref("");
const pass = ref("");
const formRef = ref();
const providerRef = ref<InstanceType<typeof ValidationProvider>>();
onUpdated(() => {
  console.log(`Password Field is ${providerRef.value?.meta.valid ? "Valid" : "Invalid"}.`);
})
</script>
<template>
  <div>
    <h2>
      フォーム
    </h2>
    <Form ref="formRef" as="div" style="display: flex;flex-direction: column;gap: 1rem;">
      <div>
        <ValidationProvider ref="providerRef" v-slot="{ errors, handlers }" rules="required|min:6" vid="password"
                            name="パスワード" v-model="pass">
          <label>
            パスワード
            <input v-on="handlers" :value="pass" style="border: 1px solid black">
          </label>
          <span v-if="errors.length > 0">{{ errors[0] }}</span>
        </ValidationProvider>
      </div>
      <div>
        <ValidationProvider v-slot="{ errors, handlers }" :rules="`required|passwordConfirm:${pass}`" vid="passwordConfirm"
                            name="パスワード確認" v-model="passConfirm" mode="aggressive">
          <label>パスワード確認(mode: aggressive)
            <input v-on="handlers" :value="passConfirm" style="border: 1px solid black">
          </label>
          <span v-if="errors.length > 0">{{ errors[0] }}</span>
        </ValidationProvider>
      </div>
      <div>
        <ValidationProvider v-slot="{ errors, handlers, meta }" rules="required" vid="agreement" name="同意"
                            type="checkbox" v-model="agreement">
          <label>同意
            <input type="checkbox" name="agreement" :checked="agreement" v-on="handlers">
          </label>
          <span v-if="errors">{{ errors[0] }}</span>
        </ValidationProvider>
      </div>
      <div>
        <ValidationProvider v-slot="{ errors, handlers, meta }" rules="required" vid="agreement2" name="同意2"
                            type="checkbox" v-model="agreement2">
          同意（inputの外で値更新パターン）
          <input v-show="false" type="checkbox" name="agreement2" :checked="agreement2" v-on="handlers">
          <button @click="agreement2 = true" type="button">同意する</button>
          <span v-if="errors">{{ errors[0] }}</span>
        </ValidationProvider>
      </div>
    </Form>
  </div>
</template>
