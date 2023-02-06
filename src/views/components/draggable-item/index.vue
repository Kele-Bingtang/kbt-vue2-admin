<template>
  <div class="draggable-item-container">
    <draggable-item :key="1" :list="list1" :group="group" title-bg-color="#4A9FF9" title="Todo">
      <template #content="{ item }">
        {{ item.name }}
      </template>
    </draggable-item>
    <draggable-item :key="2" :list="list2" :group="group" title-bg-color="#F9944A">
      <template #title>Working</template>
      <template #content="{ item }">
        {{ item.name }}
      </template>
    </draggable-item>
    <draggable-item :key="3" :list="list3" :group="group" title-bg-color="#2AC06D">
      <template #title>Done</template>
      <template #content="{ item }">
        {{ item.name }}
      </template>
    </draggable-item>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import DraggableItem from "@/components/DraggableItem/index.vue";
import { list1, list2, list3 } from "@/test/drag-item";

@Component({ name: "DraggableItemDemo", components: { DraggableItem } })
export default class extends Vue {
  public group = "drag_item";
  public list1 = list1;
  public list2 = list2;
  public list3 = list3;
}
</script>

<style lang="scss" scoped>
.draggable-item-container {
  width: 1000px;
  height: 100%;
  padding: 20px;
  margin-left: 20px;
  display: flex;
  justify-content: space-around;
  flex-direction: row;
  align-items: flex-start;
}
</style>
