import AllowedValuesService from "../../services/AllowedValuesService";

const state = {
  // Structure: { [resourceClazz]: { [fieldName]: [values] } }
  allowedValues: {},
  allowedValueDetails: {},
  loading: false,
  error: null,
};

const getters = {
  getAllowedValues: (state) => (resourceClazz, fieldName) => {
    return state.allowedValues?.[resourceClazz]?.[fieldName] || [];
  },

  getAllowedValueDetails: (state) => state.allowedValueDetails,
};

const mutations = {
  SET_ALLOWED_VALUES(state, { resourceClazz, fieldName, values }) {
    if (!state.allowedValues[resourceClazz]) {
      state.allowedValues[resourceClazz] = {};
    }

    state.allowedValues[resourceClazz][fieldName] = values;
  },
  ADD_ALLOWED_VALUE(state, { resourceClazz, fieldName, fieldValue }) {
    if (!state.allowedValues[resourceClazz]) {
      state.allowedValues[resourceClazz] = {};
    }
    if (!state.allowedValues[resourceClazz][fieldName]) {
      state.allowedValues[resourceClazz][fieldName] = [];
    }
    if (!state.allowedValues[resourceClazz][fieldName].includes(fieldValue)) {
      state.allowedValues[resourceClazz][fieldName].push(fieldValue);
    }
  },
  REMOVE_ALLOWED_VALUE(state, { resourceClazz, fieldName, fieldValue }) {
    if (
      state.allowedValues[resourceClazz] &&
      state.allowedValues[resourceClazz][fieldName]
    ) {
      state.allowedValues[resourceClazz][fieldName] = state.allowedValues[
        resourceClazz
      ][fieldName].filter((v) => v !== fieldValue);
    }
  },
  SET_LOADING(state, loading) {
    state.loading = loading;
  },
  SET_ERROR(state, error) {
    state.error = error;
  },

  SET_ALLOWED_VALUE_DETAIL(state, newObj) {
    const key = Object.keys(newObj)[0];
    state.allowedValueDetails[key] = newObj[key];
  },

  CLEAR_ALLOWED_VALUE_DETAILS(state) {
    state.allowedValueDetails = {};
  },
};

const actions = {
  async fetchAllowedValues({ commit }, { resourceClazz, fieldName }) {
    commit("SET_LOADING", true);
    try {
      const params = { resourceClazz, fieldName };
      const { data } = await AllowedValuesService.get(params);
      // Map to array of value strings only
      const values = Array.isArray(data)
        ? data.map((item) => ({
            value: item.value,
            sku: item.sku,
          }))
        : [];
      commit("SET_ALLOWED_VALUES", { resourceClazz, fieldName, values });
      commit("SET_ERROR", null);
    } catch (error) {
      commit("SET_ERROR", error);
    } finally {
      commit("SET_LOADING", false);
    }
  },
  async addAllowedValue({ commit }, { resourceClazz, fieldName, fieldValue }) {
    try {
      const { value, sku } = fieldValue;
      await AllowedValuesService.add({ resourceClazz, fieldName, value, sku });
      commit("ADD_ALLOWED_VALUE", { resourceClazz, fieldName, fieldValue });
    } catch (error) {
      // Optionally handle error
    }
  },
  async deleteAllowedValue(
    { commit },
    { resourceClazz, fieldName, fieldValue }
  ) {
    try {
      const { value, sku } = fieldValue;
      await AllowedValuesService.delete({
        resourceClazz,
        fieldName,
        value,
        sku,
      });
      commit("REMOVE_ALLOWED_VALUE", { resourceClazz, fieldName, fieldValue });
    } catch (error) {
      // Optionally handle error
    }
  },
  setAllowedValueDetail({ commit }, newObj) {
    commit("SET_ALLOWED_VALUE_DETAIL", newObj);
  },
  clearAllowedValueDetails({ commit }) {
    commit("CLEAR_ALLOWED_VALUE_DETAILS");
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
