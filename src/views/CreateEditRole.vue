<template>
  <div class="create-edit-role">
    <h1>{{ isEditing ? "Edit Role" : "Create New Role" }}</h1>
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="name">Role Name</label>
        <input id="name" v-model="role.name" type="text" required />
      </div>
      <div class="form-group">
        <label for="type">Role Type</label>
        <input id="type" v-model="role.type" type="text" required />
      </div>
      <div class="form-group">
        <label for="description">Description</label>
        <textarea
          id="description"
          v-model="role.description"
          required
        ></textarea>
      </div>
      <div class="form-group">
        <label>
          <input type="checkbox" v-model="role.active" />
          Active
        </label>
      </div>
      <div class="form-group">
        <label>
          <input type="checkbox" v-model="role.editable" />
          Editable
        </label>
      </div>
      <div class="form-actions">
        <button type="submit" class="submit-btn">
          {{ isEditing ? "Update Role" : "Create Role" }}
        </button>
        <button type="button" @click="cancel" class="cancel-btn">Cancel</button>
      </div>
    </form>
  </div>
</template>

<script>
import { ref, computed } from "vue";
import { useStore } from "vuex";
import { useRouter, useRoute } from "vue-router";

export default {
  name: "CreateEditRole",
  setup() {
    const store = useStore();
    const router = useRouter();
    const route = useRoute();

    const role = ref({
      name: "",
      type: "",
      description: "",
      active: true,
      editable: true,
    });

    const isEditing = computed(() => !!route.params.id);

    if (isEditing.value) {
      const roleId = parseInt(route.params.id);
      const existingRole = store.state.roles.find((r) => r.id === roleId);
      if (existingRole) {
        role.value = { ...existingRole };
      } else {
        router.push("/roles");
      }
    }

    const handleSubmit = async () => {
      try {
        if (isEditing.value) {
          await store.dispatch("updateRole", role.value);
        } else {
          await store.dispatch("createRole", role.value);
        }
        router.push("/roles");
      } catch (error) {
        console.error("Error saving role:", error);
        // Handle error (e.g., show error message)
      }
    };

    const cancel = () => {
      router.push("/roles");
    };

    return {
      role,
      isEditing,
      handleSubmit,
      cancel,
    };
  },
};
</script>

<style scoped>
.create-edit-role {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 5px;
}

input[type="text"],
textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

textarea {
  height: 100px;
}

.form-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.submit-btn,
.cancel-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.submit-btn {
  background-color: #28a745;
  color: white;
}

.cancel-btn {
  background-color: #6c757d;
  color: white;
}
</style>
