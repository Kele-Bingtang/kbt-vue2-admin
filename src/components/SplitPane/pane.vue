<template>
  <div :class="classes">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component({})
export default class Pane extends Vue {
  @Prop({ default: "" })
  public className!: string;

  public classes = [(this.$parent as any).split, this.className].join(" ");
}
</script>

<style scoped>
.splitter-pane.vertical.splitter-paneL {
  position: absolute;
  left: 0px;
  height: 100%;
  padding-right: 3px;
}

.splitter-pane.vertical.splitter-paneR {
  position: absolute;
  right: 0px;
  height: 100%;
  padding-left: 3px;
}

.splitter-pane.horizontal.splitter-paneL {
  position: absolute;
  top: 0px;
  width: 100%;
}

.splitter-pane.horizontal.splitter-paneR {
  position: absolute;
  bottom: 0px;
  width: 100%;
  padding-top: 3px;
}
</style>
