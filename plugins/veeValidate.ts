import * as AllRules from "@vee-validate/rules"
import {defineRule} from "vee-validate";

export default defineNuxtPlugin((nuxtApp) => {
  Object.entries(AllRules).forEach(([id, validator]) => {
    defineRule(id, validator);
  });

  const phoneNumber: Parameters<typeof defineRule<string>>[1] = (value, params, ctx) => {
    return /^(050|070|080|090)\d{8}$/.test(value) ? true : `正しい${ctx.field}を入力してください。`
  }

  defineRule<string>("phoneNumber", (value, params, ctx) => {
    return /^(050|070|080|090)\d{8}$/.test(value) ? true : `正しい${ctx.field}を入力してください。`;
  })
})
