<template>
  <div class="home">
    <el-row :gutter="20">
      <el-col :xs="12" :sm="12" :md="8" :lg="5" v-for="(info, i) in cardInfo" :key="`info-${i}`" class="card-col">
        <card-info shadow="hover" :icon="info.icon" :color="info.color" :icon-size="48">
          <div class="card-title">{{ info.title }}</div>
          <count-to :start-val="0" :end-val="info.count" :duration="2700" class="count-style" />
        </card-info>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :xs="24" :sm="24" :lg="8" class="chart-col">
        <el-card>
          <chart-pie :data="pieData" title="用户访问来源" subTitle="统计" />
        </el-card>
      </el-col>

      <el-col :xs="24" :sm="24" :lg="8" class="chart-col">
        <el-card>
          <chart-bar />
        </el-card>
      </el-col>

      <el-col :xs="24" :sm="24" :lg="8" class="chart-col">
        <el-card>
          <chart-line-bar :data="lineBarData" />
        </el-card>
      </el-col>
    </el-row>

    <el-row style="margin-top: 20px">
      <el-card>
        <chart-line />
      </el-card>
    </el-row>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import CardInfo from "./components/card-info.vue";
import CountTo from "vue-count-to";
import ChartPie from "./components/chart-pie.vue";
import ChartBar from "./components/chart-bar.vue";
import ChartLineBar from "./components/chart-line-bar.vue";
import ChartLine from "./components/chart-line.vue";

@Component({
  components: {
    CardInfo,
    CountTo,
    ChartPie,
    ChartBar,
    ChartLineBar,
    ChartLine,
  },
})
export default class Home extends Vue {
  public cardInfo = [
    { title: "访问人数", icon: "el-icon-s-custom", count: 803, color: "#2d8cf0" },
    { title: "累计用户", icon: "el-icon-user-solid", count: 232, color: "#19be6b" },
    { title: "分享统计", icon: "el-icon-share", count: 657, color: "#ed3f14" },
    { title: "消息数量", icon: "el-icon-s-comment", count: 12, color: "#E46CBB" },
    { title: "系统页面", icon: "el-icon-document", count: 14, color: "#9A66E4" },
  ];

  public pieData = [
    { name: "直接访问", value: 335 },
    { name: "邮件营销", value: 310 },
    { name: "联盟广告", value: 234 },
    { name: "视频广告", value: 135 },
    { name: "搜索引擎", value: 1548 },
  ];

  public lineBarData = [
    { category: "2022-10-01", lineData: "200", barData: "150", lineName: "访问量", barName: "注册量" },
    { category: "2022-10-02", lineData: "585", barData: "341", lineName: "访问量", barName: "注册量" },
    { category: "2022-10-03", lineData: "476", barData: "330", lineName: "访问量", barName: "注册量" },
    { category: "2022-10-04", lineData: "346", barData: "340", lineName: "访问量", barName: "注册量" },
    { category: "2022-10-05", lineData: "498", barData: "197", lineName: "访问量", barName: "注册量" },
    { category: "2022-10-06", lineData: "579", barData: "546", lineName: "访问量", barName: "注册量" },
    { category: "2022-10-07", lineData: "361", barData: "160", lineName: "访问量", barName: "注册量" },
  ];
}
</script>

<style lang="scss" scoped>
.home {
  padding: 20px;
  background: #f5f7f9;
  .card-col {
    margin-bottom: 20px;
    .card-title {
      color: rgba(0, 0, 0, 0.45);
      font-size: 16px;
      font-weight: bold;
      margin-bottom: 12px;
    }
    .count-style {
      font-size: 23px;
      font-weight: bold;
    }
  }
  .chart-col {
    margin-bottom: 20px;
  }
  @media only screen and (min-width: 1200px) {
    .card-col {
      width: 20%;
    }
  }
}
</style>
