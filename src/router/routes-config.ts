import { Route, RouteConfig } from "vue-router";
import Layout from "@/layout/index.vue";

/**
  可配置的参数:
  path: string                                路由的地址，这是必须设置的，如果是个有效的 http 或者 https 链接，则点击该菜单跳转到新窗口
  name: string | "_noUseI18n_xxx"             路由的名字，这是必须设置的，如果开启了 I18n，某些路由又不想使用 I18n，则 name 以 _noUseI18n- 开头
  redirect: string | function                 重定向到某个路由下，可选，function 使用方式请看官网：https://router.vuejs.org/zh/api/index.html#redirect

  ......

  meta: {
    roles: ['admin', 'visitor']               可访问该页面的权限数组，当前路由设置的权限会影响子路由
    title: { string | number | Function }
                    显示在侧边栏、面包屑和标签栏的文字
                    使用 '{{ 多语言字段 }}' 形式结合「多语言」使用
                    可以传入一个回调函数，参数是当前路由对象 to
    notClickBread: boolean                    如果为 true，则该路由无法在面包屑中被点击，默认为 false
    hideInBread: boolean                      如果为 true，则该路由将不会出现在面包屑中，默认为 false
    hideInMenu: boolean                       如果为 true，则该路由不会显示在左侧菜单，默认为 false
    alwaysShowRoot: boolean                   如果为 false 且某一级路由下只有一个二级路由，则左侧菜单直接显示该二级路由，如果为 true，则总会让一级菜单作为下拉菜单，默认为 false，仅限父级路由使用
    notCache: boolean                         如果为 true，该路由在切换标签后不会缓存，如果需要缓存，则「必须」设置页面组件 name 属性（class 名）和路由配置的 name 一致，默认为 false
    icon: string                              该页面在左侧菜单、面包屑显示的图标，无默认值
    fixedInNav: boolean                       如果为 true，则该路由按照路由表顺序依次标签固定在标签栏，默认为 false
    beforeCloseName: 'before_close_normal'    如果设置该字段，则在关闭当前 tab 页时会去 @/router/before-close.js 里寻找该字段名「对应」的方法，作为关闭前的钩子函数，无默认值
    activeMenu: ''                            Restful 路由搭配使用，指定某个菜单高亮
  }
 */

type RouteConfigAndMeta = RouteConfig & {
  meta?: {
    roles?: string[];
    title?: string | number | Function;
    notClickBread?: boolean;
    hideInBread?: boolean;
    hideInMenu?: boolean;
    alwaysShowRoot?: boolean;
    notCache?: boolean;
    icon?: string;
    fixedInNav?: boolean | number;
    beforeCloseName?: string;
    activeMenu?: string;
  };
};

export type fullRoute = RouteConfig & {
  meta: {
    _fullPath: string; // 完整的路由（针对二级路由以上）
  };
};

export const constantRoutes: Array<RouteConfigAndMeta> = [
  // 用来解决路由重复跳转问题：因为无法利用路由直接跳转，所以利用 views/redirect/Index.vue 组件实现跳转
  {
    path: "/redirect",
    component: Layout,
    meta: { hideInMenu: true },
    children: [
      {
        path: "/redirect/:path(.*)",
        component: () => import("@/views/redirect/index.vue"),
      },
    ],
  },
  {
    path: "/profile",
    redirect: "/profile/index",
    component: Layout,
    meta: { hideInMenu: true },
    children: [
      {
        path: "index",
        name: "Profile",
        component: () => import("@/views/profile/index.vue"),
        meta: { title: "我的主页" },
      },
    ],
  },
  {
    path: "/message",
    redirect: "/message/index",
    component: Layout,
    meta: { hideInMenu: true },
    children: [
      {
        path: "index",
        name: "MessageCenter",
        component: () => import("@/views/message-center/index.vue"),
        meta: { title: "我的消息" },
      },
    ],
  },
  {
    path: "/error-logger",
    redirect: "/error-logger/index",
    component: Layout,
    meta: { hideInMenu: true },
    children: [
      {
        path: "index",
        name: "ErrorLogger",
        component: () => import("@/views/error-page/index.vue"),
        meta: { title: "错误日志" },
      },
    ],
  },
];

