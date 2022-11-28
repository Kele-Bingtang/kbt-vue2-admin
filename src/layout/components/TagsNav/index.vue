<template>
  <div class="tags-nav">
    <div class="scroll-container" ref="scrollContainer">
      <div
        class="scroll-body"
        ref="scrollBody"
        :style="{ left: tagBodyLeft + 'px' }"
        @DOMMouseScroll="handleScrollOnDom"
        @mousewheel="handleScrollOnDom"
      >
        <router-link
          v-for="tag in tagNavList"
          :key="tag.path"
          :to="{ path: tag.path, query: tag.query, params: tag.params }"
          :class="isActive(tag) ? 'active' : ''"
          :style="activeStyle(tag)"
          class="tags-link"
          ref="tag"
          @contextmenu.prevent.native="openRightMenu(tag, $event)"
        >
          <span class="dot" />
          <span>{{ tag.meta && tag.meta.title }}</span>
          <span v-if="!isFixedInNav(tag)" class="el-icon-close" @click.prevent.stop="handleCloseTag(tag)" />
        </router-link>
      </div>
    </div>
    <div class="btn-icon left-btn">
      <el-button plain @click="handleScroll(240)">
        <i class="el-icon-arrow-left" />
      </el-button>
    </div>
    <div class="btn-icon right-btn">
      <el-button plain @click="handleScroll(-240)">
        <i class="el-icon-arrow-right" />
      </el-button>
    </div>
    <ul v-show="rightMenuVisible" :style="{ left: rightMenuLeft + 'px', top: rightMenuTop + 'px' }" class="contextmenu">
      <li @click="refreshSelectedTag(selectedTag)">{{ $t("_tagsNav.refresh") }}</li>
      <li v-if="!isFixedInNav(selectedTag)" @click="handleCloseTag(selectedTag)">{{ $t("_tagsNav.close") }}</li>
      <li @click="closeOthersTabs">{{ $t("_tagsNav.closeOthers") }}</li>
      <li @click="closeAllTabs(selectedTag)">{{ $t("_tagsNav.closeAll") }}</li>
    </ul>
  </div>
</template>

<script lang="ts">
import beforeClose from "@/router/before-close";
import { LayoutModule, Tag } from "@/store/modules/layout";
import { PermissionModule } from "@/store/modules/permission";
import { SettingsModule } from "@/store/modules/settings";
import { getTitle } from "@/utils/layout";
import { Component, Vue, Watch } from "vue-property-decorator";
import { RouteConfig } from "vue-router";

@Component({})
export default class TagsNav extends Vue {
  // 右键菜单显示
  public rightMenuVisible = false;
  // tagsNav 滚动
  public tagBodyLeft = 0;
  // 右键菜单位置
  public rightMenuLeft = 0;
  public rightMenuTop = 0;
  // 激活的 tag
  public selectedTag: Tag = {
    path: "",
  };
  // 固定的 tag
  private fixedTags: Array<Tag> = [];

  // 获取标签页的列表
  get tagNavList() {
    return LayoutModule.tagsNav.tagNavList;
  }

  // 监听右键菜单
  @Watch("rightMenuVisible")
  public onVisibleChange(isVisible: boolean) {
    if (isVisible) {
      document.body.addEventListener("click", this.closeRightMenu);
    } else {
      document.body.removeEventListener("click", this.closeRightMenu);
    }
  }

  @Watch("$route")
  public onRouteChange() {
    // 刷新页面，添加曾打开过的 tags
    this.addTags();
    // 如果 tag 很多，且目标 tag 在边缘，则整体往目标 tag 移动
    this.findTargetTag();
  }

  mounted() {
    this.initTags();
    this.addTags();
  }

  get theme() {
    return SettingsModule.theme;
  }

  public isFixedInNav(tag: Tag) {
    return tag.meta && tag.meta.fixedInNav;
  }

