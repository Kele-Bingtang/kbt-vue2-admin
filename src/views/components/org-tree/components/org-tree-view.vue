<template>
  <div class="org-tree-view-container" @mousedown="mousedownView">
    <div class="org-tree-view-body" :style="orgTreeStyle">
      <vue2-org-tree
        v-if="data"
        :data="data"
        :horizontal="horizontal"
        :render-content="renderContent"
        label-class-name="show-name"
        selected-class-name="selected-node"
        selected-key="selectedKey"
        @on-expand="onExpand"
        @on-node-click="onNodeClick"
        collapsable
      ></vue2-org-tree>
    </div>
  </div>
</template>

<script>
export default {
  name: "OrgTreeView",
  props: {
    data: {
      required: true,
      type: Object,
    },
    expandAll: {
      type: Boolean,
      default: true,
    },
    horizontal: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      orgTreeOffsetLeft: 0,
      orgTreeOffsetTop: 0,
      initPageX: 0,
      initPageY: 0,
      oldMarginLeft: 0,
      oldMarginTop: 0,
      canMove: false,
    };
  },
  mounted() {
    this.toggleExpand(this.data, this.expandAll);
  },
  computed: {
    orgTreeStyle() {
      return {
        marginLeft: `${this.orgTreeOffsetLeft}px`,
        marginTop: `${this.orgTreeOffsetTop}px`,
      };
    },
  },
  watch: {
    expandAll(newValue) {
      this.toggleExpand(this.data, newValue);
    },
  },
  methods: {
    toggleExpand(data, expandAll) {
      if (Array.isArray(data)) {
        data.forEach(item => {
          this.$set(item, "expand", expandAll);
          if (item.children) {
            this.toggleExpand(item.children, expandAll);
          }
        });
      } else {
        this.$set(data, "expand", expandAll);
        if (data.children) {
          this.toggleExpand(data.children, expandAll);
        }
      }
    },
    collapse(list) {
      list.forEach(child => {
        if (child.expand) {
          child.expand = false;
        }
        child.children && this.collapse(child.children);
      });
    },
    onExpand(e, data) {
      if ("expand" in data) {
        data.expand = !data.expand;
        if (!data.expand && data.children) {
          this.collapse(data.children);
        }
      } else {
        this.$set(data, "expand", true);
      }
    },

    renderContent(h, data) {
      return (
        <div
          class="dropdown-container"
          on-contextmenu={() => this.handleRightClick(data)} // TODO：右键代替悬停，打开菜单
          on-mousedown={event => event.stopPropagation()}
        >
          <el-dropdown trigger="hover" on-command={this.handleCommand.bind(this, data)} placement="bottom-start">
            <span>{data.name}</span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="look">查看部门</el-dropdown-item>
              <el-dropdown-item command="edit">编辑部门</el-dropdown-item>
              <el-dropdown-item command="add">新增子部门</el-dropdown-item>
              <el-dropdown-item command="delete">删除部门</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      );
    },

    onNodeClick(e, data) {
      this.onExpand(e, data);
      this.$set(data, "selectedKey", !data.selectedKey);
      this.$emit("node-click", data);
    },

    handleRightClick(data, $event) {
      let event = $event || window.event;
      event.preventDefault ? event.preventDefault() : (event.returnValue = false);
      // this.$refs["${data.id}_dropdown"].show();
    },
    handleCommand(data, key) {
      this.$emit("menu-click", { data, key });
    },

    mousedownView(event) {
      this.canMove = true;
      this.initPageX = event.pageX;
      this.initPageY = event.pageY;
      this.oldMarginLeft = this.orgTreeOffsetLeft;
      this.oldMarginTop = this.orgTreeOffsetTop;
      document.addEventListener("mousemove", this.mousemoveView);
      document.addEventListener("mouseup", this.mouseupView);
    },
    mousemoveView(event) {
      if (!this.canMove) return;
      const { pageX, pageY } = event;
      this.orgTreeOffsetLeft = this.oldMarginLeft + pageX - this.initPageX;
      this.orgTreeOffsetTop = this.oldMarginTop + pageY - this.initPageY;
    },
    mouseupView() {
      this.canMove = false;
      document.removeEventListener("mousemove", this.mousemoveView);
      document.removeEventListener("mouseup", this.mousemoveView);
    },
  },
};
</script>

<style lang="scss">
.org-tree-view-container {
  position: absolute;
  top: 40px;
  left: 22%;
  cursor: move;
  .org-tree-node {
    .show-name {
      color: #fff;
      background-color: #738699;
      &:hover {
        background: #5d6c7b;
        transition: background 0.1s ease-in;
      }
      .el-dropdown {
        color: #fff;
      }
    }
    .org-tree-node-label .org-tree-node-label-inner {
      cursor: pointer;
    }
    &.is-leaf .org-tree-node-label .org-tree-node-label-inner {
      cursor: default;
    }
  }
}
</style>

