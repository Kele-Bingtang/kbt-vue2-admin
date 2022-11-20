<template>
  <div class="clipboard-container">
    <el-tabs v-model="activeName">
      <el-tab-pane label="使用全局指令复制" name="directly">
        <p>复制全局指令为：v-clipboard:copy</p>
        <p>复制成功回调为：v-clipboard:success</p>
        <p>复制失败回调为：v-clipboard:error</p>
        <el-input v-model="content" placeholder="Please input" style="width: 400px; max-width: 100%" />
        <el-button
          v-clipboard:copy="content"
          v-clipboard:success="onSuccess"
          v-clipboard:error="onError"
          type="primary"
          icon="el-icon-document"
        >
          复制
        </el-button>
      </el-tab-pane>
      <el-tab-pane label="使用全局方法复制" name="directive">
        <p>
          手动调用
          <span style="color: var(--theme-color)">this.$copyText(text)</span>
          来触发，其中 text 为复制的内容
        </p>
        <p>你可以在 text 添加额外的信息，如个人版权声明</p>
        <el-input v-model="content" placeholder="Please input" style="width: 400px; max-width: 100%" />
        <el-button type="primary" icon="el-icon-document" @click="doClipboard()">复制</el-button>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({})
export default class Clipboard extends Vue {
  public activeName = "directly";
  public content = "https://github.com/Kele-Bingtang/kbt-vue-admin";
  /**
   * 全局指令触发
   */
  public onSuccess() {
    this.clipboardSuccess();
  }
  public onError() {
    this.clipboardFailed();
  }
  /**
   * 手动调用 this.$copyText(text) 来触发
   */
  public doClipboard() {
    (this as any)
      .$copyText(this.content) // 复制该内容前，你可以添加以前额外的信息，如个人版权声明
      .then(() => {
        this.clipboardSuccess();
      })
      .catch(() => {
        this.clipboardFailed();
      });
  }

  public clipboardSuccess() {
    this.$message({
      message: "Copy successfully",
      type: "success",
      duration: 1500,
    });
  }
  public clipboardFailed() {
    this.$message({
      message: "Copy failed",
      type: "error",
      duration: 1500,
    });
  }
}
</script>

<style lang="scss" scoped>
.clipboard-container {
  padding: 20px;
}
</style>
