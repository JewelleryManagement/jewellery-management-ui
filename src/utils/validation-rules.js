export function useTextFieldRules() {
  return [
    (v) => !!v || `Input field is required`,
    (v) => (v && v.length <= 10) || "Input must be less than 10 characters",
  ];
}
export function useTextFieldLargeRules() {
  return [
    (v) => !!v || `Input field is required`,
    (v) => (v && v.length <= 50) || "Input must be less than 50 characters",
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

export function useEmailFieldRules() {
  return [
    (v) => !!v || "Email field is required",
    (v) => /.+@.+\..+/.test(v) || "Email must be valid",
    (v) => (v && v.length <= 100) || "Email must be less than 100 characters",
  ];
}

export function usePasswordFieldRules() {
  return [
    (v) => !!v || "Password field is required",
    (v) => v.length <= 100 || "Password must be less than 100 characters",
  ];
}

export function usePositiveNumberRules(currentValue) {
  return [
    (v) => v > 0 || "Please enter a positive number",
    (v) => v <= currentValue || "Value must be less than total quantity",
  ];
}

export function validateAuthors(authors) {
  if (authors.length === 0) {
    return "Please select at least one author.";
  }
  return true;
}

export function validateUser(value) {
  return !!value || "Please select a user";
}
