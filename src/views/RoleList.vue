<template>
  <div class="role-list">
    <h1>User Roles Management</h1>
    <div class="controls">
      <SearchBar @search="onSearch" />
      <StatusFilter @filter="onFilter" />
      <button @click="createNewRole" class="create-role-btn">
        CREATE NEW ROLE
      </button>
    </div>
    <div v-if="loading" class="loading">Loading roles...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else class="role-cards">
      <RoleCard
        v-for="role in filteredRoles"
        :key="role.id"
        :role="role"
        @edit="editRole"
        @delete="confirmDelete"
      />
    </div>

    <!-- Custom Alert -->
    <div v-if="alert" class="custom-alert" :class="alert.type">
      {{ alert.message }}
      <button @click="dismissAlert" class="dismiss-btn">×</button>
    </div>

    <!-- Confirmation Modal -->
    <div v-if="showConfirmModal" class="confirm-modal">
      <div class="confirm-modal-content">
        <p>Are you sure you want to delete this role?</p>
        <button @click="performDelete" class="confirm-btn">Yes, Delete</button>
        <button @click="cancelDelete" class="cancel-btn">Cancel</button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
import SearchBar from "@/components/SearchBar.vue";
import StatusFilter from "@/components/StatusFilter.vue";
import RoleCard from "@/components/RoleCard.vue";

export default {
  name: "RoleList",
  components: {
    SearchBar,
    StatusFilter,
    RoleCard,
  },
  data() {
    return {
      alert: null,
      showConfirmModal: false,
      roleToDelete: null,
    };
  },
  computed: {
    ...mapState(["loading", "error"]),
    ...mapGetters(["filteredRoles"]),
  },
  methods: {
    ...mapActions([
      "fetchRoles",
      "updateSearchQuery",
      "updateStatusFilter",
      "deleteRole",
    ]),
    onSearch(query) {
      this.updateSearchQuery(query);
    },
    onFilter(filter) {
      this.updateStatusFilter(filter);
    },
    createNewRole() {
      this.$router.push("/roles/create");
    },
    editRole(roleId) {
      this.$router.push(`/roles/${roleId}/edit`);
    },
    confirmDelete(roleId) {
      this.roleToDelete = roleId;
      this.showConfirmModal = true;
    },
    async performDelete() {
      try {
        await this.deleteRole(this.roleToDelete);
        this.showAlert("Role deleted successfully", "success");
      } catch (error) {
        this.showAlert("Failed to delete role. Please try again.", "error");
      } finally {
        this.showConfirmModal = false;
        this.roleToDelete = null;
      }
    },
    cancelDelete() {
      this.showConfirmModal = false;
      this.roleToDelete = null;
    },
    showAlert(message, type = "info") {
      this.alert = { message, type };
      setTimeout(() => this.dismissAlert(), 5000);
    },
    dismissAlert() {
      this.alert = null;
    },
  },
  created() {
    this.fetchRoles();
  },
};
</script>

<style scoped>
.role-list {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

h1 {
  font-size: 24px;
  margin-bottom: 20px;
}

.controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.create-role-btn {
  background-color: #5bc0de;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

.role-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.create-role-btn:hover {
  background-color: #218838;
}

.loading,
.error {
  text-align: center;
  padding: 20px;
  font-size: 18px;
}

.error {
  color: #dc3545;
}

.custom-alert {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 10px 20px;
  border-radius: 4px;
  color: white;
  font-weight: bold;
  z-index: 1000;
}

.custom-alert.success {
  background-color: #28a745;
}

.custom-alert.error {
  background-color: #dc3545;
}

.custom-alert .dismiss-btn {
  margin-left: 10px;
  background: none;
  border: none;
  color: white;
  font-size: 20px;
  cursor: pointer;
}

.confirm-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.confirm-modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 4px;
  text-align: center;
}

.confirm-modal-content button {
  margin: 0 10px;
  padding: 5px 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.confirm-modal-content .confirm-btn {
  background-color: #dc3545;
  color: white;
}

.confirm-modal-content .cancel-btn {
  background-color: #6c757d;
  color: white;
}
</style>
