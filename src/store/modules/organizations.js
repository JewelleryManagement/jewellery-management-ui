import {
  fetchOrgs,
  postOrg,
  getUserOrganizations,
  getResourceAvailabilityByOrganization,
  getUserOrganizationsByPermission,
  postResourceToOrg,
  removeResourceFromOrg,
  postResourceTranferToOrg,
  postUserToOrg,
  putUserToOrg,
  removeUserFromOrg,
  getOrganization,
} from "@/services/HttpClientService";

export default {
  namespaced: true,
  state: {
    //   selectedOrganization: {},
    //   organizations: [],
    //   tableColumns: [
    //     { key: "id", title: "Id", align: " d-none" },
    //     { key: "name", title: "Name" },
    //     { key: "address", title: "Address" },
    //     { key: "note", title: "Note" },
    //   ],
    //   userPermissions: [
    //     "DESTROY_ORGANIZATION",
    //     "MANAGE_USERS",
    //     "ADD_RESOURCE_QUANTITY",
    //     "REMOVE_RESOURCE_QUANTITY",
    //     "CREATE_PRODUCT",
    //     "EDIT_PRODUCT",
    //     "DISASSEMBLE_PRODUCT",
    //     "TRANSFER_PRODUCT",
    //     "CREATE_SALE",
    //     "RETURN_RESOURCE",
    //     "RETURN_PRODUCT",
    //     "TRANSFER_RESOURCE",
    //   ],
    //   tableColumnQuantity: { key: "quantity", title: "Quantity" },
    //   tableButtons: [
    //     { label: "Resources", icon: "mdi-diamond-stone" },
    //     { label: "Products", icon: "mdi-package-variant" },
    //     {
    //       label: "Members",
    //       icon: "mdi-account-multiple",
    //     },

    //     {
    //       label: "Events",
    //       icon: "mdi-calendar",
    //     },
    //   ],
    // },
    mutations: {
      //   setOrgs(state, organizations) {
      //     state.organizations = organizations;
      //   },
      //   setSelectedOrganization(state, selectedOrganization) {
      //     state.selectedOrganization = selectedOrganization;
      //   },
    },
    actions: {
      // async fetchOrgs({ commit }) {
      //   const res = await fetchOrgs();
      //   commit("setOrgs", res);
      // },
      // async fetchOrganizationResources({ commit }, orgId) {
      //   return await getResourceAvailabilityByOrganization(orgId);
      // },
      // async postOrg({ commit }, data) {
      //   await postOrg(data);
      // },
      // async fetchUserOrgsByPermission({ commit }, permission) {
      //   return await getUserOrganizationsByPermission(permission);
      // },
      // async postResourceToOrg({ commit }, data) {
      //   await postResourceToOrg(data);
      // },
      // async removeResourceFromOrg({ commit }, data) {
      //   const { organizationId, resourceId, quantity } = data;
      //   await removeResourceFromOrg(organizationId, resourceId, quantity);
      // },
      // async transferResourceFromOrg({ commit }, data) {
      //   await postResourceTranferToOrg(data);
      // },
      // async addUserToOrg({ commit }, data) {
      //   const { requestBody, orgId } = data;
      //   return await postUserToOrg(orgId, requestBody);
      // },
      // async editUserInOrg({ commit }, data) {
      //   const { userId, orgId, requestBody } = data;
      //   return await putUserToOrg(orgId, userId, requestBody);
      // },
      // async removeUser({ commit }, data) {
      //   const { userId, orgId } = data;
      //   return await removeUserFromOrg(orgId, userId);
      // },
      // async fetchOrganization({ commit }, id) {
      //   const data = await getOrganization(id);
      //   commit("setSelectedOrganization", data);
      //   return data;
      // },
    },
    getters: {
      // getOrgs: (state) => {
      //   if (state.organizations) return state.organizations;
      // },
      // getColumns: (state) => [...state.tableColumns],
      // getAllColumnsWithQuantityColumn: (state) => [
      //   state.tableColumnQuantity,
      //   ...state.tableColumns,
      // ],
      // getUserPermissions: (state) => state.userPermissions,
      // getTableButtons: (state) => state.tableButtons,
      //getSelectedOrganization: (state) => state.selectedOrganization,
    },
  },
};
