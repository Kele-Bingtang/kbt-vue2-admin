<template>
  <div class="error-log-badge">
    <el-badge :value="count" :max="99" :hidden="count === 0" class="badge svg-container">
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
  line-height: 55px;
  .badge {
    width: 18px;
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
