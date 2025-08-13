// src/utils/allowed-values.js
export async function addNewAllowedValuesIfNeeded(store, resourceClazz, formData, fields) {
  for (const fieldName of fields) {
    const value = formData[fieldName];
    const allowed = store.getters["allowedValues/getAllowedValues"](resourceClazz, fieldName);
    if (
      typeof value === 'string' &&
      value.trim() !== '' &&
      !allowed.some(v => v.trim().toLowerCase() === value.trim().toLowerCase())
    ) {
      await store.dispatch("allowedValues/addAllowedValue", {
        resourceClazz,
        fieldName,
        value: value.trim(),
      });
    }
  }
} 