export const rolesRoutes: Array<RouteConfigAndMeta> = [
  {
    path: "/",
    component: Layout,
    redirect: "/home",
    children: [
      {
        path: "home",
        name: "Home",
        component: () => import("@/views/home/index.vue"),
        meta: { title: "首页", icon: "el-icon-s-home", fixedInNav: true },
      },
    ],
  },
  {
    path: "/components",
    component: Layout,
    name: "Components",
    meta: {
      notClickBread: true,
      title: "组件",
      icon: "component",
    },
    children: [
      {
        path: "/count-to",
        name: "CountToDemo",
        component: () => import("@/views/components/count-to/index.vue"),
        meta: { title: "数字渐变", icon: "el-icon-star-on" },
      },
      {
        path: "/images-clipper",
        name: "ClipperDemo",
        component: () => import("@/views/components/cropper/index.vue"),
        meta: { title: "数字渐变", icon: "el-icon-star-on" },
      },
      {
        path: "/split-pane",
        name: "SplitPaneDemo",
        component: () => import("@/views/components/split-pane/index.vue"),
        meta: { title: "分割窗口", icon: "el-icon-star-on" },
      },
      {
        path: "/org-tree",
        name: "OrgTreeDemo",
        component: () => import("@/views/components/org-tree/index.vue"),
        meta: { title: "组织结构树", icon: "el-icon-star-on" },
      },
      {
        path: "/animation-mixin",
        name: "AnimationMixinDemo",
        component: () => import("@/views/components/animation-mixin/index.vue"),
        meta: { title: "动画混入", icon: "el-icon-star-on" },
      },
      {
        path: "/draggable-list",
        name: "DraggableListDemo",
        component: () => import("@/views/components/draggable-list/index.vue"),
        meta: { title: "列表拖拽", icon: "el-icon-star-on" },
      },
      {
        path: "/draggable-item",
        name: "DraggableItemDemo",
        component: () => import("@/views/components/draggable-item/index.vue"),
        meta: { title: "面板拖拽", icon: "el-icon-star-on" },
      },
      {
        path: "/draggable-dialog",
        name: "DraggableDialogDemo",
        component: () => import("@/views/components/draggable-dialog/index.vue"),
        meta: { title: "模态框拖拽", icon: "el-icon-star-on" },
      },
      {
        path: "/drag-drawer",
        name: "DragDrawerDemo",
        component: () => import("@/views/components/drag-drawer/index.vue"),
        meta: { title: "抽屉拖拽", icon: "el-icon-star-on" },
      },
      {
        path: "/tinymce",
        name: "TinymceDemo",
        component: () => import("@/views/components/tinymce/index.vue"),
        meta: { title: "富文本", icon: "el-icon-star-on" },
      },
      {
        path: "/code-mirror",
        name: "CodeMirrorDemo",
        component: () => import("@/views/components/code-mirror/index.vue"),
        meta: { title: "代码编辑器", icon: "el-icon-star-on" },
      },
    ],
  },
  {
    path: "/table",
    component: Layout,
    name: "Table",
    meta: {
      notClickBread: true,
      title: "表格",
      icon: "component",
    },
    children: [
      {
        path: "/drag-table",
        name: "DragTableDemo",
        component: () => import("@/views/table-demo/drag-table/index.vue"),
        meta: { title: "表格拖拽", icon: "el-icon-star-on" },
      },
      {
        path: "/dynamic-table",
        name: "DynamicTableDemo",
        component: () => import("@/views/table-demo/dynamic-table/index.vue"),
        meta: { title: "动态表格添加", icon: "el-icon-star-on" },
      },
      {
        path: "/inline-table",
        name: "InlineTableDemo",
        component: () => import("@/views/table-demo/inline-table/index.vue"),
        meta: { title: "内联表格编辑", icon: "el-icon-star-on" },
      },
      {
        path: "/search-table",
        name: "SearchTableDemo",
        component: () => import("@/views/table-demo/search-table/index.vue"),
        meta: { title: "表格查询", icon: "el-icon-star-on" },
      },
      {
        path: "/page-table",
        name: "PageTableDemo",
        component: () => import("@/views/table-demo/page-table/index.vue"),
        meta: { title: "分页表格", icon: "el-icon-star-on" },
      },
      {
        path: "/tree-table",
        name: "TreeTableDemo",
        component: () => import("@/views/table-demo/tree-table/index.vue"),
        meta: { title: "树状表格", icon: "el-icon-star-on" },
      },
      {
        path: "/Integration-table",
        name: "IntegrationTableDemo",
        component: () => import("@/views/table-demo/integration-table/index.vue"),
        meta: { title: "集成表格", icon: "el-icon-star-on" },
      },
    ],
  },
  {
    path: "/redirect",
    component: Layout,
    children: [
      {
        path: "home",
        name: "_noUseI18n_redirectToHome",
        component: () => import("@/views/home-view.vue"),
        meta: {
          title: "重定向到Home",
          icon: "component",
        },
      },
    ],
  },
  {
    path: "/arg",
    component: Layout,
    meta: {
      hideInMenu: true,
    },
    children: [
      {
        path: "params/:id",
        name: "params",
        component: () => import("@/views/home-view.vue"),
        meta: {
          title: (route: Route) => `{{ _route.params }}-${route.params.id}`,
          icon: "component",
          notCache: true,
          beforeCloseName: "before_close_normal",
        },
      },
      {
        path: "query/:id",
        name: "query",
        component: () => import("@/views/home-view.vue"),
        meta: {
          title: (route: Route) => `{{ _route.query }}-${route.query.id}`,
          icon: "component",
          notCache: true,
          beforeCloseName: "before_close_normal",
        },
      },
    ],
  },
];
