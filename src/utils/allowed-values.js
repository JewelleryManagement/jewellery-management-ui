const allowedFieldsByType = {
  Metal: ["color", "purity"],
  Pearl: [
    "type",
    "quantityType",
    "quality",
    "color",
    "shape",
    "shapeSpecification",
    "colorHue",
    "size",
  ],
  Diamond: [
    "color",
    "colorHue",
    "cut",
    "clarity",
    "quantityType",
    "shape",
    "type",
    "carat",
    "polish",
    "symmetry",
    "fluorescence",
    "certificate",
  ],
  DiamondMelee: ["shape", "size", "color", "clarity", "cut"],
  ColoredStone: [
    "shape",
    "carat",
    "color",
    "colorHue",
    "clarity",
    "cut",
    "treatment",
    "certificate",
  ],
  ColoredStoneMelee: ["shape", "size", "color", "colorHue", "clarity", "cut"],
  SemiPreciousStone: [
    "type",
    "quality",
    "shape",
    "shapeSpecification",
    "color",
    "colorHue",
    "size",
  ],
  Element: ["quantityType"],
};

export async function addNewAllowedValuesIfNeeded(
  store,
  resourceClazz,
  formData
) {
  const fields = allowedFieldsByType[resourceClazz];
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
