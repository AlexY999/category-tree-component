<template>
  <li class="category-node">
    <div
        class="category-node__content"
        @click="toggleSelection"
        :class="{ 'category-node__content--selected': isSelected }"
    >
    <input
        type="checkbox"
        :checked="isSelected"
        @change.stop="toggleSelection"
    class="category-node__checkbox"
    />
    <slot :node="node">{{ node.name }}</slot>
    </div>

    <ul v-if="hasChildren" class="category-node__children">
      <CategoryNode
          v-for="child in node.children"
          :key="child.id"
          :node="child"
          :selectedNodes="selectedNodes"
          @toggleNode="$emit('toggleNode', $event)"
      />
    </ul>
  </li>
</template>

<script>
import '@/assets/css/category-tree.css'

export default {
  name: "CategoryNode",
  props: {
    node: {
      type: Object,
      required: true,
    },
    selectedNodes: {
      type: Array,
      required: true,
    },
  },
  computed: {
    isSelected() {
      return this.selectedNodes.some(n => n.id === this.node.id);
    },
    hasChildren() {
      return this.node.children && this.node.children.length > 0;
    },
  },
  methods: {
    toggleSelection() {
      this.$emit("toggleNode", this.node);
    },
  },
};
</script>