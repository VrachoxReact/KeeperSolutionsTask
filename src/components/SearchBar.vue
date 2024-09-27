<template>
  <div class="search-bar">
    <input
      type="text"
      v-model="searchQuery"
      @input="onInput"
      placeholder="Search"
    />
  </div>
</template>

<script>
import { ref } from "vue";

export default {
  name: "SearchBar",
  emits: ["search"],
  setup(props, { emit }) {
    const searchQuery = ref("");

    const onInput = () => {
      emit("search", searchQuery.value);
    };

    return {
      searchQuery,
      onInput,
    };
  },
};
</script>

<style scoped>
.search-bar input {
  width: 200px;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
}
</style>
