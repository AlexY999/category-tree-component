import { mount } from '@vue/test-utils';
import CategoryTree from '@/components/CategoryTree/CategoryTree.vue';
import CategoryNode from '@/components/CategoryTree/CategoryNode.vue';

describe('CategoryTree.vue', () => {
    let wrapper;
    const sampleData = [
        {
            id: '1',
            name: 'Europe',
            children: [
                {
                    id: '2',
                    name: 'Ukraine',
                    children: [],
                },
                {
                    id: '3',
                    name: 'Great britain',
                    children: [],
                },
            ],
        },
        {
            id: '4',
            name: 'Asia',
            children: [
                {
                    id: '5',
                    name: 'China',
                    children: [],
                },
            ],
        },
    ];

    beforeEach(() => {
        wrapper = mount(CategoryTree, {
            props: {
                data: sampleData,
            },
        });
    });

    it('renders input field correctly', () => {
        const input = wrapper.find('input');
        expect(input.exists()).toBe(true);
    });

    it('displays "No categories selected" message when no category is selected and search query is empty', () => {
        expect(wrapper.text()).toContain('No categories selected. Start typing to search.');
    });

    it('displays matching categories when search query is entered', async () => {
        const input = wrapper.find('input');
        await input.setValue('Ukraine');

        await new Promise(resolve => setTimeout(resolve, 300));
        await wrapper.vm.$nextTick();

        expect(wrapper.vm.filteredData.length).toBe(1);
        expect(wrapper.html()).toContain('Ukraine');
    });

    it('selects a category and displays it as selected', async () => {
        wrapper.vm.toggleNode(sampleData[0]);
        await wrapper.vm.$nextTick();

        expect(wrapper.vm.selectedNodes.length).toBe(3);
        expect(wrapper.vm.selectedNodes[0].name).toBe('Europe');
        expect(wrapper.text()).toContain('Europe');
    });

    it('removes a selected category when the remove button is clicked', async () => {
        wrapper.vm.toggleNode(sampleData[0]);
        await wrapper.vm.$nextTick();

        const removeButton = wrapper.find('.selected-tag button');
        await removeButton.trigger('click');

        expect(wrapper.vm.selectedNodes.length).toBe(0);
        expect(wrapper.text()).toContain('No categories selected. Start typing to search.');
    });

    it('ensures CategoryNode component receives correct props', async () => {
        wrapper.setData({ searchQuery: 'Ukraine', showTree: true });

        await new Promise(resolve => setTimeout(resolve, 300));
        await wrapper.vm.$nextTick();

        const categoryNodes = wrapper.findAllComponents(CategoryNode);

        expect(categoryNodes.length).toBe(2);

        const categoryNode = categoryNodes.at(1);
        expect(categoryNode.exists()).toBe(true);

        expect(categoryNode.props().node).toEqual({
            id: '2',
            name: 'Ukraine',
            children: [],
        });

        expect(categoryNode.props().selectedNodes).toEqual([]);
    });

    it('emits "update:selected" with the correct category IDs when selectedNodes changes', async () => {
        wrapper.vm.toggleNode(sampleData[0]);
        await wrapper.vm.$nextTick();

        expect(wrapper.emitted('update:selected')).toBeTruthy();
        expect(wrapper.emitted('update:selected')[0][0]).toEqual({
            categories: ['1', '2', '3'],
        });

        wrapper.vm.removeNodeWithChildren(sampleData[0]);
        await wrapper.vm.$nextTick();

        expect(wrapper.emitted('update:selected')[1][0]).toEqual({
            categories: []
        });
    });
});
