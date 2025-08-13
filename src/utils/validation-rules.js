export function useInputValidate() {
  return [(v) => !!v || `Input field is required`];
}

export function useTextFieldRules() {
  return [
    (v) => !!v || `Input field is required`,
    (v) => {
      if (typeof v === 'object' && v !== null && 'value' in v) {
        return v.value.length <= 35 || "Input must be less than 35 characters";
      }
      return (v && v.length <= 35) || "Input must be less than 35 characters";
    },
  ];
}
export function useTextFieldLargeRules() {
  return [
    (v) => !!v || `Input field is required`,
    (v) => {
      if (typeof v === 'object' && v !== null && 'value' in v) {
        return v.value.length <= 50 || "Input must be less than 50 characters";
      }
      return (v && v.length <= 50) || "Input must be less than 50 characters";
    },
  ];
}

export function useNumberFieldRules() {
  return [
    (v) => {
      if (typeof v === 'object' && v !== null && 'value' in v) {
        return !!v.value || `Input field is required`;
      }
      return !!v || `Input field is required`;
    },
    (v) => {
      const val = (typeof v === 'object' && v !== null && 'value' in v) ? v.value : v;
      return (val && val > 0) || "Input must be a number larger than 0";
    },
  ];
}

export function useAllNumberFieldRules() {
  return [
    (v) => {
      if (typeof v === 'object' && v !== null && 'value' in v) {
        return !!v.value || `Input field is required`;
      }
      return !!v || `Input field is required`;
    },
    (v) => {
      const val = (typeof v === 'object' && v !== null && 'value' in v) ? v.value : v;
      return !isNaN(parseFloat(val)) || "Input must be a valid number";
    },
  ];
}

export function useTextAreaFieldRules() {
  return [
    (v) => !!v || `Input field is required`,
    (v) => {
      if (typeof v === 'object' && v !== null && 'value' in v) {
        return v.value.length <= 100 || "Input must be less than 100 characters";
      }
      return (v && v.length <= 100) || "Input must be less than 100 characters";
    },
  ];
}

export function useDiscountFieldRules() {
  return [
    (v) => v !== undefined && v !== '' || "Input field is required",
    (v) => v === undefined || v >= 0 || "Discount should be 0 or above!",
    (v) => v === undefined || v <= 100 || "Discount should be 100 or below!",
  ];
}

export function useBarCodeValidationRules(value) {
  const regex = /^[0-9a-zA-Z!@#$%^&*()_'"+-={}[\]:;<>,.?~\\s]+$/;
  let messages = [];
  let isValid = true;

  const addRule = (message, isValidCondition) => {
    if (!isValidCondition) {
      messages.push(message);
      isValid = false;
    }
  };

  addRule("Input field is required", !!value);
  addRule("Only English letters and signs are allowed", regex.test(value));
  addRule(
    "Input must be less than 100 characters",
    value && value.length <= 100
  );

  return {
    messages: messages.join(", "),
    isValid,
  };
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
    (v) => (v && v.length > 0) || "Password field is required",
    (v) => !v || v.length <= 100 || "Password must be less than 100 characters",
  ];
}

export function usePositiveNumberRules(currentValue) {
  return [
    (v) => v > 0 || "Please enter a positive number",
    (v) => v <= currentValue || "Value must be less than total quantity",
  ];
}

export function validateAuthors(authors) {
  if (authors === undefined || authors === null) return "";
  if (authors.length === 0) return "Please select at least one author.";
  return true;
}

export function validateUser(value) {
  return !!value || "Please select a user";
}
export function validateOrgs(value) {
  return !!value || "Please select an organization";
}

export function useEmailValidationRule() {
  return [
    (v) => !!v || "Email field is required",
    (v) => /.+@.+\..+/.test(v) || "Email must be valid",
    (v) => (v && v.length <= 50) || "Email must be less than 50 characters",
  ];
}
