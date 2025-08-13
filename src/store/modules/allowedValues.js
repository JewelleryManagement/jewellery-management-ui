import AllowedValuesService from '../../services/AllowedValuesService';

const state = {
  // Structure: { [resourceClazz]: { [fieldName]: [values] } }
  allowedValues: {},
  loading: false,
  error: null,
};

const getters = {
  getAllowedValues: (state) => (resourceClazz, fieldName) => {
    return (
      state.allowedValues?.[resourceClazz]?.[fieldName] || []
    );
  },
};

const mutations = {
  SET_ALLOWED_VALUES(state, { resourceClazz, fieldName, values }) {
    if (!state.allowedValues[resourceClazz]) {
      state.allowedValues[resourceClazz] = {};
    }
    state.allowedValues[resourceClazz][fieldName] = values.filter(
      (v) => typeof v === 'string' && v.trim() !== ''
    );
  },
  ADD_ALLOWED_VALUE(state, { resourceClazz, fieldName, value }) {
    if (!state.allowedValues[resourceClazz]) {
      state.allowedValues[resourceClazz] = {};
    }
    if (!state.allowedValues[resourceClazz][fieldName]) {
      state.allowedValues[resourceClazz][fieldName] = [];
    }
    if (!state.allowedValues[resourceClazz][fieldName].includes(value)) {
      state.allowedValues[resourceClazz][fieldName].push(value);
    }
  },
  REMOVE_ALLOWED_VALUE(state, { resourceClazz, fieldName, value }) {
    if (
      state.allowedValues[resourceClazz] &&
      state.allowedValues[resourceClazz][fieldName]
    ) {
      state.allowedValues[resourceClazz][fieldName] = state.allowedValues[resourceClazz][fieldName].filter(
        (v) => v !== value
      );
    }
  },
  SET_LOADING(state, loading) {
    state.loading = loading;
  },
  SET_ERROR(state, error) {
    state.error = error;
  },
};

const actions = {
  async fetchAllowedValues({ commit }, { resourceClazz, fieldName }) {
    commit('SET_LOADING', true);
    try {
      const params = { resourceClazz, fieldName };
      const { data } = await AllowedValuesService.get(params);
      // Map to array of value strings only
      const values = Array.isArray(data) ? data.map((item) => item.value) : [];
      commit('SET_ALLOWED_VALUES', { resourceClazz, fieldName, values });
      commit('SET_ERROR', null);
    } catch (error) {
      commit('SET_ERROR', error);
    } finally {
      commit('SET_LOADING', false);
    }
  },
  async addAllowedValue({ commit }, { resourceClazz, fieldName, value }) {
    try {
      await AllowedValuesService.add({ resourceClazz, fieldName, value });
      commit('ADD_ALLOWED_VALUE', { resourceClazz, fieldName, value });
    } catch (error) {
      // Optionally handle error
    }
  },
  async deleteAllowedValue({ commit }, { resourceClazz, fieldName, value }) {
    try {
      await AllowedValuesService.delete({ resourceClazz, fieldName, value });
      commit('REMOVE_ALLOWED_VALUE', { resourceClazz, fieldName, value });
    } catch (error) {
      // Optionally handle error
    }
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
}; 