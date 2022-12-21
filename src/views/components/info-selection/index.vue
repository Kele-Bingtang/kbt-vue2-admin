<template>
  <div class="info-selection-container">
    <el-row :gutter="20">
      <el-col :xs="24" :sm="24" :md="8" :lg="3">
        <p>单选：</p>
        <info-selection
          :list="list"
          id="id"
          :show-info="['employeeNo', 'nickname']"
          separator=" "
          @change="handleChange"
        ></info-selection>
      </el-col>
      <el-col :xs="24" :sm="24" :md="8" :lg="3">
        <p>多选：</p>
        <info-selection
          :list="list"
          id="id"
          :show-info="['employeeNo', 'nickname']"
          separator=" "
          multiple
          @change="handleChange"
        ></info-selection>
      </el-col>
      <el-col :xs="24" :sm="24" :md="8" :lg="3">
        <p>自定义分隔符：</p>
        <info-selection
          :list="list"
          id="id"
          :show-info="['employeeNo', 'nickname']"
          separator=" | "
          multiple
          @change="handleChange"
        ></info-selection>
      </el-col>
      <el-col :xs="24" :sm="24" :md="8" :lg="3">
        <p>选中后保留关键词：</p>
        <info-selection
          :list="list"
          id="id"
          :show-info="['employeeNo', 'nickname']"
          separator=" "
          multiple
          reserve-keyword
          @change="handleChange"
        ></info-selection>
      </el-col>
      <el-col :xs="24" :sm="24" :md="8" :lg="3">
        <p>只能搜索：</p>
        <info-selection
          :list="list"
          id="id"
          :show-info="['employeeNo', 'nickname']"
          separator=" "
          multiple
          only-search
          @change="handleChange"
        ></info-selection>
      </el-col>
      <el-col :xs="24" :sm="24" :md="8" :lg="4">
        <p>选择至少一个值后，才显示全部下拉值：</p>
        <info-selection
          :list="list"
          id="id"
          :show-info="['employeeNo', 'nickname']"
          separator=" "
          multiple
          only-search
          select-show-all
          @change="handleChange"
        ></info-selection>
      </el-col>
      <el-col :xs="24" :sm="24" :md="8" :lg="4">
        <p>自定义内容：</p>
        <info-selection :list="list" id="id" separator=" " multiple @change="handleChange">
          <template #default="{ option }">
            <span style="float: left">{{ option.nickname }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{ option.employeeNo }}</span>
          </template>
        </info-selection>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import InfoSelection from "@/components/InfoSelection/index.vue";

@Component({
  components: { InfoSelection },
})
export default class InfoSelectionDemo extends Vue {
  public list = [
    {
      id: 0,
      employeeNo: "k10000",
      username: "可乐",
      nickname: "kele",
      age: 18,
      address: "广西",
    },
    {
      id: 1,
      employeeNo: "b10000",
      username: "冰糖",
      nickname: "bingtang",
      age: 17,
      address: "北京",
    },
    {
      id: 2,
      employeeNo: "x10000",
      username: "雪梨",
      nickname: "xueli",
      age: 19,
      address: "深圳",
    },
  ];

  public handleChange(selectValue: string[]) {
    console.log("选中的值：", selectValue);
  }
}
</script>

<style lang="scss" scoped>
.info-selection-container {
  padding: 20px;
}
</style>
