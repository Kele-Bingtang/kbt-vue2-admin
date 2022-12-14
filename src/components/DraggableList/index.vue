<template>
  <div class="drag-list-component">
    <div class="drag-list" :style="{ width: leftWidth }">
      <slot name="left-title">{{ leftTitle }}</slot>
      <draggable
        class="drag-left-list"
        :class="dragClass.left"
        :group="group"
        :list="leftList"
        v-bind="$attrs"
        @end="handleEnd($event, 'left')"
      >
        <div class="drag-list-item" v-for="item in leftList" :key="item.id" @click="handleClick(item.id, 'left')">
          <slot name="left" :item="item">{{ item }}</slot>
          <div class="left-icon icon" @click="pushList(item, 'left')"><slot name="leftIcon"></slot></div>
        </div>
      </draggable>
    </div>
    <div class="drag-list" :style="{ width: rightWidth }">
      <slot name="right-title">{{ rightTitle }}</slot>
      <draggable
        class="drag-right-list"
        :class="dragClass.right"
        :group="group"
        :list="rightList"
        v-bind="$attrs"
        @end="handleEnd($event, 'right')"
      >
        <div class="drag-list-item" v-for="item in rightList" :key="item.id" @click="handleClick(item.id, 'right')">
          <slot name="right" :item="item">{{ item }}</slot>
          <div class="right-icon icon" @click="pushList(item, 'right')"><slot name="rightIcon"></slot></div>
        </div>
      </draggable>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import Draggable from "vuedraggable";

export interface DragClass {
  left: string[];
  right: string[];
}

export interface DragList {
  id: string;
  name: string;
}

@Component({
  components: {
    Draggable,
  },
})
export default class DraggableList extends Vue {
  @Prop({ default: () => [] })
  public leftList!: DragList[];
  @Prop({ default: () => [] })
  public rightList!: DragList[];
  @Prop({ default: "" })
  public leftTitle!: string;
  @Prop({ default: "" })
  public rightTitle!: string;
  @Prop({ default: "48%" })
  public leftWidth!: string;
  @Prop({ default: "48%" })
  public rightWidth!: string;
  @Prop({
    default: () => {
      left: [];
      right: [];
    },
  })
  public dragClass!: DragClass;

  public group = "drag_list";

  public handleEnd(e: Event, type: string) {
    const srcClassName = (e.srcElement || (e.target as any)).classList[0];
    const targetClassName = (e as any).to.classList[0];
    let src = "";
    let target = "";
    if (srcClassName === targetClassName) {
      if (type === "left") {
        src = "left";
        target = "left";
      } else {
        src = "right";
        target = "right";
      }
    } else {
      if (type === "left") {
        src = "left";
        target = "right";
      } else {
        src = "right";
        target = "left";
      }
    }
    this.$emit("on-change", {
      src: src,
      target: target,
      oldIndex: (e as any).oldIndex,
      newIndex: (e as any).newIndex,
    });
  }

  public handleClick(id: string, type: string) {
    this.$emit("item-click", id, type);
  }

  public pushList(list: DragList, type: string) {
    let t1 = type === "left" ? "leftList" : "rightList"; // 点击的列表
    let t2 = type === "left" ? "rightList" : "leftList"; // 移入的列表
    let _this: any = this; // this 设为 any 才能使用动态变量
    let l = _this[t1];
    for (const item of l) {
      if (item.id === list.id) {
        const index = l.indexOf(item);
        l.splice(index, 1);
        break;
      }
    }
    _this[t2].push(list);
  }
}
</script>

<style lang="scss" scoped>
.drag-list-component {
  height: 100%;
  .drag-list {
    height: 100%;
    float: left;
    .drag-list-item {
      position: relative;
      line-height: inherit;
      .icon {
        position: absolute;
        line-height: inherit;
        top: 50%;
        transform: translateY(-50%);
        right: 7px;
      }
    }
  }
}
</style>
