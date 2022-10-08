<template>
  <div class="error-log-badge">
    <el-badge :value="count" :max="99" class="badge">
      <el-button
        style="padding: 8px 10px"
        size="small"
        type="danger"
        @click="openErrorLogger"
      >
        <svg-icon name="bug" />
      </el-button>
    </el-badge>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component({})
export default class ErrorLog extends Vue {
  @Prop({ default: 0 })
  public errorCount!: number;

  @Prop({ default: false })
  public hasReadErrorLogs!: boolean;

  get count() {
    return this.hasReadErrorLogs ? 0 : this.errorCount;
  }

  public openErrorLogger() {
    this.$router.push({
      name: "errorLoggerPage",
    });
  }
}
</script>

<style lang="scss" scoped>
.error-log-badge {
  .badge {
    line-height: 25px;
    margin-top: -5px;
  }
  .message-title {
    font-size: 16px;
    color: #333;
    font-weight: bold;
    padding-right: 8px;
  }
}
</style>
