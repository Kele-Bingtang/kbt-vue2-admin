<template>
  <div class="error-log-badge">
    <el-badge :value="count" :max="99" class="badge">
      <el-button size="small" plain @click="openErrorLogger">
        <svg-icon name="bug" width="18px" height="18px" />
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

  get count() {
    return this.errorCount === 0 ? 0 : this.errorCount;
  }

  public openErrorLogger() {
    if (this.$route.name !== "errorLoggerPage") {
      this.$router.push({
        name: "errorLoggerPage",
      });
    }
  }
}
</script>

<style lang="scss" scoped>
.error-log-badge {
  .badge {
    line-height: 25px;
    margin-top: -5px;
    .el-button {
      padding: 8px 10px;
      border: none;
    }
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
      top: 3px;
      right: 14px;
    }
  }
}
</style>
