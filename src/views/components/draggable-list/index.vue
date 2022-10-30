<template>
  <div class="draggable-list-container">
    <el-card class="draggable-list-card">
      <div class="drag-card">
        <!-- 切记设置 list1 和 list2 属性时，一定要添加 .sync 修饰符 -->
        <draggable-list
          :left-list.sync="list1"
          :right-list.sync="list2"
          :drag-class="dragClass"
          @on-change="handleChange"
          @item-click="handleItemClick"
        >
          <h3 slot="left-title">待办事项</h3>
          <template #left="{ item }">
            <el-card class="drag-item">
              {{ item.name }}
            </el-card>
          </template>
          <template #leftIcon>
            <i style="color: var(--theme-color); font-size: 20px" class="el-icon-arrow-right" />
          </template>

          <h3 slot="right-title">完成事项</h3>
          <template #right="{ item }">
            <el-card class="drag-item">
              {{ item.name }}
            </el-card>
          </template>
          <template #rightIcon>
            <i style="color: var(--theme-color); font-size: 20px" class="el-icon-arrow-left" />
          </template>
        </draggable-list>
      </div>

      <el-card class="handle-card">
        <span slot="header">操作记录</span>
        <div class="handle-inner-card">
          <p v-for="(item, index) in handleList" :key="`handle_item_${index}`">{{ item }}</p>
        </div>
      </el-card>
      <el-card class="res-show-card">
        <pre>{{ list1 }}</pre>
      </el-card>
      <el-card class="res-show-card">
        <pre>{{ list2 }}</pre>
      </el-card>
    </el-card>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import DraggableList, { DragClass } from "@/components/DraggableList/index.vue";
import { list1, list2 } from "@/test/drag-list";

@Component({
  components: { DraggableList },
})
export default class DraggableListDemo extends Vue {
  public dragClass: DragClass = {
    left: ["drag-box", "left-drag-box"],
    right: ["drag-box", "right-drag-box"],
  };

  public list1 = list1;

  public list2 = list2;

  public handleList: string[] = [];

  public handleChange({ src, target, oldIndex, newIndex }: any) {
    this.handleList.push(`${src} => ${target}, ${oldIndex} => ${newIndex}`);
  }

  public handleItemClick(id: string, type: string) {
    console.log(`您点击了 ${type} 的 ${id} 内容`);
  }
}
</script>

<style lang="scss" scoped>
.draggable-list-container {
  width: 100%;
  height: 100%;
  padding: 20;
  .draggable-list-card {
    width: 100%;
    height: 100%;
    .drag-card {
      width: 40%;
      height: 100%;
      display: inline-block;
    }
  }
  .handle-card {
    display: inline-block;
    width: 220px;
    height: 100%;
    .handle-inner-card {
      p {
        padding: 7px 0;
        margin: 0 7px;
        border-bottom: 1px dashed #eeeeee;
      }
    }
  }
  .res-show-card {
    display: inline-block;
    margin-left: 20px;
    width: 370px;
    height: 100%;
  }
}
</style>
<style lang="scss">
.draggable-list-container {
  .draggable-list-card {
    .el-card__body {
      width: 100%;
      height: 100%;
    }
  }
  .drag-box {
    margin-right: 10px;
    height: calc(100% - 60px);
  }
}
</style>
