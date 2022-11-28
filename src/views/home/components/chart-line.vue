<template>
  <div :style="{ width: width, height: height }"></div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import * as echarts from "echarts";

@Component({})
export default class ChartLine extends Vue {
  public chart: any;

  @Prop({ default: "100%" })
  public width!: string;
  @Prop({ default: "300px" })
  public height!: string;

  mounted() {
    this.$nextTick(() => {
      this.initChart();
    });
  }

  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    window.removeEventListener("resize", () => {
      this.chart.resize();
    });
    this.chart.dispose();
    this.chart = null;
  }

  activated() {
    this.$nextTick(() => {
      this.initChart();
    });
  }

  deactivated() {
    if (!this.chart) {
      return;
    }
    window.removeEventListener("resize", () => {
      this.chart.resize();
    });
    this.chart.dispose();
    this.chart = null;
  }

  public initChart() {
    this.chart = echarts.init(this.$el as HTMLElement, "shine");
    this.chart.setOption({
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "cross",
          label: {
            backgroundColor: "#6a7985",
          },
        },
      },
      legend: {
        data: ["运营商/网络服务", "银行/证券", "游戏/视频", "餐饮/外卖", "快递/电商"],
      },
      toolbox: {
        feature: {
          saveAsImage: {
            type: "png",
          },
        },
      },
      grid: {
        left: "1%",
        right: "1.2%",
        bottom: "3%",
        containLabel: true,
      },
      xAxis: [
        {
          type: "category",
          boundaryGap: false,
          data: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
        },
      ],
      yAxis: [
        {
          type: "value",
        },
      ],
      series: [
        {
          name: "运营商/网络服务",
          type: "line",
          stack: "总量",
          areaStyle: {
            color: "#2d8cf0",
          },
          itemStyle: {
            color: "#5470c6",
          },
          emphasis: {
            focus: "series",
          },
          data: [120, 132, 101, 134, 90, 230, 210],
        },
        {
          name: "银行/证券",
          type: "line",
          stack: "总量",
          areaStyle: {
            color: "#b2db9e",
          },
          itemStyle: {
            color: "#91cc75",
          },
          data: [220, 182, 191, 234, 290, 330, 310],
        },
        {
          name: "游戏/视频",
          type: "line",
          stack: "总量",
          areaStyle: {
            color: "#f8d588",
          },
          itemStyle: {
            color: "#facb0f",
          },
          data: [150, 232, 201, 154, 190, 330, 410],
        },
        {
          name: "餐饮/外卖",
          type: "line",
          stack: "总量",
          areaStyle: {
            color: "#f39494",
          },
          itemStyle: {
            color: "#ee6666",
          },
          data: [320, 332, 301, 334, 390, 330, 320],
        },
        {
          name: "快递/电商",
          type: "line",
          stack: "总量",
          label: {
            show: true,
            position: "top",
          },
          areaStyle: {
            color: "#879bd7",
          },
          itemStyle: {
            color: "#6db6d3",
          },
          emphasis: {
            focus: "series",
          },
          data: [1820, 932, 901, 934, 1290, 1330, 1320],
        },
      ],
    });
    window.addEventListener("resize", () => {
      this.chart && this.chart.resize();
    });
  }
}
</script>

<style lang="scss" scoped></style>
