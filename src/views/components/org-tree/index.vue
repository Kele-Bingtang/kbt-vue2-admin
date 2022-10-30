<template>
  <div class="org-tree-container">
    <el-card class="org-tree-card">
      <el-row :gutter="10" class="org-tree-header">
        <el-col :span="3" :xs="24" style="margin-top: 10px">
          <el-switch v-model="horizontal" active-text="竖排" inactive-text="横排"></el-switch>
        </el-col>
        <el-col :span="4" :xs="24" style="margin-top: 10px">
          <el-switch v-model="expandAll" active-text="展开全部" inactive-text="关闭全部"></el-switch>
        </el-col>
        <el-col :span="10" :xs="24">
          <el-form :model="searchParams" :inline="true">
            <el-form-item label="部门名称">
              <el-select v-model="searchParams.content" filterable clearable placeholder="请选择部门名称">
                <el-option
                  v-for="item in deptOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleQuery">查询</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>

      <div class="org-tree-content">
        <org-tree-view
          :data="data"
          :expand-all="expandAll"
          :horizontal="horizontal"
          :zoom-handled="zoomHandled"
          @node-click="handleNodeClick"
          @menu-click="menuClick"
        />
      </div>
    </el-card>

    <el-dialog
      :title="operator === 'look' ? '部门查看' : operator === 'edit' ? '部门修改' : '部门删除'"
      :visible.sync="dialogFormVisible"
      width="500px"
    >
      <el-form :model="form" :disabled="operator === 'look'">
        <el-form-item label="部门名称" label-width="120px">
          <el-input v-model="form.name" autocomplete="off" style="width: 206px"></el-input>
        </el-form-item>
        <el-form-item label="部门人数" label-width="120px">
          <el-input v-model="form.num" autocomplete="off" style="width: 206px"></el-input>
        </el-form-item>
        <el-form-item label="部门负责人" label-width="120px">
          <el-select v-model="form.leader" placeholder="请选择部门负责人" multiple clearable allow-create filterable>
            <el-option label="张三" value="张三"></el-option>
            <el-option label="李四" value="李四"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" v-if="operator !== 'look'">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="handleSure">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import OrgTreeView from "./components/org-tree-view.vue";
import { orgTreeData } from "@/test/org-tree";
import { OrgTree } from "./components/org-tree-view-next.vue";

@Component({
  components: { OrgTreeView },
})
export default class OrgTreeDemo extends Vue {
  public zoom = 100;
  public data = orgTreeData;
  public expandAll = true;
  public horizontal = false;
  public dialogFormVisible = false;
  public operator = "look";
  public nodeId = "";
  public searchParams = {
    content: "",
  };
  public searchNodeTree: Array<OrgTree> = [];

  public deptOptions = [
    {
      value: "KBT科技有限公司",
      label: "公司",
    },
    {
      value: "产品研发部",
      label: "产品研发部",
    },
    {
      value: "销售部",
      label: "销售部",
    },
    {
      value: "财务部",
      label: "财务部",
    },
    {
      value: "HR人事",
      label: "HR人事",
    },
  ];

  public form = {
    name: "",
    num: 0,
    leader: [""],
  };

  get zoomHandled() {
    return this.zoom / 100;
  }

  public handleQuery() {
    if (this.searchParams.content === "") {
      this.data = orgTreeData;
    } else {
      this.findName(orgTreeData, this.searchParams.content);
    }
  }

  public findName(data: OrgTree | Array<OrgTree>, name: string) {
    if (!Array.isArray(data)) {
      // 根节点
      if (data.name == name) {
        this.data = orgTreeData;
        return;
      } else if (data.children) {
        this.findName(data.children, name);
      }
    } else {
      for (let i = 0; i < data.length; i++) {
        let item = data[i];
        if (item.name == name) {
          this.searchNodeTree = [];
          this.searchNodeTree.push(item);
          this.data = this.searchNodeTree[0];
          return;
        } else if (item.children) {
          this.findName(item.children, name);
        }
      }
    }
  }

  public menuClick({ data, key }: { data: OrgTree; key: string }) {
    this.nodeId = data.id;
    if (key === "look") {
      this.handleLook(data);
    } else if (key === "edit") {
      this.handleEdit(data);
    } else if (key === "add") {
      this.handleAdd(data);
    } else if (key === "delete") {
      this.handleDelete(data);
    }
  }

