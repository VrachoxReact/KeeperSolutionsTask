import { createStore } from "vuex";

// Helper function to save state to localStorage
const saveState = (state) => {
  localStorage.setItem("userRoles", JSON.stringify(state.roles));
};

export default createStore({
  state: {
    roles: [],
    searchQuery: "",
    statusFilter: "Active and Inactive",
    loading: false,
    error: null,
  },
  mutations: {
    setRoles(state, roles) {
      state.roles = roles;
      saveState(state);
    },
    addRole(state, role) {
      state.roles.push(role);
      saveState(state);
    },
    updateRole(state, updatedRole) {
      const index = state.roles.findIndex((role) => role.id === updatedRole.id);
      if (index !== -1) {
        state.roles.splice(index, 1, updatedRole);
        saveState(state);
      }
    },
    deleteRole(state, roleId) {
      state.roles = state.roles.filter((role) => role.id !== roleId);
      saveState(state);
    },
    setSearchQuery(state, query) {
      state.searchQuery = query;
    },
    setStatusFilter(state, filter) {
      state.statusFilter = filter;
    },
    setLoading(state, isLoading) {
      state.loading = isLoading;
    },
    setError(state, error) {
      state.error = error;
    },
  },
  actions: {
    async fetchRoles({ commit }) {
      try {
        const response = await fetch("/user_roles.json");
        const roles = await response.json();
        commit("setRoles", roles);
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    },
    async createRole({ commit, state }, roleData) {
      commit("setLoading", true);
      commit("setError", null);
      try {
        const newId = Math.max(...state.roles.map((r) => r.id), 0) + 1;
        const newRole = {
          ...roleData,
          id: newId,
          created_on: new Date().toISOString(),
          modified_on: new Date().toISOString(),
          users: [], // Add an empty users array
        };
        commit("addRole", newRole);
        return newRole;
      } catch (error) {
        console.error("Error creating role:", error);
        commit("setError", "Failed to create role. Please try again.");
        throw error;
      } finally {
        commit("setLoading", false);
      }
    },
    async updateRole({ commit }, roleData) {
      commit("setLoading", true);
      commit("setError", null);
      try {
        const updatedRole = {
          ...roleData,
          modified_on: new Date().toISOString(),
        };
        commit("updateRole", updatedRole);
        return updatedRole;
      } catch (error) {
        console.error("Error updating role:", error);
        commit("setError", "Failed to update role. Please try again.");
        throw error;
      } finally {
        commit("setLoading", false);
      }
    },
    async deleteRole({ commit }, roleId) {
      commit("setLoading", true);
      commit("setError", null);
      try {
        commit("deleteRole", roleId);
      } catch (error) {
        console.error("Error deleting role:", error);
        commit("setError", "Failed to delete role. Please try again.");
        throw error;
      } finally {
        commit("setLoading", false);
      }
    },
    updateSearchQuery({ commit }, query) {
      commit("setSearchQuery", query);
    },
    updateStatusFilter({ commit }, filter) {
      commit("setStatusFilter", filter);
    },
  },
  getters: {
    filteredRoles: (state) => {
      return state.roles.filter((role) => {
        const matchesSearch = role.name
          .toLowerCase()
          .includes(state.searchQuery.toLowerCase());
        const matchesStatus =
          state.statusFilter === "Active and Inactive" ||
          (state.statusFilter === "Active" && role.active) ||
          (state.statusFilter === "Inactive" && !role.active);
        return matchesSearch && matchesStatus;
      });
    },
  },
});
