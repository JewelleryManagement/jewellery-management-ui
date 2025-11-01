export async function addNewAllowedValuesIfNeeded(
  store,
  resourceClazz,
  formData,
  fields
) {
  for (const fieldName of fields) {
    const value = formData[fieldName];
    const allowed = store.getters["allowedValues/getAllowedValues"](
      resourceClazz,
      fieldName
    );
    if (
      typeof value === "string" &&
      value.trim() !== "" &&
      !allowed.some(
        (v) => v.trim().toLowerCase() === value.trim().toLowerCase()
      )
    ) {
      await store.dispatch("allowedValues/addAllowedValue", {
        resourceClazz,
        fieldName,
        value: value.trim(),
      });
    }
  }
}

export const fetchAllowedValues = async (store, resourceClazz, fields) => {
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
