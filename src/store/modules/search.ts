import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useSearchStore = defineStore('counter', () => {
  const result = ref(false)
  function changeResult() {
    result.value = !result.value
  }

  return { result, changeResult }
})
