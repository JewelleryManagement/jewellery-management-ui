export async function addNewAllowedValuesIfNeeded(
  allowedValuesStore,
  resourceClazz,
  formData,
) {
  const fields = allowedValuesStore.allowedFieldsByType[resourceClazz];

  for (const fieldName of fields) {
    const fieldValue = formData[fieldName];
    const allowed = allowedValuesStore.getAllowedValues(
      resourceClazz,
      fieldName,
    );

    if (
      fieldValue &&
      typeof fieldValue.value === "string" &&
      fieldValue.value.trim() !== "" &&
      !allowed.some(
        (item) =>
          item.value.trim().toLowerCase() ===
            fieldValue.value.trim().toLowerCase() &&
          item.sku.trim().toLowerCase() === fieldValue.sku.trim().toLowerCase(),
      )
    ) {
      await allowedValuesStore.addAllowedValue({
        resourceClazz,
        fieldName,
        fieldValue,
      });
    }
  }
}

export const fetchAllowedValues = async (
  allowedVasluesStore,
  resourceClazz,
) => {
  const fields = allowedVasluesStore.allowedFieldsByType[resourceClazz.value];
  console.log(fields);
  await Promise.all(
    fields.map((fieldName) =>
      allowedVasluesStore.fetchAllowedValues({
        resourceClazz: resourceClazz.value ?? resourceClazz,
        fieldName,
      }),
    ),
  );
};

export const getAllowedValue = (allowedValuesStore, resourceClazz, fieldName) =>
  allowedValuesStore.getAllowedValues(resourceClazz.value, fieldName);
