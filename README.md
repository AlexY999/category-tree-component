# Category Tree Component

A Vue 3 component that visualizes a category tree with search and multi-selection features. The component supports slots for customizing individual nodes and allows selecting all children when a parent node is selected.

## Features

- **Vue 3**: Built using Vue 3.
- **Search with Filtering**: Filter categories based on search input.
- **Slots Support**: Customize individual nodes with slots, providing access to all node data.
- **Multi-Selection**: Select a node and its children; deselecting also affects children.
- **Responsive UI**: Ensures a user-friendly experience.

## Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/AlexY999/category-tree-component

2. Navigate to the project directory:
   ```bash
   cd category-tree-component

3. Navigate to the project directory:
   ```bash
   npm install

## Usage
To use the CategoryTree component in your project, follow these steps:

- Import the CategoryTree folder (with CategoryTree.vue, CategoryNode.vue) and its associated CSS file into your project.

   ```bash
   <template>
      <CategoryTree :data="categoryData" v-model:selected="selectedCategories" />
      <div>
        <h3>Selected Categories:</h3>
        <pre>{{ selectedCategories }}</pre>
      </div>
    </template>
    
    <script>
    import CategoryTree from "@/components/CategoryTree/CategoryTree";
    
    export default {
      name: 'App',
      components: {
        CategoryTree
      },
      data() {
        return {
          categoryData: [
            // Your category data goes here
          ],
          selectedCategories: { categories: [] }
        };
      }
    }
    </script>

## Running Tests
To run tests for the component, use:
   ```bash
    npx jest  
   ```
or 
   ```bash
    npm run test:unit
   ```

## Development
   ```bash
   npm run serve
