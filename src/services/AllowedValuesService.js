import axios from "../axios.config";

const ALLOWED_VALUES_URL = "/allowed-values";

const AllowedValuesService = {
  get(params = {}) {
    return axios.get(ALLOWED_VALUES_URL, { params });
  },

  add({ resourceClazz, fieldName, value, sku }) {
    return axios.post(ALLOWED_VALUES_URL, {
      resourceClazz,
      fieldName,
      value,
      sku,
    });
  },

  delete({ resourceClazz, fieldName, value, sku }) {
    return axios.delete(ALLOWED_VALUES_URL, {
      data: { resourceClazz, fieldName, value, sku },
    });
  },
};

export default AllowedValuesService;
