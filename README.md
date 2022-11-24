# kbt-vue-admin

基于 Vue + TypeScript 搭建的后台系统模板。

## Demo

[Demo](https://admin.youngkbt.cn/)

## 使用流程

### Clone code：拉取代码

```sh
git clone https://github.com/Kele-Bingtang/kbt-vue-admin.git
```

## Project setup：安装依赖

```sh
yarn install
```

### Compiles and hot-reloads for development：编译运行（开发环境使用）

```sh
yarn serve
```

### Compiles and minifies for production：打包运行（测试环境使用）

```sh
yarn build:test
```

### Compiles and minifies for production：打包运行（生产环境使用）

```sh
yarn build
```

### Lints and fixes files：检查和修复文件

```sh
yarn lint
```

### Push code：提交代码到 git

前往 push.sh 文件修改要提交的远程仓库地址，然后在 Git Bash Here 执行命令：

```sh
sh push.sh "您的 commit 信息"
```

### Customize configuration：自定义配置的介绍

See [Configuration Reference](https://cli.vuejs.org/config/).

## 内容说明

### 布局

系统的布局组件有顶栏、面包屑、侧边菜单栏、标签栏、内容区，位于 `src/layout` 下，分别位为 Header、SideMenu、TagsNav、MainContent 下。

内容区（MainContent）根据路由进行组件的跳转，可视化页面的组件在 `src/views` 下。

### 组件

常用的组件进行封装，位于 `src/components` 下。

### API

系统的 API 文件位于 `src/api` 下，采用 Axios 进行请求，该配置文件位于 `src/config/request.ts` 文件里。

### 常量

系统的常量文件位于 `src/config/constant.ts` 文件里。

### 路由

路由的所有相关文件位于 `src/router` 下：

- 路由和组件的配置文件为 `routes-config.ts`
- 路由的核心配置、路由拦截文件为 `index.ts`
- 路由使用的工具文件为 `utils.ts`

路由的配置有如下规则：

本项目需要的可配置参数:

```typescript
path: string                                
name: string | "_noUseI18n_xxx"             // 路由的名字，这是必须设置的，如果开启了 I18n，某些路由又不想使用 I18n，则 name 以 _noUseI18n_ 开头
redirect: string | function                 // 重定向到某个路由下，可选，function 使用方式请看官网：https://router.vuejs.org/zh/api/index.html#redirect

...... // 其他

meta: {
  roles: ['admin', 'visitor']               // 可访问该页面的权限数组，当前路由设置的权限会影响子路由
  title: { string | number | Function }
                  // 显示在侧边栏、面包屑和标签栏的文字
                  // 使用 '{{ 多语言字段 }}' 形式结合「多语言」使用
                  // 可以传入一个回调函数，参数是当前路由对象
  notClickBread: boolean                    // 如果为 true，则该路由无法在面包屑中被点击，默认为 false
  hideInBread: boolean                      // 如果为 true，则该路由将不会出现在面包屑中，默认为 false
  hideInMenu: boolean                       // 如果为 true，则该路由不会显示在左侧菜单，默认为 false
  alwaysShowRoot: boolean                   // 如果为 false 且某一级路由下只有一个二级路由，则左侧菜单直接显示该二级路由，如果为 true，则总会让一级菜单作为下拉菜单，默认为 false，仅限父级路由使用
  notCache: boolean                         // 如果为 true，该路由在切换标签后不会缓存，如果需要缓存，则「必须」设置页面组件 name 属性（class 名）和路由配置的 name 一致，默认为 false
  icon: string                              // 该页面在左侧菜单、面包屑显示的图标，无默认值
  fixedInNav: boolean | number              // 如果为 true，则该路由按照路由表顺序依次标签固定在标签栏，如果指定顺序，则按照顺序固定，如果 fixedInNav 为 2，没有 1，则第一个为 true 的路由，默认为 false
  beforeCloseName: 'before_close_normal'    // 如果设置该字段，则在关闭当前 tab 页时会去 @/router/before-close.js 里寻找该字段名「对应」的方法，作为关闭前的钩子函数，无默认值
}
```

### 状态管理

状态管理文件既有组件需要的数据、方法、也有用户信息、路由权限等的初始化方法，配合路由守卫进行初始化，位于 `src/store/modules` 下。

状态管理采用模块化，通过扫描 `src/store/modules` 下的 ts 文件，进行模块化集中注册。

> 注意：`src/store/modules/permission.ts`（35 行左右）里需要您提供首页的 name 值（必须），默认是 `Home`，因为本项目的首页正好是 Home，所以无需修改，如果您修改了首页的 name 值，请记得在该文件下修改。
>
> 首页的路由需要被计算出来，给本项目的布局组件（面包屑、标签页）使用。

### 工具

系统常用的函数位于 `src/utils` 下，实现复用性，有数据深克隆、URL 参数值截取、展示 title 等功能函数。

### 接口

组件用到的 TypeScript 自定义类型在 `src/types` 下创建并引入使用。

### 样式

该本项目布局用到的可定制化样式位于 `src/styles` 下，如侧边栏主题、全局样式，您可以查看源码，根据自己的美观修改对应的样式。

### 图标

本项目使用的图标是 Element UI 内置的和 SVG 格式，因为 Element UI 内置的图标较少，所以自行在网上找 SVG 图标，如 [阿里云矢量图标库](https://www.iconfont.cn/)。

图标位于 `src/icons/svg` 下。

使用步骤：

- 每当在 `src/icons/svg` 文件夹内添加 icon 之后，可以通过在终端执行 `yarn svg` 来重新生成所有组件
- 在 vue 组件里使用 svg-icon 标签，如 `<svg-icon name="bug" width="20px" height="20px" />`，其中 name 是 svg 的文件名，width 和 height 为图标的宽度和高度

### 国际化

本项目实现了国际化，国际化的配置在 `src/locale/lang` 下，根据需要自行适配。

使用方式：

在 vue 组件的 `template` 标签这样使用：

```html
<template>
  <div>
    $t("_route.home")
  </div>
</template>
```

在 `script` 标签里这样使用：

```js
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({})
export default class Test extends Vue {
  public test() {
    return this.$t("_route.home");
  }
}
```

`$t` 代表国际化，里面的 `_route.home` 是 `src/locale/lang` 文件里的配置，如

中文语言：

```typeScript
export default {
  _route: {
    home: "首页",
  }
}
```

英文语言：

```typeScript
export default {
  _route: {
    home: "Home",
  }
}
```

这样您在切换语言的时候，<mark>首页</mark> 和 `Home` 就互相切换。

### 多环境

本项目内置了多环境，分为本地环境、测试环境、生产环境，本地环境无需设置，

- 本地环境的文件：.env.development
- 测试环境的文件：.env.test
- 正式环境的文件：.env.production

`yarn dev` 会被 Vue 识别为开启本地环境；`yarn build` 会被识别为开启生产环境；`yarn build:test` 会被识别为开启测试环境。

- `yarn dev` 会在命令后面自动加上 `--mode development`，代表本地环境
- `yarn build` 会在命令后面自动加上 `--mode production`，代表生产环境

Vue 仅识别上面两个命令，而 `yarn build:test` 是自己手动加上 `--mode test`。

`--mode xxx` 会自动去根目录寻找 .env.xxx 文件的变量进行加载。

## 配置流程

### 环境配置

本项目内置了多环境，分为本地环境、测试环境、开发环境，本地环境无需设置，

环境的配置常用于 axios、静态资源获取、路由前缀，这些配置随着不同的环境（本地环境、测试环境、生产环境）而有所变化，配置这些内容，前往 .env.development、.env.production、env.test 进行对应的配置即可。

- .env.development 为本地环境的配置
- .env.production为生产环境的配置
- .env.test 为测试环境的配置

配置完后无需担心环境不契合问题，Vue 会自动识别项目处于哪种环境下，想知道 Vue 如何识别，可以看 **使用流程** 的介绍。

### 菜单、路由配置

一套简单的开发仅需两步：

- 开发您自己的 Vue 组件
- 在 `src/router/routes-config.ts` 里配置路由、角色等信息

系统根据路由、角色等信息自动生成菜单栏、面包屑、标签页。

用户的默认角色为 `visitor`，实际的角色应该从后端获取

