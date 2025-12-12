export async function addNewAllowedValuesIfNeeded(
  store,
  resourceClazz,
  formData
) {
  const fields =
    store.getters["allowedValues/getAllowedFieldsByType"](resourceClazz);

  for (const fieldName of fields) {
    const fieldValue = formData[fieldName];
    const allowed = store.getters["allowedValues/getAllowedValues"](
      resourceClazz,
      fieldName
    );
    if (
      fieldValue &&
      typeof fieldValue.value === "string" &&
      fieldValue.value.trim() !== "" &&
      !allowed.some(
        (item) =>
          item.value.trim().toLowerCase() ===
            fieldValue.value.trim().toLowerCase() &&
          item.sku.trim().toLowerCase() === fieldValue.sku.trim().toLowerCase()
      )
    ) {
      await store.dispatch("allowedValues/addAllowedValue", {
        resourceClazz,
        fieldName,
        fieldValue,
      });
    }
  }
}

export const fetchAllowedValues = async (store, resourceClazz) => {
  const fields = store.getters["allowedValues/getAllowedFieldsByType"](
    resourceClazz.value
  );
  await Promise.all(
    fields.map((fieldName) =>
      store.dispatch("allowedValues/fetchAllowedValues", {
        resourceClazz: resourceClazz.value ?? resourceClazz,
        fieldName,
      })
    )
  );
};

export const getAllowedValue = (store, resourceClazz, fieldName) =>
  store.getters["allowedValues/getAllowedValues"](
    resourceClazz.value,
    fieldName
  );
