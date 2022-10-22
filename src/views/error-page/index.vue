<template>
  <div class="error-logger">
    <el-alert
      title="注意：页面错误日志不会在浏览器持久化存储，刷新页面即会丢失"
      description="如果你在本页面添加错误日志，那么右上角的红色文字不会变成 0，您需要离开该页面，再重新进入，才会将红色数字置为 0，代表已读"
      type="info"
      :closable="false"
      style="margin-bottom: 10px"
    ></el-alert>
    <el-button type="primary" @click="addErrorLog">添加一条错误日志</el-button>
    <el-popconfirm placement="right" title="您确定删除全部日志吗？" @confirm="clearAll">
      <el-button
        type="danger"
        slot="reference"
        :disabled="errorLogs.length === 0"
        style="margin-left: 10px; margin-bottom: 15px"
      >
        删除全部
      </el-button>
    </el-popconfirm>
    <el-table :data="errorLogs" border>
      <el-table-column type="index" label="序号" width="50"></el-table-column>
      <el-table-column prop="err.name" label="名字" width="220px"></el-table-column>
      <el-table-column prop="err.message" label="信息" width="280px"></el-table-column>
      <el-table-column prop="url" label="URL" width="380px"></el-table-column>
      <el-table-column prop="info" label="位置">
        <template slot-scope="{ row }">{{ row.vm.$vnode.tag }} error in {{ row.info }}</template>
      </el-table-column>
      <el-table-column prop="time" label="时间" width="180px">
        <template slot-scope="{ row }">
          {{ getViewTime(row.time) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="190px">
        <template slot-scope="{ row }">
          <el-button type="primary" @click="handleClick(row)">查看</el-button>
          <el-popconfirm title="您确定删除这个错误日志吗？" @confirm="handleDelete(row)">
            <el-button type="danger" slot="reference" style="margin-left: 10px">删除</el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="dialogErrorInfoVisible" title="错误信息" width="50%" append-to-body>
      <el-table :data="[clickCurrentRow]" border>
        <el-table-column label="name" width="160px">
          <template slot-scope="{ row }">
            {{ row.err.name }}
          </template>
        </el-table-column>
        <el-table-column label="message" width="160px">
          <template slot-scope="{ row }">
            {{ row.err.message }}
          </template>
        </el-table-column>
        <el-table-column label="cause" width="160px">
          <template slot-scope="{ row }">
            {{ row.err.cause }}
          </template>
        </el-table-column>
        <el-table-column label="stack">
          <template slot-scope="{ row }">
            {{ row.err.stack }}
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { ErrorLog, LayoutModule } from "@/store/modules/layout";

@Component({})
export default class ErrorLogger extends Vue {
  public row!: ErrorLog;

  public dialogErrorInfoVisible = false;
  // 当前行的错误信息
  public clickCurrentRow: ErrorLog = {
    err: new Error(),
    vm: undefined,
    info: "",
    url: "",
    hasRead: true,
  };
  // 捕获到的所有错误信息
  get errorLogs() {
    return LayoutModule.errorLogs;
  }
  // 所有错误信息已读
  mounted() {
    LayoutModule.setHasReadErrorLogsStatus(true);
  }

  activated() {
    LayoutModule.setHasReadErrorLogsStatus(true);
  }

  public getViewTime(timestamp: number | undefined) {
    if (!timestamp) {
      return;
    }
    let date = new Date(timestamp);
    let Y = date.getFullYear();
    let M = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
    let D = date.getDate();
    let h = date.getHours();
    let m = date.getMinutes();
    let s = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();

    return Y + "-" + M + "-" + D + " " + h + ":" + m + ":" + s;
  }
  // 模拟添加一条错误信息
  public addErrorLog() {
    let letters = [
      "a",
      "b",
      "c",
      "d",
      "e",
      "f",
      "g",
      "h",
      "i",
      "j",
      "k",
      "l",
      "m",
      "n",
      "o",
      "p",
      "q",
      "r",
      "s",
      "t",
      "u",
      "v",
      "w",
      "x",
      "y",
      "z",
    ];
    let letter = letters[Math.floor(Math.random() * letters.length)];
    let errorMessage = letter + " is not undefined";
    (this as any).$throw(new Error(errorMessage), this, "v-on handler");
  }
  // 完全清除错误日志
  public clearAll() {
    LayoutModule.clearErrorLog();
  }

  public handleClick(row: ErrorLog) {
    this.clickCurrentRow = row;
    this.dialogErrorInfoVisible = true;
  }

  public handleDelete(row: ErrorLog) {
    LayoutModule.deleteOneErrorLog(row);
  }
}
</script>

<style lang="scss" scoped>
.error-logger {
  padding: 10px;
}
</style>
