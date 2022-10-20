<template>
  <div class="message-center">
    <el-card class="message-center-card">
      <div class="message-page message-category">
        <el-menu default-active="unread" @select="handleCategorySelect">
          <el-menu-item index="unread">
            <span class="category">
              未读消息
              <el-badge :value="unreadCount" type="danger" :max="99"></el-badge>
            </span>
          </el-menu-item>
          <el-menu-item index="readed">
            <span class="category">
              已读消息
              <el-badge :value="readedCount" type="success"></el-badge>
            </span>
          </el-menu-item>
          <el-menu-item index="recycle">
            <span class="category">
              回收站
              <el-badge :value="recycleCount" type="info"></el-badge>
            </span>
          </el-menu-item>
        </el-menu>
      </div>

      <div class="message-page message-list" v-loading="listLoading">
        <el-menu
          default-active="1"
          @select="handleListSelect"
          :class="{ 'unread-list': selectedMessageType === 'readed' }"
        >
          <el-menu-item v-for="message in messageList" :key="`message_${message.id}`" :index="message.id">
            <p class="list-title">{{ message.title }}</p>
            <div class="list-time">
              <span class="list-dot"></span>
              <span class="list-text">{{ message.createTime }}</span>
            </div>
            <el-button
              type="text"
              class="list-operate"
              :loading="message.loading"
              :icon="selectedMessageType === 'readed' ? 'el-icon-delete operate-icon' : 'el-icon-top-left operate-icon'"
              @click.stop="handleOperate(message)"
              v-if="selectedMessageType !== 'unread'"
            ></el-button>
          </el-menu-item>
        </el-menu>
      </div>

      <div class="message-page message-content" v-loading="contentLoading" element-loading-text="拼命加载中 ...">
        <div class="message-content-header">
          <h2 class="message-content-title">{{ selectedMessageItem.title }}</h2>
          <time class="message-content-time">{{ selectedMessageItem.createTime }}</time>
        </div>
        <div v-html="selectedMessageItem.content"></div>
      </div>
    </el-card>
  </div>
</template>

<script lang="ts">
import { Message, UserModule } from "@/store/modules/user";
import { Component, Vue } from "vue-property-decorator";

@Component({})
export default class MessageCenter extends Vue {
  public listLoading = false;
  public contentLoading = false;

  public selectedMessageType = "unread";

  public lastReadedMessageId = "";

  public selectedMessageItem: Message = {
    id: "",
    title: "",
    content: "",
    createTime: "",
  };

  get unreadCount() {
    return UserModule.message.unreadList.length;
  }

  get readedCount() {
    return UserModule.message.readedList.length;
  }

  get recycleCount() {
    return UserModule.message.recycleList.length;
  }

  get messageList() {
    let { unreadList, readedList, recycleList } = UserModule.message;
    if (this.selectedMessageType === "unread") {
      return unreadList;
    } else if (this.selectedMessageType === "readed") {
      return readedList;
    } else if (this.selectedMessageType === "recycle") {
      return recycleList;
    }
    return [];
  }

  mounted() {
    // 请求获取消息列表
    this.listLoading = true;
    UserModule.getMessageList()
      .then(() => {
        // 模拟延迟
        setTimeout(() => {
          this.listLoading = false;
        }, 1000);
      })
      .catch(() => (this.listLoading = false));
  }

  public handleCategorySelect(id: string) {
    this.selectedMessageType = id;
    this.messageHasRead();
  }

  public handleListSelect(id: string) {
    this.contentLoading = true;
    // 模拟延迟
    setTimeout(() => {
      const item = this.messageList.find(item => item.id === id);
      if (item) {
        this.selectedMessageItem = item;
      }
      this.contentLoading = false;
      if (this.selectedMessageType === "unread") {
        this.messageHasRead(id);
      }
    }, 1000);
  }

  public messageHasRead(id?: string) {
    if (this.lastReadedMessageId) {
      UserModule.messageHasRead({ id: this.lastReadedMessageId }).then(() => {
        this.lastReadedMessageId = id ? id : "";
      });
    } else {
      this.lastReadedMessageId = id ? id : "";
    }
  }

  public handleOperate(message: Message) {
    message.loading = true;
    const { id } = message;
    if (this.selectedMessageType === "readed") {
      // 删除
      this.$confirm("您确定将该消息放到回收站吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          UserModule.removeReadedMessage({ id });
          this.$message({
            type: "success",
            message: "删除成功!",
          });
          message.loading = false;
        })
        .catch(() => {
          message.loading = false;
        });
    } else {
      // 恢复
      this.$confirm("您确定恢复该消息吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          UserModule.restoreRecycleMessage({ id });
          this.$message({
            type: "success",
            message: "恢复成功!",
          });
          message.loading = false;
        })
        .catch(() => {
          message.loading = false;
        });
    }
  }
}
</script>

<style lang="scss" scoped>
.message-center {
  height: 100%;
  padding: 20px;
  .message-center-card {
    height: 100%;
    .message-page {
      height: 100%;
      display: inline-block;
      vertical-align: top;
      position: relative;
      border-right: 1px solid #e6e6e6;
      .el-menu {
        width: auto;
        .el-menu-item.is-active {
          // background-color: #f0faff;
          &:after {
            content: "";
            display: block;
            width: 2px;
            position: absolute;
            top: 0;
            bottom: 0;
            right: -1px;
            background: var(--theme-color);
          }
          .list-dot {
            background-color: var(--theme-color) !important;
          }
        }
        .el-badge {
          margin-left: 10px;
        }
      }
      &.message-category {
        width: 200px;
      }

      &.message-list {
        width: 230px;
        .el-menu-item {
          height: auto;
          line-height: 21px;
          padding: 14px 20px;
          white-space: normal;
          .list-title {
            margin: 0;
            padding: 0;
          }
          .list-time {
            display: inline-block;
            .list-dot {
              width: 6px;
              height: 6px;
              display: inline-block;
              border-radius: 50%;
              vertical-align: middle;
              position: relative;
              top: -1px;
              background-color: #e6e8f1;
            }
            .list-text {
              display: inline-block;
              color: #515a6e;
              font-size: 12px;
              margin-left: 6px;
            }
          }
          .list-operate {
            float: right;
            margin-right: 17px;
            padding-top: 3px;
          }
        }
        .unread-list {
          .el-menu-item:not(.is-active) {
            color: #aaa9a9;
          }
        }
      }

      &.message-content {
        width: calc(100% - 450px);
        padding: 12px 20px 0;
        overflow: auto;
        .message-content-header {
          margin-bottom: 20px;
          .message-content-title {
            display: inline-block;
            color: #515a6e;
            margin: 0;
            padding: 0;
          }
          .message-content-time {
            margin-left: 20px;
          }
        }
      }
    }
  }
}
</style>
<style lang="scss">
.message-center {
  height: 100%;
  padding: 20px;
  .message-center-card {
    .el-card__body {
      height: 100%;
      white-space: nowrap;
      overflow: auto;
      .operate-icon {
        font-size: 13px;
        display: none;
        &:hover {
          color: var(--theme-color);
        }
      }
      .el-menu-item {
        &:hover {
          .operate-icon {
            display: inline-block;
          }
        }
      }
    }
  }
}
.mobile {
  .message-center {
    .message-content {
      width: 100% !important;
    }
  }
}
</style>
