<template>
  <div :style="{ width: width, height: height }"></div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import * as echarts from "echarts";

interface BarData {
  title: string;
  data: number[];
}

@Component({ name: "ChartBar" })
export default class extends Vue {
  public chart: any;

  @Prop({ required: true })
  public data!: Array<BarData>;
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
          name: this.data[0].title,
          type: "bar",
          data: this.data[0].data,
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
          name: this.data[1].title,
          type: "bar",
          barWidth: 5,
          stack: "搜索引擎",
          emphasis: {
            focus: "series",
          },
          data: this.data[1].data,
        },
        {
          name: this.data[2].title,
          type: "bar",
          stack: "搜索引擎",
          emphasis: {
            focus: "series",
          },
          data: this.data[2].data,
        },
        {
          name: this.data[3].title,
          type: "bar",
          stack: "搜索引擎",
          emphasis: {
            focus: "series",
          },
          data: this.data[3].data,
        },
        {
          name: this.data[4].title,
          type: "bar",
          stack: "搜索引擎",
          emphasis: {
            focus: "series",
          },
          data: this.data[4].data,
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
