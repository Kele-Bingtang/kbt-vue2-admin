<template>
  <div class="animation-mixin-container">
    <el-row>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>按钮</span>
        </div>
        <div style="margin-bottom: 50px">
          <el-col :xs="12" :sm="12" :md="8" :lg="4" class="text-center mixin-col">
            <button class="animation-btn blue-btn" to="/documentation/index">Documentation</button>
          </el-col>
          <el-col :xs="12" :sm="12" :md="8" :lg="4" class="text-center">
            <button class="animation-btn light-blue-btn" to="/icon/index">Icons</button>
          </el-col>
          <el-col :xs="12" :sm="12" :md="8" :lg="4" class="text-center">
            <button class="animation-btn pink-btn" to="/excel/export-excel">Excel</button>
          </el-col>
          <el-col :xs="12" :sm="12" :md="8" :lg="4" class="text-center">
            <button class="animation-btn green-btn" to="/table/complex-table">Table</button>
          </el-col>
          <el-col :xs="12" :sm="12" :md="8" :lg="4" class="text-center">
            <button class="animation-btn tiffany-btn" to="/example/create">Form</button>
          </el-col>
          <el-col :xs="12" :sm="12" :md="8" :lg="4" class="text-center">
            <button class="animation-btn yellow-btn" to="/theme/index">Theme</button>
          </el-col>
        </div>
      </el-card>
    </el-row>

    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :xs="24" :sm="12" :md="8" :lg="6" class="mixin-col">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>Material Design 的 input</span>
          </div>
          <div style="height: 100px">
            <el-form :model="demo" :rules="demoRules">
              <el-form-item prop="title">
                <material-input v-model="demo.title" icon="el-icon-search" name="title" placeholder="输入标题">
                  标题
                </material-input>
              </el-form-item>
            </el-form>
          </div>
        </el-card>
      </el-col>

      <el-col :xs="24" :sm="12" :md="8" :lg="6" class="mixin-col">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>水波纹 waves</span>
          </div>
          <div class="component-item">
            <el-button v-waves type="primary">水波纹效果</el-button>
            <el-button v-waves type="success">水波纹效果</el-button>
            <el-button v-waves type="warning">水波纹效果</el-button>
            <el-button v-waves type="danger" style="margin-top: 10px">水波纹效果</el-button>
          </div>
        </el-card>
      </el-col>

      <el-col :xs="24" :sm="12" :md="8" :lg="6" class="mixin-col">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>悬停文本</span>
          </div>
          <div class="component-item">
            <text-hover-effect initColor="#4dd9d5" hoverColor="var(--theme-color)" text="kbt-vue-admin" />
          </div>
        </el-card>
      </el-col>

      <el-col :xs="24" :sm="12" :md="8" :lg="6" class="mixin-col">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>Share</span>
          </div>
          <div class="component-item" style="height: 420px">
            <dropdown-menu :items="articleList" style="margin: 0 auto" title="系列文章" />
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import MaterialInput from "@/components/MaterialInput/index.vue";
import TextHoverEffect from "@/components/TextHoverEffect/index.vue";
import DropdownMenu from "@/components/DropdownMenu/index.vue";

@Component({ name: "AnimationMixinDemo", components: { MaterialInput, TextHoverEffect, DropdownMenu } })
export default class extends Vue {
  public demo = {
    title: "",
  };
  private validateLength = (rule: any, value: string, callback: Function) => {
    if (value.length !== 6) {
      callback(new Error("请输入六个字符"));
    } else {
      callback();
    }
  };
  public demoRules = {
    title: [{ validator: this.validateLength, trigger: "change" }],
  };

  public articleList = [
    { title: "文章 1", href: "javascript:;" },
    { title: "文章 2", href: "javascript:;" },
    { title: "文章 3", href: "javascript:;" },
    { title: "文章 4", href: "javascript:;" },
    { title: "文章 5", href: "javascript:;" },
    { title: "文章 6", href: "javascript:;" },
  ];
}
</script>

<style lang="scss" scoped>
.animation-mixin-container {
  .mixin-col {
    margin-bottom: 15px;
  }
}
</style>

<style lang="scss" scoped>
.animation-mixin-container {
  background-color: #f5f7f9;
  padding: 20px;
  height: 100%;

  @mixin colorBtn($color) {
    background: $color;

    &:hover {
      color: $color;

      &:before,
      &:after {
        background: $color;
      }
    }
  }

  .blue-btn {
    @include colorBtn($blue);
  }

  .light-blue-btn {
    @include colorBtn($light-blue);
  }

  .red-btn {
    @include colorBtn($red);
  }

  .pink-btn {
    @include colorBtn($pink);
  }

  .green-btn {
    @include colorBtn($green);
  }

  .tiffany-btn {
    @include colorBtn($tiffany);
  }

  .yellow-btn {
    @include colorBtn($yellow);
  }

  .animation-btn {
    font-size: 14px;
    color: #fff;
    padding: 14px 36px;
    border-radius: 8px;
    border: none;
    outline: none;
    transition: 600ms ease all;
    position: relative;
    display: inline-block;

    &:hover {
      background: #fff;

      &:before,
      &:after {
        width: 100%;
        transition: 600ms ease all;
      }
    }

    &:before,
    &:after {
      content: "";
      position: absolute;
      top: 0;
      right: 0;
      height: 2px;
      width: 0;
      transition: 400ms ease all;
    }

    &::after {
      right: inherit;
      top: inherit;
      left: 0;
      bottom: 0;
    }
  }

  .component-item {
    min-height: 100px;
  }
}
</style>