  public handleLook(data: OrgTree) {
    this.operator = "look";
    this.form = {
      name: data.name,
      num: data.num,
      leader: data.leader,
    };
    this.dialogFormVisible = true;
  }
  public handleEdit(data: OrgTree) {
    this.operator = "edit";
    this.form = {
      name: data.name,
      num: data.num,
      leader: data.leader,
    };
    this.dialogFormVisible = true;
  }
  public handleAdd(data: OrgTree) {
    this.operator = "add";
    this.resetForm();
    this.dialogFormVisible = true;
  }
  public handleDelete(data: OrgTree) {
    this.$confirm("您确定删除吗？", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    })
      .then(() => {
        findNodeInTree(this.data, this.nodeId, 0, (item: OrgTree, deep: number, index: number, arr: Array<OrgTree>) => {
          if (deep === 1) {
            this.data = {
              id: "0",
              name: "",
              num: 0,
              leader: [],
            };
          } else if (deep === 2) {
            (this.data.children as any).splice(index, 1);
          } else {
            this.$message.info("目前数据是模拟数据，所以暂时支持前两层的修改，第三层包括之后的节点无法修改");
            return;
          }
          this.$message({
            type: "success",
            message: "删除成功!",
          });
        });
      })
      .catch(() => {
        this.$message({
          type: "info",
          message: "已取消删除",
        });
      });
  }

  public handleNodeClick(data: OrgTree) {}

  public handleSure() {
    findNodeInTree(this.data, this.nodeId, 0, (item: OrgTree, deep: number, index: number, arr: Array<OrgTree>) => {
      this.operator === "edit" ? this.editOneOrg(deep, index) : this.addOneOrg(deep, index);
    });
    this.dialogFormVisible = false;
    this.resetForm();
  }

  public editOneOrg(deep: number, index: number) {
    let name = ""; // 存储修改前的 name，这样可以知道查询的下拉值位置，并更新为修改后的 name
    if (deep === 1) {
      name = this.data.name;
      this.data = Object.assign({}, this.data, this.form);
    } else if (deep === 2) {
      name = (this.data.children as any)[index].name;
      (this.data.children as any)[index].name = this.form.name;
      (this.data.children as any)[index].num = this.form.num;
      (this.data.children as any)[index].leader = this.form.leader;
    } else {
      this.$message.info("目前数据是模拟数据，所以暂时支持前两层的修改，第三层包括之后的节点无法修改");
      return;
    }
    this.deptOptions.map(item => {
      if (item.value === name) {
        item.label = this.form.name;
        item.value = this.form.name;
      }
    });
  }

  public addOneOrg(deep: number, index: number) {
    let addForm = {
      ...this.form,
      id: (Math.random() * 100).toString(), // id 保证唯一
    };
    if (deep === 1) {
      this.data.children?.push(addForm);
    } else if (deep === 2) {
      if (!(this.data.children as any)[index].children) {
        this.$set((this.data.children as any)[index], "children", []);
      }
      (this.data.children as any)[index].children.push(addForm);
    } else {
      this.$message.info("目前数据是模拟数据，所以暂时支持前两层的添加，第三层包括之后的节点无法添加");
      return;
    }
    this.deptOptions.push({
      value: addForm.name,
      label: addForm.name,
    });
  }

  public handleClose() {
    this.dialogFormVisible = false;
    this.resetForm();
  }

  public resetForm() {
    this.form = {
      name: "",
      num: 0,
      leader: [],
    };
  }
}

function findNodeInTree(data: OrgTree | Array<OrgTree>, id: string, deep: number, callback: Function) {
  if (!Array.isArray(data)) {
    // 根节点
    if (data.id == id) {
      return callback(data, deep + 1, -1, data);
    } else if (data.children) {
      findNodeInTree(data.children, id, deep + 1, callback);
    }
  } else {
    for (let i = 0; i < data.length; i++) {
      let item = data[i];
      if (item.id == id) {
        return callback(item, deep + 1, i, data);
      }
      if (item.children) {
        findNodeInTree(item.children, id, deep + 1, callback);
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.org-tree-container {
  padding: 20px;
  width: 100%;
  height: 100%;
  .org-tree-card {
    width: 100%;
    height: 100%;
    .org-tree-header {
      margin-bottom: 50px;
    }
    .org-tree-content {
      position: relative;
      width: 100%;
      height: 100%;
    }
  }
}
</style>
