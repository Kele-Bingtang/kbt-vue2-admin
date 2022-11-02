<template>
  <div class="error-log-badge">
    <el-badge :value="count" :max="99" :hidden="count === 0" class="badge layout-svg-btn">
      <el-button size="small" plain @click="openErrorLogger">
        <svg-icon name="bug" width="20px" height="20px" />
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
  // 获取错误日志的数量
  get count() {
    return this.errorCount === 0 ? 0 : this.errorCount;
  }
  // 打开错误日志页面
  public openErrorLogger() {
    if (this.$route.name !== "ErrorLogger") {
      this.$router.push({
        name: "ErrorLogger",
      });
    }
  }
}
</script>

<style lang="scss" scoped>
.error-log-badge {
  .badge {
    width: 18px;
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

<style lang="scss">
.error-log-badge {
  .badge {
    .el-badge__content.is-fixed {
      top: 10px;
      right: 8px;
    }
  }
}
</style>
