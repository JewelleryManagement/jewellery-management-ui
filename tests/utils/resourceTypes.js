import {
  getRandomNumberAsString,
  getRandomString,
} from "./getRandomNumberOrString";

export const pearlFormFields = [
  { label: "Type", exact: true, value: getRandomString(4) },
  { label: "Size", value: getRandomNumberAsString() },
  { label: "Quality", value: getRandomString(4) },
  { label: "Quantity Type", value: getRandomString(4) },
  { label: "Color", value: getRandomString(4) },
  { label: "Shape", value: getRandomString(4) },
  { label: "Price per quantity", value: getRandomNumberAsString() },
  { label: "Note", value: getRandomString(10) },
];

export const metalFormFields = [
  { label: "Type", exact: true, value: getRandomString(4) },
  { label: "Quantity Type", value: getRandomString(4) },
  { label: "Purity", value: getRandomNumberAsString() },
  { label: "Color", value: getRandomString(4) },
  { label: "Plating", value: getRandomString(4) },
  { label: "Price per quantity", value: getRandomNumberAsString() },
  { label: "Note", value: getRandomString(10) },
];

export const elementFormFields = [
    { label: "Description", exact: true, value: getRandomString(10) },
    { label: "Quantity Type", value: getRandomString(4) },
    { label: "Price per quantity", value: getRandomNumberAsString() },
    { label: "Note", value: getRandomString(15) },
  ];

  export const preciousStoneFormFields = [
    { label: "Color", exact: true, value: getRandomString(4) },
    { label: "Carat", value: getRandomNumberAsString() },
    { label: "Cut", value: getRandomString(4) },
    { label: "Clarity", value: getRandomString(4) },
    { label: "dimensionX", value: getRandomNumberAsString() },
    { label: "dimensionY", value: getRandomNumberAsString() },
    { label: "dimensionZ", value: getRandomNumberAsString() },
    { label: "Quantity Type", value: getRandomString(4) },
    { label: "Shape", value: getRandomString(4) },
    { label: "Price per quantity", value: getRandomNumberAsString() },
    { label: "Note", value: getRandomString(15) },
  ];
  export const semiPreciousStoneFormFields = [
    { label: "Color", exact: true, value: getRandomString(4) },
    { label: "Cut", value: getRandomString(4) },
    { label: "Clarity", value: getRandomString(4) },
    { label: "Size", value: getRandomNumberAsString() },
    { label: "Quantity Type", value: getRandomString(4) },
    { label: "Shape", value: getRandomString(4) },
    { label: "Price per quantity", value: getRandomNumberAsString() },
    { label: "Note", value: getRandomString(15) },
  ];