<template>
  <div :class="{ active: isActive }" class="share-dropdown-menu">
    <div class="share-dropdown-menu-wrapper">
      <span class="share-dropdown-menu-title" @click.self="clickTitle">{{ title }}</span>
      <div v-for="(item, index) of items" :key="index" class="share-dropdown-menu-item">
        <a v-if="item.href" :href="item.href" target="_blank">{{ item.title }}</a>
        <span v-else>{{ item.title }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component({ name: "DropdownMenu" })
export default class extends Vue {
  @Prop({ default: () => [] })
  public items!: any[];
  @Prop({ default: "vue" })
  public title!: string;

  public isActive = false;

  public clickTitle() {
    this.isActive = !this.isActive;
  }
}
</script>

<style lang="scss" scoped>
$item-length: 10;
$transition-time: 0.1s;

.share-dropdown-menu {
  width: 250px;
  position: relative;
  z-index: 1;
  height: auto !important;

  &-title {
    width: 100%;
    display: block;
    cursor: pointer;
    background: var(--theme-color);
    color: white;
    height: 60px;
    line-height: 60px;
    font-size: 20px;
    text-align: center;
    z-index: 2;
    transform: translate3d(0, 0, 0);
    margin-bottom: 5px;
  }

  &-wrapper {
    position: relative;
  }

  &-item {
    text-align: center;
    position: absolute;
    width: 100%;
    background: #e0e0e0;
    color: black;
    line-height: 55px;
    height: 55px;
    cursor: pointer;
    font-size: 18px;
    overflow: hidden;
    opacity: 1;
    transition: transform 0.28s ease;

    &:hover {
      background: var(--theme-color);
      color: white;
    }

    @for $i from 1 through $item-length {
      &:nth-of-type(#{$i}) {
        z-index: -1;
        transition-delay: $i * $transition-time;
        transform: translate3d(0, -60px, 0);
      }
    }
  }

  &.active {
    .share-dropdown-menu-wrapper {
      z-index: 1;
    }

    .share-dropdown-menu-item {
      @for $i from 1 through $item-length {
        &:nth-of-type(#{$i}) {
          transition-delay: ($item-length - $i) * $transition-time;
          transform: translate3d(0, ($i - 1) * 60px, 0);
        }
      }
    }
  }
}
</style>
