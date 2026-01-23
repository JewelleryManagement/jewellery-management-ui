import {
  getRandomNumberAsString,
  getRandomString,
} from "./getRandomNumberOrString";
import {
  PEARL_CLAZZ,
  DIAMOND_CLAZZ,
  DIAMON_MELEE_CLAZZ,
  COLORED_STONE_CLAZZ,
  COLORED_STONE_MELEE_CLAZZ,
  SEMI_PRECIOUS_STONE_CLAZZ,
  METAL_CLAZZ,
  ELEMENT_CLAZZ,
} from "@/utils/clazzConstants";

export const pearlFormFields = [
  {
    label: "Type",
    value: getRandomString(4),
    sku: getRandomString(2),
    required: true,
  },
  {
    label: "Quality",
    value: getRandomString(4),
    sku: getRandomString(2),
    required: true,
  },
  {
    label: "Shape",
    value: getRandomString(4),
    sku: getRandomString(2),
    required: true,
  },
  {
    label: "Shape Specification",
    value: getRandomString(4),
    sku: getRandomString(2),
    required: false,
  },
  {
    label: "Color",
    value: getRandomString(4),
    sku: getRandomString(2),
    required: true,
  },
  {
    label: "Color Hue",
    value: getRandomString(4),
    sku: getRandomString(2),
    required: false,
  },
  {
    label: "Size",
    value: getRandomNumberAsString(),
    sku: getRandomString(2),
    required: true,
  },
  {
    label: "Price per quantity",
    value: getRandomNumberAsString(),
    required: true,
  },
  { label: "Note", value: getRandomString(10), required: false },
];

export const diamondFormFields = [
  {
    label: "Shape",
    value: getRandomString(4),
    sku: getRandomString(2),
    required: true,
  },
  { label: "Length", value: getRandomNumberAsString(), required: true },
  { label: "Width", value: getRandomNumberAsString(), required: true },
  { label: "Depth", value: getRandomNumberAsString(), required: true },
  {
    label: "Carat",
    value: getRandomNumberAsString(),
    sku: getRandomNumberAsString(),
    required: true,
  },
  {
    label: "Color",
    value: getRandomString(4),
    sku: getRandomString(2),
    required: true,
  },
  { label: "Color Hue", value: getRandomString(4), required: false },
  {
    label: "Clarity",
    value: getRandomString(4),
    sku: getRandomString(2),
    required: true,
  },
  {
    label: "Cut",
    value: getRandomString(4),
    sku: getRandomString(2),
    required: true,
  },
  {
    label: "Polish",
    value: getRandomString(4),
    sku: getRandomString(2),
    required: true,
  },
  {
    label: "Symmetry",
    value: getRandomString(4),
    sku: getRandomString(2),
    required: true,
  },
  {
    label: "Fluorescence",
    value: getRandomString(4),
    sku: getRandomString(2),
    required: true,
  },
  { label: "Price Per Unit", value: getRandomNumberAsString(), required: true },
  {
    label: "Certificate",
    value: getRandomString(4),
    sku: getRandomString(2),
    required: false,
  },
  { label: "Note", value: getRandomString(10), required: false },
];

export const diamondMeleeFormFields = [
  {
    label: "Shape",
    value: getRandomString(4),
    sku: getRandomString(2),
    required: true,
  },
  {
    label: "Size",
    value: getRandomString(4),
    sku: getRandomString(2),
    required: true,
  },
  { label: "Carat", value: getRandomNumberAsString(), required: true },
  {
    label: "Color",
    value: getRandomString(4),
    sku: getRandomString(2),
    required: true,
  },
  {
    label: "Clarity",
    value: getRandomString(4),
    sku: getRandomString(2),
    required: true,
  },
  {
    label: "Cut",
    value: getRandomString(4),
    sku: getRandomString(2),
    required: true,
  },
  { label: "Price Per Unit", value: getRandomNumberAsString(), required: true },
  { label: "Note", value: getRandomString(10), required: false },
];

export const coloredStoneFormFields = [
  {
    label: "Type",
    value: getRandomString(4),
    sku: getRandomString(2),
    required: true,
  },
  {
    label: "Shape",
    value: getRandomString(4),
    sku: getRandomString(2),
    required: true,
  },
  { label: "Length", value: getRandomNumberAsString(), required: true },
  { label: "Width", value: getRandomNumberAsString(), required: true },
  { label: "Depth", value: getRandomNumberAsString(), required: true },
  {
    label: "Carat",
    value: getRandomNumberAsString(),
    sku: getRandomNumberAsString(),
    required: true,
  },
  {
    label: "Color",
    value: getRandomString(4),
    sku: getRandomString(2),
    required: true,
  },
  { label: "Color Hue", value: getRandomString(4), required: false },
  {
    label: "Clarity",
    value: getRandomString(4),
    sku: getRandomString(2),
    required: true,
  },
  {
    label: "Cut",
    value: getRandomString(4),
    sku: getRandomString(2),
    required: true,
  },
  { label: "Treatment", value: getRandomString(4), required: true },
  { label: "Price Per Unit", value: getRandomNumberAsString(), required: true },
  {
    label: "Certificate",
    value: getRandomString(4),
    sku: getRandomString(2),
    required: false,
  },
  { label: "Note", value: getRandomString(10), required: false },
];

