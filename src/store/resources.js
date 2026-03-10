import { defineStore } from "pinia";

export const useResourcesStore = defineStore("resources", {
  state: () => ({
    tableColumns: [
      { key: "clazz", title: "Resource Type" },
      { key: "color", title: "Color" },
      { key: "quality", title: "Quality" },
      { key: "quantityType", title: "Quantity Type" },
      { key: "shape", title: "Shape" },
      { key: "size", title: "Size" },
      { key: "type", title: "Type" },
      { key: "purity", title: "Purity" },
      { key: "plating", title: "Plating" },
      { key: "carat", title: "Carat" },
      { key: "cut", title: "Cut" },
      { key: "pricePerQuantity", title: "Price per quantity" },
      { key: "note", title: "Note" },
      { key: "description", title: "Description" },
      { key: "shapeSpecification", title: "Shape Specifications" },
      { key: "colorHue", title: "Color Hue" },
      { key: "sku", title: "Sku" },
      { key: "clarity", title: "Clarity" },
      { key: "polish", title: "Polish" },
      { key: "symmetry", title: "Symmetry" },
      { key: "fluorescence", title: "Fluorescence" },
      { key: "certificate", title: "Certificate" },
      { key: "treatment", title: "Treatment" },
      { key: "totalPrice", title: "Total Price" },
    ],
  }),
  actions: {},
  persist: {
    key: "resources",
    storage: localStorage,
  },
});
