export function useTextFieldRules() {
  return [
    (v) => !!v || `Input field is required`,
    (v) => (v && v.length <= 10) || "Input must be less than 10 characters",
  ];
}

export function useNumberFieldRules() {
  return [
    (v) => !!v || `Input field is required`,
    (v) => (v && v > 0) || "Input must be a number larger than 0",
  ];
}

export function useTextAreaFieldRules() {
  return [
    (v) => !!v || `Input field is required`,
    (v) => (v && v.length <= 100) || "Input must be less than 100 characters",
  ];
}
