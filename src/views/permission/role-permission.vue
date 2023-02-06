<template>
  <div class="role-permission-container">
    <el-alert title="只有 Admin 有权限进入该页面" type="info" style="margin-bottom: 10px"></el-alert>

    <el-button type="primary" @click="handleCreateRole">新增</el-button>

    <el-table :data="rolesList" style="width: 100%; margin-top: 30px" border>
      <el-table-column prop="key" align="center" label="角色 Key" width="220"></el-table-column>
      <el-table-column prop="name" align="center" label="角色名" width="220"></el-table-column>
      <el-table-column prop="description" align="header-center" label="角色描述"></el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handleEdit(scope)">编辑</el-button>
          <el-button type="danger" size="small" @click="handleDelete(scope)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="dialogVisible" :title="dialogType === 'edit' ? '角色编辑' : '角色新增'">
      <el-form :model="role" label-width="80px" label-position="left">
        <el-form-item label="角色名">
          <el-input v-model="role.name" placeholder="请输入角色名" />
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input
            v-model="role.description"
            :autosize="{ minRows: 2, maxRows: 4 }"
            type="textarea"
            placeholder="请输入角色描述"
          />
        </el-form-item>
        <el-form-item label="Menus">
          <el-tree
            ref="tree"
            :data="routesTreeData"
            :props="defaultProps"
            :check-strictly="checkStrictly"
            show-checkbox
            node-key="path"
            class="permission-tree"
          />
        </el-form-item>
      </el-form>
      <div style="text-align: right">
        <el-button type="danger" @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmRole">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { RouteConfig } from "vue-router";
import { Tree } from "element-ui";
import { copyObj } from "@/utils";
import { MenuRoute } from "@/layout/components/SideMenu/index.vue";
import { PermissionModule } from "@/store/modules/permission";
import { UserModule } from "@/store/modules/user";
import { getTitle } from "@/utils/layout";

interface Role {
  key: number;
  name: string;
  description: string;
  routes: RouteConfig[];
}

interface RoutesTreeData {
  children: RoutesTreeData[];
  title: string;
  path: string;
}

const defaultRole: Role = {
  key: 0,
  name: "",
  description: "",
  routes: [],
};

@Component({ name: "RolePermission" })
export default class extends Vue {
  public row!: any;
  public scope!: any;

  public role = Object.assign({}, defaultRole);
  public serviceRoutes: RouteConfig[] = []; // 所有的路由
  public reshapedRoutes: RouteConfig[] = []; // 重组后的路由，重组过程去掉一些路由，如 alwaysShowRoot，hideInMenu 的路由
  public rolesList: Role[] = [];
  public dialogVisible = false;
  public dialogType = "new";
  public checkStrictly = false;
  public defaultProps = {
    children: "children",
    label: "title",
  };

  get routesTreeData() {
    return this.generateTreeData(this.reshapedRoutes);
  }

  created() {
    this.getRoutes();
    this.getRoles();
  }

  public async getRoutes() {
    this.serviceRoutes = PermissionModule.loadRoutes;
    this.reshapedRoutes = this.reshapeRoutes(PermissionModule.loadRoutes);
  }

  public async getRoles() {
    // 这里应该从后台获取 roles，其中内容为 Role 的类型。但直接从 UserModule 拿原来的 roles，因为是 string[]，所以需要添加额外的 Roles 信息
    UserModule.roles.forEach(role => {
      let item = {
        key: parseInt(Math.random() * 1000 + ""),
        name: role,
        description: role === "admin" ? "超级管理员" : role === "visitor" ? "游客" : "",
        routes: PermissionModule.loadRoutes, // 这里应该填角色实际拥有的路由权限
      };
      this.rolesList.push(item);
    });
  }
  /**
   * 生产树节点组件需要的信息
   */
  public generateTreeData(routes: RouteConfig[]) {
    const data: RoutesTreeData[] = [];
    for (const route of routes) {
      const tmp: RoutesTreeData = {
        children: [],
        title: "",
        path: "",
      };
      tmp.title = getTitle(route, this);
      tmp.path = (route.meta && route.meta._fullPath) || route.name || route.path;
      if (route.children) {
        tmp.children = this.generateTreeData(route.children);
      }
      data.push(tmp);
    }
    return data;
  }

