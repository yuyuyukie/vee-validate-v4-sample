// stores/counter.js
import { defineStore } from 'pinia'

type ValidationField = {
  id: string,
  name: string,
  valid: boolean
}

export const useStore = defineStore('store', {
  state: () => {
    return { validationFields: {} as Record<string, ValidationField> }
  },
  // could also be defined as
  // state: () => ({ count: 0 })
  actions: {
    saveField(field: ValidationField) {
      this.validationFields[field.id] = field;
    },
    remove(id: string){
      delete this.validationFields[id];
    }
  },
})
