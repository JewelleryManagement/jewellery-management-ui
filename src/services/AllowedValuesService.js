import axios from '../axios.config';

const ALLOWED_VALUES_URL = '/allowed-values';

const AllowedValuesService = {
  // Get allowed values, optionally filtered by resourceClazz and/or fieldName
  get(params = {}) {
    return axios.get(ALLOWED_VALUES_URL, { params });
  },

  // Add a new allowed value
  add({ resourceClazz, fieldName, value }) {
    return axios.post(ALLOWED_VALUES_URL, { resourceClazz, fieldName, value });
  },

  // Delete an allowed value
  delete({ resourceClazz, fieldName, value }) {
    return axios.delete(ALLOWED_VALUES_URL, { data: { resourceClazz, fieldName, value } });
  },
};

export default AllowedValuesService; 