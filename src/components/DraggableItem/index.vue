<template>
  <div class="drag-item-components">
    <div class="drag-item-header" :class="titleClass" :style="{ backgroundColor: titleBgColor }">
      <slot name="title">{{ title }}</slot>
    </div>
    <draggable :list="list" v-bind="$attrs" class="drag-item-content" :class="dragClass">
      <div v-for="item in list" :key="item.id" class="item">
        <slot name="content" :item="item">{{ item }}</slot>
      </div>
    </draggable>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import Draggable from "vuedraggable";

export interface DragItemList {
  id: string;
  name: string;
}

@Component({
  components: {
    Draggable,
  },
})
export default class DraggableItem extends Vue {
  @Prop({ default: "header" })
  public title!: string;
  @Prop({ default: () => [] })
  public list!: Array<DragItemList>;
  @Prop({ default: "" })
  public titleBgColor!: string;
  @Prop({ default: "" })
  public titleClass!: string;
  @Prop({ default: "" })
  public dragClass!: string;
}
</script>

<style lang="scss" scoped>
.drag-item-components {
  min-width: 300px;
  min-height: 100px;
  height: auto;
  overflow: hidden;
  background: #f0f0f0;
  border-radius: 3px;

  .drag-item-header {
    height: 50px;
    line-height: 50px;
    overflow: hidden;
    padding: 0 20px;
    text-align: center;
    background: #333;
    color: #fff;
    border-radius: 3px 3px 0 0;
  }

  .drag-item-content {
    height: auto;
    overflow: hidden;
    border: 10px solid transparent;
    min-height: 60px;
    display: flex;
    justify-content: flex-start;
    flex-direction: column;
    align-items: center;

    .item {
      cursor: pointer;
      width: 100%;
      height: 64px;
      margin: 5px 0;
      background-color: #fff;
      text-align: left;
      line-height: 54px;
      padding: 5px 10px;
      box-sizing: border-box;
      box-shadow: 0px 1px 3px 0 rgba(0, 0, 0, 0.2);
    }
  }
}
</style>
