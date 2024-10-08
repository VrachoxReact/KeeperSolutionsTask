<template>
  <div v-if="role" class="role-card" :class="{ inactive: !role.active }">
    <div v-if="!role.active" class="inactive-badge">Inactive</div>
    <h2>{{ role.name }}</h2>
    <p class="role-type">{{ role.type }}</p>
    <p class="description">{{ role.description }}</p>
    <div class="user-images">
      <img
        v-for="user in role.users"
        :key="user.id"
        :src="user.photo_url"
        :alt="user.first_name"
        class="user-image"
      />
    </div>
    <div class="card-footer">
      <p class="date">Date created: {{ formatDate(role.created_on) }}</p>
      <div class="actions" v-if="role.editable">
        <button @click="$emit('edit', role.id)" class="edit-btn">EDIT</button>
        <button @click="$emit('delete', role.id)" class="delete-btn">
          DELETE
        </button>
      </div>
    </div>
    <div v-if="!role.editable" class="not-editable">
      <img src="@/assets/lock.svg" alt="Lock" class="lock-icon" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    role: {
      type: Object,
      required: true,
    },
  },
  methods: {
    formatDate(dateString) {
      // Implement your date formatting logic here
      return new Date(dateString).toLocaleDateString();
    },
  },
};
</script>

<style scoped>
.role-card {
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: relative;
  margin-bottom: 20px;
}

.inactive {
  opacity: 0.7;
}

h2 {
  font-size: 18px;
  margin-bottom: 5px;
  color: #333;
}

.role-type {
  color: #666;
  font-size: 14px;
  margin-bottom: 10px;
  text-transform: lowercase;
}

.description {
  font-size: 14px;
  margin-bottom: 15px;
  color: #555;
  line-height: 1.4;
}

.user-images {
  display: flex;
  margin-bottom: 15px;
}

.user-image {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  margin-right: 5px;
  border: 2px solid white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

.date {
  font-size: 12px;
  color: #888;
  margin-bottom: 15px;
}

.actions {
  display: flex;
  justify-content: flex-start;
  gap: 10px;
}

.edit-btn,
.delete-btn {
  padding: 5px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  text-transform: uppercase;
  font-weight: bold;
}

.edit-btn {
  background-color: #f0f0f0;
  color: #333;
}

.delete-btn {
  background-color: white;
  color: #dc3545;
  border: 1px solid #dc3545;
}

.not-editable {
  text-align: right;
  position: absolute;
  bottom: 20px;
  right: 20px;
}

.lock-icon {
  width: 20px;
  height: 20px;
  opacity: 0.5;
}

.inactive-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: #dc3545;
  color: white;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  text-transform: uppercase;
}
</style>
