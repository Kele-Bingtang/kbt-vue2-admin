<template>
  <div></div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component({
  render: (h, ctx) => {
    return ctx.props.render(h);
  },
})
export default class RenderDom extends Vue {
  @Prop()
  public render!: Function;

}
</script>

<style lang="scss" scoped></style>
