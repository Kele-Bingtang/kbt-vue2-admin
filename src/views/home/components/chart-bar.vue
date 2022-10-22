<template>
  <div :style="{ width: width, height: height }"></div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import * as echarts from "echarts";

@Component({})
export default class ChartBar extends Vue {
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

  public initChart() {
    this.chart = echarts.init(this.$el as HTMLElement, "shine");
    this.chart.setOption({
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
      },
      legend: {},
      grid: {
        left: "1%",
        right: "1.2%",
        bottom: "3%",
        containLabel: true,
      },
      xAxis: [
        {
          type: "category",
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
          name: "搜索引擎",
          type: "bar",
          data: [862, 1018, 964, 1026, 1679, 1600, 1570],
          emphasis: {
            focus: "series",
          },
          markLine: {
            lineStyle: {
              type: "dashed",
            },
            data: [[{ type: "min" }, { type: "max" }]],
          },
        },
        {
          name: "百度",
          type: "bar",
          barWidth: 5,
          stack: "搜索引擎",
          emphasis: {
            focus: "series",
          },
          data: [620, 732, 701, 734, 1090, 1130, 1120],
        },
        {
          name: "谷歌",
          type: "bar",
          stack: "搜索引擎",
          emphasis: {
            focus: "series",
          },
          data: [120, 132, 101, 134, 290, 230, 220],
        },
        {
          name: "Bing",
          type: "bar",
          stack: "搜索引擎",
          emphasis: {
            focus: "series",
          },
          data: [60, 72, 71, 74, 190, 130, 110],
        },
        {
          name: "其他",
          type: "bar",
          stack: "搜索引擎",
          emphasis: {
            focus: "series",
          },
          data: [62, 82, 91, 84, 109, 110, 120],
        },
      ],
    });
    window.addEventListener("resize", () => {
      this.chart.resize();
    });
  }
}
</script>

<style lang="scss" scoped></style>
