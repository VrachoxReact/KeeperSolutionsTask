<template>
  <div class="status-filter">
    <select v-model="selectedStatus" @change="onStatusChange">
      <option value="Active and Inactive">Active and Inactive</option>
      <option value="Active">Active</option>
      <option value="Inactive">Inactive</option>
    </select>
  </div>
</template>

<script>
import { ref } from "vue";

export default {
  name: "StatusFilter",
  emits: ["filter"],
  setup(props, { emit }) {
    const selectedStatus = ref("Active and Inactive");

    const onStatusChange = () => {
      emit("filter", selectedStatus.value);
    };

    return {
      selectedStatus,
      onStatusChange,
    };
  },
};
</script>

<style scoped>
.status-filter select {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
  background-color: white;
}
</style>
