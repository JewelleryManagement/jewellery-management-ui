import { defineStore } from "pinia";
import { STORAGE_KEYS } from "./storageKeys";
import { storageService } from "./storageService";
import AllowedValuesService from "@/services/AllowedValuesService";

export const useAllowedValuesStore = defineStore("allowedValues", {
  state: () => ({
    allowedValues: {},
    allowedValueDetails: {},
    allowedValuesReset: false,
    allowedFieldsByType: {
      Metal: ["clazz", "quantityType", "type", "color", "purity"],
      Pearl: [
        "clazz",
        "quantityType",
        "type",
        "quality",
        "shape",
        "shapeSpecification",
        "color",
        "colorHue",
        "size",
      ],
      Diamond: [
        "clazz",
        "quantityType",
        "type",
        "shape",
        "carat",
        "color",
        "colorHue",
        "clarity",
        "cut",
        "polish",
        "symmetry",
        "fluorescence",
        "certificate",
      ],
      DiamondMelee: [
        "clazz",
        "quantityType",
        "type",
        "shape",
        "size",
        "color",
        "clarity",
        "cut",
      ],
      ColoredStone: [
        "clazz",
        "quantityType",
        "type",
        "shape",
        "carat",
        "color",
        "colorHue",
        "clarity",
        "cut",
        "treatment",
        "certificate",
      ],
      ColoredStoneMelee: [
        "clazz",
        "quantityType",
        "type",
        "shape",
        "size",
        "color",
        "colorHue",
        "clarity",
        "cut",
      ],
      SemiPreciousStone: [
        "clazz",
        "quantityType",
        "type",
        "quality",
        "shape",
        "shapeSpecification",
        "color",
        "colorHue",
        "size",
      ],
      Element: ["clazz", "quantityType"],
    },
  }),
  getters: {
    getAllowedValues: (state) => (resourceClazz, fieldName) =>
      state.allowedValues?.[resourceClazz]?.[fieldName] || [],
  },
  actions: {
    setAllowedValueDetail(newObj) {
      const key = Object.keys(newObj)[0];
      this.allowedValueDetails[key] = newObj[key];
    },

    clearAllowedValueDetails() {
      this.allowedValueDetails = {};
    },

    setAllowedValueReset(reset) {
      this.allowedValuesReset = reset;
    },

    async fetchAllowedValues({ resourceClazz, fieldName }) {
      const params = { resourceClazz, fieldName };
      const { data } = await AllowedValuesService.get(params);

      const values = Array.isArray(data)
        ? data.map((item) => ({
            value: item.value,
            sku: item.sku,
          }))
        : [];

      if (!this.allowedValues[resourceClazz]) {
        this.allowedValues[resourceClazz] = {};
      }

      this.allowedValues[resourceClazz][fieldName] = values;
    },

    async addAllowedValue({ resourceClazz, fieldName, fieldValue }) {
      try {
        const { value, sku } = fieldValue;

        await AllowedValuesService.add({
          resourceClazz,
          fieldName,
          value,
          sku,
        });

        if (!this.allowedValues[resourceClazz]) {
          this.allowedValues[resourceClazz] = {};
        }

        if (!this.allowedValues[resourceClazz][fieldName]) {
          this.allowedValues[resourceClazz][fieldName] = [];
        }

        const exists = this.allowedValues[resourceClazz][fieldName].some(
          (item) =>
            item.value === fieldValue.value && item.sku === fieldValue.sku,
        );

        if (!exists) {
          this.allowedValues[resourceClazz][fieldName].push(fieldValue);
        }
      } catch (error) {
        // optionally handle error
      }
    },
    async deleteAllowedValue({ resourceClazz, fieldName, fieldValue }) {
      try {
        const { value, sku } = fieldValue;

        await AllowedValuesService.delete({
          resourceClazz,
          fieldName,
          value,
          sku,
        });

        if (
          this.allowedValues[resourceClazz] &&
          this.allowedValues[resourceClazz][fieldName]
        ) {
          this.allowedValues[resourceClazz][fieldName] = this.allowedValues[
            resourceClazz
          ][fieldName].filter((v) => v !== fieldValue);
        }
      } catch (error) {
        // optionally handle error
      }
    },
  },
  persist: {
    key: STORAGE_KEYS.ALLOWED_VALUES,
    storage: storageService.getStorage(),
  },
});