  // 判断当前激活的 tag
  public isActive(tag: Tag): boolean {
    let path = decodeURIComponent(this.$route.path); // 防止编码后不一致
    return path === tag.path || path === tag.path + "/";
  }
  // 更换 tag 颜色为全局 theme
  public activeStyle(tag: Tag) {
    if (!this.isActive(tag)) return {};
    return {
      "background-color": this.theme,
      "border-color": this.theme,
    };
  }
  // 过滤出固定在 TagsNav 的 tag
  public filterFixedTags(routes: Array<RouteConfig>) {
    let tags: Array<Tag> = [];
    routes.forEach(route => {
      if (route.meta && route.meta.fixedInNav) {
        const tagPath = route.meta._fullPath;
        tags.push({
          path: tagPath, // tag 的 path 其实就是路由完整的 path，懒得改成 fullPath 了
          name: route.name,
          meta: { ...route.meta, title: getTitle(route, this) },
        });
      }
      if (route.children) {
        const childTags = this.filterFixedTags(route.children);
        if (childTags.length > 0) {
          tags = [...tags, ...childTags];
        }
      }
    });
    return tags;
  }
  // 初始化固定在 TagsNav 的 tags
  public initTags() {
    let { homeRoute, loadRoutes } = PermissionModule;
    let fixedTags = this.filterFixedTags(loadRoutes);
    let f: Array<Tag> = [];
    // 如果首页固定在 TagsNav，确保是第一个显示
    fixedTags.forEach(fixedTag => {
      if (homeRoute.meta && fixedTag.path === homeRoute.meta._fullPath) {
        f.unshift(fixedTag);
      } else {
        f.push(fixedTag);
      }
    });
    this.fixedTags = f;
    for (const tag of this.fixedTags) {
      if (tag.name) {
        LayoutModule.addTag(tag);
      }
    }
  }
  // 添加 tab，针对 url 访问或页面刷新
  public addTags(tag?: Tag) {
    if (tag) {
      LayoutModule.addTag(tag);
    } else {
      let route = this.handleRouteTitle();
      if (route.name) {
        LayoutModule.addTag(route);
      }
    }
  }
  // 找出访问的目标 tag
  public findTargetTag() {
    this.$nextTick(() => {
      let refsTag = this.$refs.tag as any[];
      if (refsTag) {
        for (const tag of refsTag) {
          if (this.$route.path === (tag.to as Tag).path) {
            this.moveToTargetTag(tag.$el);
            // 当 query 不一样
            if ((tag.to as Tag).path !== this.$route.fullPath) {
              let route = this.handleRouteTitle();
              LayoutModule.updateVisitedTag(route);
            }
          }
        }
      }
    });
  }
  // 处理路由的 Title 显示
  public handleRouteTitle() {
    let route = { ...this.$route };
    const { meta } = route;
    route.meta = {
      ...meta,
      title: getTitle(route, this),
    };
    return route;
  }
  // 移动到目标 tag，如果目标 tag 在 TagsNav 可视区域外面，则有滚动的动画效果
  public moveToTargetTag(tagElement: HTMLElement) {
    const outerWidth = (this.$refs.scrollContainer as HTMLElement).offsetWidth;
    const bodyWidth = (this.$refs.scrollBody as HTMLElement).offsetWidth;
    const outerPadding = 4;
    if (bodyWidth < outerWidth) {
      this.tagBodyLeft = 0;
    } else if (tagElement.offsetLeft < -this.tagBodyLeft) {
      // 标签在可视区域左侧
      this.tagBodyLeft = -tagElement.offsetLeft + outerPadding;
    } else if (
      tagElement.offsetLeft > -this.tagBodyLeft &&
      tagElement.offsetLeft + tagElement.offsetWidth < -this.tagBodyLeft + outerWidth
    ) {
      // 标签在可视区域
      this.tagBodyLeft = Math.min(0, outerWidth - tagElement.offsetWidth - tagElement.offsetLeft - outerPadding);
    } else {
      // 标签在可视区域右侧
      this.tagBodyLeft = -(tagElement.offsetLeft - (outerWidth - outerPadding - tagElement.offsetWidth));
    }
  }
  // 关闭一个 tab，并激活到上一个 tag
  public async handleCloseTag(tag: Tag) {
    if (tag.meta && tag.meta.beforeCloseName && tag.meta.beforeCloseName in beforeClose) {
      let isClose = await new Promise((beforeClose as any)[tag.meta.beforeCloseName]);
      if (isClose) {
        this.closeSelectedTag(tag);
      }
    } else {
      this.closeSelectedTag(tag);
    }
  }
  // 关闭选择的 tag
  public closeSelectedTag(tag: Tag) {
    LayoutModule.deleteTag(tag);
    // 如果关闭激活的 tag
    if (this.isActive(tag)) {
      // 激活到上一个 tag
      this.toLastTag(LayoutModule.tagsNav.tagNavList, tag);
    }
  }
  /**
   * 跳转到上一个 tag
   * @param toHome 是否跳到首页。当为 true，如果 tagNavList 为空，则跳到首页，否则跳转到 fixedTags 最后一个 tag
   */
  public toLastTag(tagNavList: Array<Tag>, tag: Tag, toHome: boolean = true) {
    // 获取最后一个 tag 数据
    const latestVisitedTag: Tag = tagNavList.slice(-1)[0];
    if (latestVisitedTag) {
      this.$router.push(latestVisitedTag.path).catch(err => {
        console.warn(err);
      });
    } else if (this.fixedTags.length === 0 || toHome) {
      let { homeRoute } = PermissionModule;
      // 如果 fixedTags 为空或者 tagNavList 为空，则默认跳转到首页
      if (this.fixedTags.length === 0 || tag.name !== homeRoute.name) {
        if (homeRoute.meta) {
          this.$router
            .replace({
              path: "/redirect" + homeRoute.meta._fullPath,
            })
            .catch(err => {
              console.warn(err);
            });
        }
      }
    } else {
      const lastFixedTags: Tag = this.fixedTags.slice(-1)[0];
      if (lastFixedTags && tag.name !== lastFixedTags.name) {
        this.$router.push(lastFixedTags.path);
      }
    }
  }
  // 右键菜单回调
  public openRightMenu(tag: Tag, e: any) {
    const menuMinWidth = 0;
    const offsetLeft = this.$el.getBoundingClientRect().left; // margin-left 的数值
    const offsetWidth = (this.$el as HTMLElement).offsetWidth; //  width 数值
    const maxLeft = offsetWidth - menuMinWidth;
    const left = e.clientX - offsetLeft + 14;
    if (left > maxLeft) {
      this.rightMenuLeft = maxLeft;
    } else {
      this.rightMenuLeft = left;
    }
    this.rightMenuTop = e.offsetY + 12;
    this.rightMenuVisible = true;
    this.selectedTag = tag;
  }
  // 刷新选中的 tag
  public refreshSelectedTag(tag: Tag) {
    LayoutModule.deleteCachedTag(tag);
    this.$nextTick(() => {
      this.$router
        .replace({
          path: "/redirect" + tag.path,
        })
        .catch(err => {
          console.warn(err);
        });
    });
  }
  // 关闭除当前选中 tag 的其他 tag
  public closeOthersTabs() {
    LayoutModule.deleteOthersTags(this.selectedTag);
    if (this.$route.path !== this.selectedTag.path) {
      this.$router.push(this.selectedTag.path).catch(err => {
        console.warn(err);
      });
    }
  }
  // 关闭除 fixedTags 的所有其他 tag
  public closeAllTabs(tag: Tag) {
    LayoutModule.deleteAllTags();
    if (this.fixedTags.some(tag => tag.path === this.$route.path)) {
      return;
    }
    this.toLastTag(LayoutModule.tagsNav.tagNavList, tag, true);
  }
  // 关闭右键菜单
  public closeRightMenu() {
    this.rightMenuVisible = false;
  }
  // 鼠标中键滚动回调
  public handleScrollOnDom(e: any) {
    var type = e.type;
    let delta = 0;
    if (type === "DOMMouseScroll" || type === "mousewheel") {
      delta = e.wheelDelta ? e.wheelDelta : -(e.detail || 0) * 40;
    }
    this.handleScroll(delta);
  }
  // TagsNav 滚动回调
  public handleScroll(offset: number) {
    const outerWidth = (this.$refs.scrollContainer as HTMLElement).offsetWidth;
    const bodyWidth = (this.$refs.scrollBody as HTMLElement).offsetWidth;
    if (offset > 0) {
      this.tagBodyLeft = Math.min(0, this.tagBodyLeft + offset);
    } else {
      if (outerWidth < bodyWidth) {
        if (this.tagBodyLeft < -(bodyWidth - outerWidth)) {
          this.tagBodyLeft = this.tagBodyLeft;
        } else {
          this.tagBodyLeft = Math.max(this.tagBodyLeft + offset, outerWidth - bodyWidth);
        }
      } else {
        this.tagBodyLeft = 0;
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.tags-nav {
  width: 100%;
  height: 38px;
  position: relative;
  line-height: 31px;
  padding: 1px 4px 0;
  background: #fff;
  border-bottom: 1px solid #d8dce5;
  box-shadow: 0 1px 4px rgb(0 21 41 / 8%);
  white-space: nowrap;
  -webkit-transition: left 0.3s ease;
  transition: left 0.3s ease;
  .scroll-container {
    position: absolute;
    left: 28px;
    right: 28px;
    top: 0;
    bottom: 0;
    .scroll-body {
      display: inline-block;
      padding: 1px 4px 0;
      overflow: visible;
      white-space: nowrap;
      -webkit-transition: left 0.3s ease;
      transition: left 0.3s ease;
      position: absolute;
      .tags-link {
        height: 28px;
        line-height: 27px;
        color: #495060;
        border: 1px solid #e8eaec;
        padding: 0 10px;
        margin: 2px 4px 2px 0;
        cursor: pointer;
        font-size: 12px;
        display: inline-block;
        vertical-align: middle;
        overflow: hidden;
        border-radius: 3px;
        &.active {
          background-color: #4c9bd8;
          color: #fff;
          .dot {
            background-color: #fff;
          }
        }
        .dot {
          display: inline-block;
          width: 12px;
          height: 12px;
          margin-right: 8px;
          border-radius: 50%;
          background-color: #e8eaec;
          position: relative;
          top: 1px;
          transition: background 0.2s ease;
        }
        .el-icon-close {
          width: 16px;
          height: 16px;
          display: inline-block;
          margin-left: 10px;
          font-size: 12px;
          cursor: pointer;
          border-radius: 50%;
          transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
          -webkit-transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
          transform-origin: 100% 50%;
          text-align: center;
          vertical-align: 2px;
          padding-right: 1px;
          &:hover {
            background-color: #b4bccc;
            color: #fff;
          }
          &:before {
            vertical-align: -3px;
          }
        }
      }
    }
  }
  .btn-icon {
    position: absolute;
    top: 0px;
    height: 100%;
    z-index: 10;
    &.left-btn {
      left: 0px;
    }
    &.right-btn {
      right: 0px;
    }
    .el-button {
      width: 28px;
      height: 100%;
      padding: 6px 4px;
      line-height: 14px;
      text-align: center;
      border-color: #dfe5f3;
      border-top: none;
      border-bottom: none;
      &:hover {
        border-left: 1px solid #cbd3e7;
        border-right: 1px solid #cbd3e7;
      }
      &:active {
        border-color: #a2d0ff !important;
      }
      .el-icon-arrow-left,
      .el-icon-arrow-right {
        font-weight: 600;
      }
    }
  }
  .contextmenu {
    margin: 0;
    background: #fff;
    z-index: 4000;
    position: absolute;
    list-style-type: none;
    padding: 5px 0;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 400;
    color: #333;
    box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);
    li {
      margin: 0;
      padding: 0 16px;
      cursor: pointer;
      &:hover {
        background: #eee;
      }
    }
  }
}
</style>
