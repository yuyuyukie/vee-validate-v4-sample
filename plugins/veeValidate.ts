import * as AllRules from "@vee-validate/rules"
import {defineRule, extend, Field, Form} from "vee-validate";
import {defineNuxtPlugin} from "nuxt/app";

export default defineNuxtPlugin( (nuxtApp) => {
  nuxtApp.vueApp.component("ValidationObserver", Form);
  nuxtApp.vueApp.component("ValidationProvider", Field);

  Object.entries(AllRules).forEach(([id, validator]) => {
    if(id === "default") return;
    defineRule(id, validator);
  })

  defineRule("phoneNumber", (value, params) => {
    return /^(050|070|080|090)\d{8}$/.test(value) ? true : `正しい携帯電話番号を入力してください。`;
  })
  defineRule<string>("passwordConfirm", (value, params, ctx) => {
    if(value !== params[0]){
      return `${ctx.field}は同じ値を入力してください。`
    }
    return true;
  })
});