  /**
   * 重塑路由结构，使其看起来与侧边栏相同
   */
  public reshapeRoutes(routes: RouteConfig[]) {
    const reshapedRoutes: Array<MenuRoute> = [];
    routes.forEach(route => {
      let r = { ...route };
      // 如果配置了 hideInMenu: true，则隐藏菜单，如果配置了 alwaysShowRoot: false | undefined 且子路由只有一个，则子路由成为一级菜单
      if (!r.meta || (r.meta && !r.meta.hideInMenu)) {
        // 如果存在 children
        if (r.children && r.children.length !== 0) {
          // 如果 children 长度为 1 且 alwaysShowRoot 为 false | undefined，则子路由成为一级菜单
          if (r.children.length === 1) {
            if (!r.meta || (r.meta && !r.meta.alwaysShowRoot)) {
              r = this.reshapeRoutes(r.children)[0];
            } else {
              r.children = this.reshapeRoutes(r.children);
            }
          } else {
            r.children = this.reshapeRoutes(r.children);
          }
        }
        if (r) {
          reshapedRoutes.push(r as MenuRoute);
        }
      }
    });
    return reshapedRoutes;
  }
  /**
   * 提取 children，将所有路由包括子路由放到数组里（同级）
   */
  public flattenRoutes(routes: RouteConfig[]) {
    let data: RouteConfig[] = [];
    routes.forEach(route => {
      data.push(route);
      if (route.children) {
        const temp = this.flattenRoutes(route.children);
        if (temp.length > 0) {
          data = [...data, ...temp];
        }
      }
    });
    return data;
  }

  public handleCreateRole() {
    this.role = Object.assign({}, defaultRole);
    if (this.$refs.tree) {
      (this.$refs.tree as Tree).setCheckedKeys([]);
    }
    this.dialogType = "new";
    this.dialogVisible = true;
  }

  public handleEdit(scope: any) {
    this.dialogType = "edit";
    this.dialogVisible = true;
    this.checkStrictly = true;
    this.role = copyObj(scope.row);
    this.$nextTick(() => {
      const routes = this.flattenRoutes(this.reshapeRoutes(this.role.routes));
      const treeData = this.generateTreeData(routes);
      const treeDataKeys = treeData.map(t => t.path);
      (this.$refs.tree as Tree).setCheckedKeys(treeDataKeys);
      // 设置节点的已检查状态不会影响其父节点和子节点
      this.checkStrictly = false;
    });
  }

  public handleDelete(scope: any) {
    const { $index, row } = scope;
    this.$confirm("确定删除该角色吗?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    })
      .then(async () => {
        this.rolesList.splice($index, 1);
        this.$message({
          type: "success",
          message: "删除成功！",
        });
      })
      .catch(err => {
        console.error(err);
      });
  }

  public async confirmRole() {
    const checkedKeys = (this.$refs.tree as Tree).getCheckedKeys();
    console.log(checkedKeys);
    this.role.routes = this.generateTree(copyObj(this.serviceRoutes), checkedKeys);
    if (this.dialogType === "edit") {
      for (let index = 0; index < this.rolesList.length; index++) {
        if (this.rolesList[index].key === this.role.key) {
          this.rolesList.splice(index, 1, Object.assign({}, this.role));
          break;
        }
      }
    } else {
      this.role.key = parseInt(Math.random() * 1000 + ""); // 没有后台，所以模拟出唯一的 key
      this.rolesList.push(this.role);
    }

    const { description, key, name } = this.role;
    this.dialogVisible = false;
    this.$notify({
      title: "Success",
      dangerouslyUseHTMLString: true,
      message: `
          <div>角色 Key: ${key}</div>
          <div>角色名: ${name}</div>
          <div>角色描述: ${description}</div>
        `,
      type: "success",
    });
  }
  /**
   * 找出在编辑或者新增中，选中的节点，赋值给 role
   */
  public generateTree(routes: RouteConfig[], checkedKeys: string[]) {
    const res: RouteConfig[] = [];
    for (const route of routes) {
      // 递归子路由
      if (route.children) {
        route.children = this.generateTree(route.children, checkedKeys);
      }
      if (checkedKeys.includes(route.meta && route.meta._fullPath) || (route.children && route.children.length >= 1)) {
        res.push(route);
      }
    }
    return res;
  }
}
</script>

<style lang="scss" scoped>
.role-permission-container {
  padding: 20px;
  .roles-table {
    margin-top: 30px;
  }

  .permission-tree {
    margin-bottom: 30px;
  }
}
</style>