<!-- Base Style -->
<style lang="scss">
.org-tree-container {
  display: inline-block;
  padding: 15px;
  background-color: #fff;
}

.org-tree {
  // display: inline-block;
  display: table;
  text-align: center;

  &:before,
  &:after {
    content: "";
    display: table;
  }

  &:after {
    clear: both;
  }
}

.org-tree-node,
.org-tree-node-children {
  position: relative;
  margin: 0;
  padding: 0;
  list-style-type: none;

  &:before,
  &:after {
    transition: all 0.35s ease;
  }
}
.org-tree-node-label {
  position: relative;
  display: inline-block;

  .org-tree-node-label-inner {
    padding: 10px 15px;
    text-align: center;
    border-radius: 3px;
    box-shadow: 0 1px 5px rgba(0, 0, 0, 0.15);
  }
}
.org-tree-node-btn {
  position: absolute;
  top: 100%;
  left: 50%;
  width: 20px;
  height: 20px;
  z-index: 10;
  margin-left: -11px;
  margin-top: 9px;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 50%;
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  transition: all 0.35s ease;

  &:hover {
    background-color: #e7e8e9;
    transform: scale(1.15);
  }

  &:before,
  &:after {
    content: "";
    position: absolute;
  }

  &:before {
    top: 50%;
    left: 4px;
    right: 4px;
    height: 0;
    border-top: 1px solid #ccc;
  }

  &:after {
    top: 4px;
    left: 50%;
    bottom: 4px;
    width: 0;
    border-left: 1px solid #ccc;
  }

  &.expanded:after {
    border: none;
  }
}
.org-tree-node {
  padding-top: 20px;
  display: table-cell;
  vertical-align: top;

  &.is-leaf,
  &.collapsed {
    padding-left: 10px;
    padding-right: 10px;
  }

  &:before,
  &:after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 50%;
    height: 19px;
  }

  &:after {
    left: 50%;
    border-left: 1px solid #ddd;
  }

  &:not(:first-child):before,
  &:not(:last-child):after {
    border-top: 1px solid #ddd;
  }
}
.collapsable .org-tree-node.collapsed {
  padding-bottom: 30px;

  .org-tree-node-label:after {
    content: "";
    position: absolute;
    top: 100%;
    left: 0;
    width: 50%;
    height: 20px;
    border-right: 1px solid #ddd;
  }
}
.org-tree > .org-tree-node {
  padding-top: 0;

  &:after {
    border-left: 0;
  }
}
.org-tree-node-children {
  padding-top: 20px;
  display: table;

  &:before {
    content: "";
    position: absolute;
    top: 0;
    left: 50%;
    width: 0;
    height: 20px;
    border-left: 1px solid #ddd;
  }

  &:after {
    content: "";
    display: table;
    clear: both;
  }
}

.horizontal {
  .org-tree-node {
    // display: flex;
    // flex-direction: row;
    // justify-content: flex-start;
    // align-items: center;
    display: table-cell;
    float: none;
    padding-top: 0;
    padding-left: 20px;

    &.is-leaf,
    &.collapsed {
      padding-top: 10px;
      padding-bottom: 10px;
    }

    &:before,
    &:after {
      width: 19px;
      height: 50%;
    }

    &:after {
      top: 50%;
      left: 0;
      border-left: 0;
    }

    &:only-child:before {
      top: 1px;
      border-bottom: 1px solid #ddd;
    }

    &:not(:first-child):before,
    &:not(:last-child):after {
      border-top: 0;
      border-left: 1px solid #ddd;
    }

    &:not(:only-child):after {
      border-top: 1px solid #ddd;
    }

    .org-tree-node-inner {
      display: table;
    }
  }

  .org-tree-node-label {
    display: table-cell;
    vertical-align: middle;
  }

  &.collapsable .org-tree-node.collapsed {
    padding-right: 30px;

    .org-tree-node-label:after {
      top: 0;
      left: 100%;
      width: 20px;
      height: 50%;
      border-right: 0;
      border-bottom: 1px solid #ddd;
    }
  }

  .org-tree-node-btn {
    top: 50%;
    left: 100%;
    margin-top: -11px;
    margin-left: 9px;
  }

  & > .org-tree-node:only-child:before {
    border-bottom: 0;
  }

  .org-tree-node-children {
    // display: flex;
    // flex-direction: column;
    // justify-content: center;
    // align-items: flex-start;
    display: table-cell;
    padding-top: 0;
    padding-left: 20px;

    &:before {
      top: 50%;
      left: 0;
      width: 20px;
      height: 0;
      border-left: 0;
      border-top: 1px solid #ddd;
    }

    &:after {
      display: none;
    }

    & > .org-tree-node {
      display: block;
    }
  }
}
</style>
