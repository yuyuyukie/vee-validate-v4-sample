<script setup lang="ts">
import {useStore} from "~/store";

const store = useStore();

const fieldsArr = computed(() => Object.values(store.validationFields))
const invalidFields = computed(() => fieldsArr.value.filter(value => !value.valid))
</script>
<template>
<div>
  <div>
    <h2>進捗</h2>
    <div v-if="invalidFields.length > 0">{{fieldsArr.length - invalidFields.length}} / {{fieldsArr.length}}</div>
    <div v-else>OK</div>
    <h3>以下の項目を埋めてください</h3>
    <ul>
      <li v-for="field in invalidFields">{{field.name}}</li>
    </ul>
  </div>
</div>
</template>