export const coloredStoneMeleeFormFields = [
  {
    label: "Type",
    value: getRandomString(4),
    sku: getRandomString(2),
    required: true,
  },
  {
    label: "Shape",
    value: getRandomString(4),
    sku: getRandomString(2),
    required: true,
  },
  {
    label: "Size",
    value: getRandomString(4),
    sku: getRandomString(2),
    required: true,
  },
  { label: "Carat", value: getRandomNumberAsString(), required: true },
  {
    label: "Color",
    value: getRandomString(4),
    sku: getRandomString(2),
    required: true,
  },
  { label: "Color Hue", value: getRandomString(4), required: false },
  {
    label: "Clarity",
    value: getRandomString(4),
    sku: getRandomString(2),
    required: true,
  },
  {
    label: "Cut",
    value: getRandomString(4),
    sku: getRandomString(2),
    required: true,
  },
  { label: "Treatment", value: getRandomString(4), required: true },
  { label: "Price Per Unit", value: getRandomNumberAsString(), required: true },
  { label: "Note", value: getRandomString(10), required: false },
];

export const semiPreciousStoneFormFields = [
  {
    label: "Type",
    value: getRandomString(4),
    sku: getRandomString(2),
    required: true,
  },
  {
    label: "Quality",
    value: getRandomString(4),
    sku: getRandomString(2),
    required: true,
  },
  {
    label: "Shape",
    value: getRandomString(4),
    sku: getRandomString(2),
    required: true,
  },
  {
    label: "Shape Specification",
    value: getRandomNumberAsString(),
    sku: getRandomString(2),
    required: true,
  },
  {
    label: "Color",
    value: getRandomString(4),
    sku: getRandomString(2),
    required: true,
  },
  {
    label: "Color Hue",
    value: getRandomString(4),
    sku: getRandomString(2),
    required: false,
  },
  {
    label: "Size",
    value: getRandomString(4),
    sku: getRandomString(2),
    required: true,
  },
  {
    label: "Price per quantity",
    value: getRandomNumberAsString(),
    required: true,
  },
  { label: "Note", value: getRandomString(15), required: false },
];

export const metalFormFields = [
  {
    label: "Color",
    value: getRandomString(4),
    sku: getRandomString(2),
    required: true,
  },
  {
    label: "Purity",
    value: getRandomNumberAsString(),
    sku: getRandomNumberAsString(),
    required: true,
  },
  {
    label: "Price per quantity",
    value: getRandomNumberAsString(),
    required: true,
  },
  { label: "Note", value: getRandomString(10), required: false },
];

export const elementFormFields = [
  {
    label: "Description",
    exact: true,
    value: getRandomString(10),
    required: true,
  },
  {
    label: "Price per quantity",
    value: getRandomNumberAsString(),
    required: true,
  },
  { label: "Note", value: getRandomString(15), required: false },
];

export const resourceTypesData = [
  {
    clazz: PEARL_CLAZZ,
    pageTitle: "All Pearls table",
    selectFieldLabel: "Quantity Type",
    selectFieldValue: "Strand",
    fields: pearlFormFields,
    initialSku: "P.S.",
    clazzName: "Pearl",
    filter: "quantityType",
    filterButtonValues: ["All", "STRAND", "PIECE"],
  },
  {
    clazz: DIAMOND_CLAZZ,
    pageTitle: "All Diamonds table",
    selectFieldLabel: "Type",
    selectFieldValue: "Natural",
    fields: diamondFormFields,
    initialSku: "D.Nat.",
    clazzName: "Diamond",
    filter: "type",
    filterButtonValues: ["All", "NATURAL", "LAB GROWN"],
  },
  {
    clazz: DIAMON_MELEE_CLAZZ,
    pageTitle: "All Diamond Melees table",
    selectFieldLabel: "Type",
    selectFieldValue: "Natural",
    fields: diamondMeleeFormFields,
    initialSku: "D.M.Nat.",
    clazzName: "Diamond Melee",
    filter: "type",
    filterButtonValues: ["All", "NATURAL", "LAB GROWN"],
  },
  {
    clazz: COLORED_STONE_CLAZZ,
    pageTitle: "All Colored Stones table",
    fields: coloredStoneFormFields,
    initialSku: "CS.",
    clazzName: "Colored Stone",
    filter: "quantityType",
  },
  {
    clazz: COLORED_STONE_MELEE_CLAZZ,
    pageTitle: "All Colored Stone Melees table",
    fields: coloredStoneMeleeFormFields,
    initialSku: "CS.M.",
    clazzName: "Colored Stone Melee",
    filter: "quantityType",
  },
  {
    clazz: SEMI_PRECIOUS_STONE_CLAZZ,
    pageTitle: "All Semi Precious Stones table",
    selectFieldLabel: "Quantity Type",
    selectFieldValue: "Strand",
    fields: semiPreciousStoneFormFields,
    initialSku: "SP.S.",
    clazzName: "Semi Precious Stone",
    filter: "quantityType",
    filterButtonValues: ["All", "STRAND", "PIECE"],
  },
  {
    clazz: METAL_CLAZZ,
    pageTitle: "All Metals table",
    selectFieldLabel: "Type",
    selectFieldValue: "Gold",
    fields: metalFormFields,
    initialSku: "M.G.",
    clazzName: "Metal",
    filter: "type",
    filterButtonValues: ["All", "GOLD", "SILVER", "PLATINUM", "OTHER"],
  },
  {
    clazz: ELEMENT_CLAZZ,
    pageTitle: "All Elements table",
    fields: elementFormFields,
    initialSku: "E.P",
    clazzName: "Element",
  },
];
