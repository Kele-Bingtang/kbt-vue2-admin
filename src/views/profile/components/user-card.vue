<template>
  <el-card style="margin-bottom: 20px" class="user-card">
    <div slot="header">
      <span>个人中心</span>
    </div>

    <div class="user-card-header">
      <div class="header-content">
        <slot>
          <el-image :src="user.avatar" class="user-avatar" alt="头像">
            <div slot="error">
              <el-image :src="require('@/assets/default.png')" class="user-avatar" alt="头像" />
            </div>
          </el-image>
        </slot>
      </div>
      <div class="header-content">
        <div class="user-name">
          {{ user.userName }}
        </div>
        <div class="user-role">
          {{ getUserRoles(user.roles) }}
        </div>
      </div>
    </div>

    <div class="user-card-info">
      <div class="user-card-info-section">
        <div class="user-card-info-section-header">
          <span>基本信息</span>
        </div>
        <div class="user-card-info-section-body">
          <div class="basic-info">
            <div class="basic-info-item">
              <span>用户名称</span>
              <div class="basic-info-content">{{ user.userName }}</div>
            </div>
            <div class="basic-info-item">
              <span>用户性别</span>
              <div class="basic-info-content">{{ user.sex }}</div>
            </div>
            <div class="basic-info-item">
              <span>联系方式</span>
              <div class="basic-info-content">{{ user.phone }}</div>
            </div>
            <div class="basic-info-item">
              <span>用户邮箱</span>
              <div class="basic-info-content">{{ user.email }}</div>
            </div>
            <div class="basic-info-item">
              <span>用户角色</span>
              <div class="basic-info-content">{{ getUserRoles(user.roles) }}</div>
            </div>
            <div class="basic-info-item">
              <span>注册时间</span>
              <div class="basic-info-content">{{ user.registerTime }}</div>
            </div>
          </div>
        </div>
      </div>

      <div class="user-skills user-card-info-section">
        <div class="user-card-info-section-header">
          <span>核心技术栈</span>
        </div>
        <div class="user-card-info-section-body">
          <div class="progress-item">
            <span>Java（希望）</span>
            <el-progress :percentage="100" class="progress-content" />
          </div>
          <div class="progress-item">
            <span>Spring</span>
            <el-progress :percentage="55" class="progress-content" />
          </div>
          <div class="progress-item">
            <span>Docker</span>
            <el-progress :percentage="44" class="progress-content" />
          </div>
          <div class="progress-item">
            <span>Web（前端）</span>
            <el-progress :percentage="67" class="progress-content" />
          </div>
          <div class="progress-item">
            <span>Vue</span>
            <el-progress :percentage="57" class="progress-content" />
          </div>
          <div class="progress-item">
            <span>React</span>
            <el-progress :percentage="36" class="progress-content" />
          </div>
          <div class="progress-item">
            <span>SQL</span>
            <el-progress :percentage="39" class="progress-content" />
          </div>
          <div class="progress-item">
            <span>Git</span>
            <el-progress :percentage="76" class="progress-content" />
          </div>
        </div>
      </div>
    </div>
  </el-card>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { UserInfo } from "@/store/modules/user";

@Component({ name: "UserCard" })
export default class extends Vue {
  @Prop({ required: true })
  public user!: UserInfo;

  public getUserRoles(userRoles: string[]) {
    let userRole = "";
    let separator = " | ";
    userRoles.forEach(role => {
      userRole = userRole + separator + role;
    });
    return userRole.slice(separator.length);
  }
}
</script>

<style lang="scss" scoped>
.user-card {
  .user-card-header {
    text-align: center;

    .header-content {
      .user-avatar {
        width: 100px;
        height: 100px;
        border-radius: 50%;
      }
      .user-name {
        font-weight: bold;
      }
      .user-role {
        padding-top: 10px;
        font-weight: 400;
        font-size: 14px;
        color: #666;
      }
    }
  }

  .user-card-info {
    margin-top: 20px;
    color: #000;

    span {
      padding-left: 4px;
    }
    .user-card-info-section:first-child {
      padding-top: 0;
    }
    .user-card-info-section {
      font-size: 14px;
      padding: 15px 0;

      .user-card-info-section-header {
        border-bottom: 1px solid #dcdfe6;
        padding-bottom: 10px;
        margin-bottom: 10px;
        font-weight: bold;
      }
      .user-card-info-section-body {
        .basic-info {
          border-left: 0;
          border-right: 0;
          border-radius: 0;
          padding-left: 0;
          padding-right: 0;
        }
        .basic-info-item {
          border-top: 1px solid #e7eaec;
          border-bottom: 1px solid #e7eaec;
          margin-bottom: -1px;
          padding: 11px 0px;
          font-size: 13px;
          .basic-info-content {
            float: right;
          }
        }
        .basic-info-item:first-child {
          border-top: none;
          padding-top: 5px;
        }
        .progress-item {
          padding-bottom: 11px;
          .progress-content {
            float: right;
            width: 65%;
          }
        }
      }
    }
  }
}
</style>
