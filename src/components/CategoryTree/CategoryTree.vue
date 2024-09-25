<template>
  <div>
    <input
        v-model="searchQuery"
        @input="debouncedSearch"
        @focus="onFocus"
        @blur="onBlur"
        placeholder="Search categories..."
    />

    <ul v-if="shouldShowTree">
      <CategoryNode
          v-for="node in filteredData"
          :key="node.id"
          :node="node"
          :selectedNodes="selectedNodes"
          @toggleNode="toggleNode"
      />
    </ul>

    <div v-else>
      <div v-if="selectedNodes.length === 0 && searchQuery === ''">
        <p>No categories selected. Start typing to search.</p>
      </div>
      <div v-else>
        <div>
          <span
              v-for="node in selectedNodes"
              :key="node.id"
              class="selected-tag"
          >
            {{ node.name }}
            <button @click="removeCategory(node.id)">x</button>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CategoryNode from "./CategoryNode.vue";
import '@/assets/css/category-tree.css'

function debounce(fn, delay) {
  let timeout;
  return function (...args) {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}

export default {
  name: "CategoryTree",
  components: { CategoryNode },
  props: {
    data: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      searchQuery: "",
      selectedNodes: [],
      isFocused: false,
    };
  },
  watch: {
    selectedNodes: {
      handler() {
        const selectedIds = this.selectedNodes.map(node => node.id);
        this.$emit("update:selected", { categories: selectedIds });
      },
      deep: true,
    },
  },
  computed: {
    filteredData() {
      if (!this.searchQuery) return this.data;
      return this.filterTree(this.data, this.searchQuery.toLowerCase());
    },
    shouldShowTree() {
      return this.isFocused || (this.filteredData.length > 0 && this.searchQuery !== '');
    }
  },
  methods: {
    filterTree(nodes, query) {
      return nodes
          .map(node => {
            const children = this.filterTree(node.children, query);
            if (node.name.toLowerCase().startsWith(query) || children.length) {
              return { ...node, children };
            }
            return null;
          })
          .filter(node => node !== null);
    },
    toggleNode(node) {
      if (this.isNodeSelected(node)) {
        this.removeNodeWithChildren(node);
      } else {
        this.addNodeWithAllChildren(node);
      }
      this.searchQuery = "";
    },
    addNodeWithAllChildren(node) {
      const fullNode = this.findNodeById(this.data, node.id);
      if (fullNode && !this.selectedNodes.some(n => n.id === fullNode.id)) {
        this.selectedNodes.push({ id: fullNode.id, name: fullNode.name });
        if (fullNode.children) {
          fullNode.children.forEach(child => this.addNodeWithAllChildren(child));
        }
      }
    },
    removeNodeWithChildren(node) {
      this.selectedNodes = this.selectedNodes.filter(n => n.id !== node.id);
      if (node.children) {
        node.children.forEach(child => this.removeNodeWithChildren(child));
      }
    },
    isNodeSelected(node) {
      return this.selectedNodes.some(selected => selected.id === node.id);
    },
    removeCategory(nodeId) {
      const node = this.findNodeById(this.data, nodeId);
      if (node) {
        this.removeNodeWithChildren(node);
      }
    },
    findNodeById(nodes, id) {
      for (const node of nodes) {
        if (node.id === id) return node;
        if (node.children) {
          const foundNode = this.findNodeById(node.children, id);
          if (foundNode) return foundNode;
        }
      }
      return null;
    },
    debouncedSearch: debounce(function () {
      this.$forceUpdate();
    }, 300),
    onFocus() {
      this.isFocused = true;
    },
    onBlur() {
      setTimeout(() => {
        this.isFocused = false;
      }, 200);
    },
  },
};
</script>