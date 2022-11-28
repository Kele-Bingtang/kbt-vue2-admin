<template>
  <div :style="{ width: width, height: height }"></div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import * as echarts from "echarts";

interface LineBarData {
  lineData: string;
  barData: string;
  category: string;
  lineName: string;
  barName: string;
}
@Component({})
export default class ChartLineBar extends Vue {
  public chart: any;

  @Prop({ required: true })
  public data!: Array<LineBarData>;
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
    let category = this.data.map(item => item.category);
    let lineData = this.data.map(item => item.lineData);
    let barData = this.data.map(item => item.barData);
    let { lineName } = this.data[0];
    let { barName } = this.data[0];
    this.chart = echarts.init(this.$el as HTMLElement, "shine");
    this.chart.setOption({
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
      },
      grid: {
        left: 10,
        right: 10,
        bottom: 20,
        top: 20,
        containLabel: true,
      },
      legend: {
        data: [lineName, barName],
        textStyle: {
          color: "#333",
        },
      },
      xAxis: {
        data: category,
      },
      yAxis: {
        splitLine: { show: false },
      },
      series: [
        {
          name: lineName,
          type: "line",
          smooth: true,
          showAllSymbol: true,
          symbol: "emptyCircle",
          symbolSize: 10,
          data: lineData,
          animationDuration: 2700,
        },
        {
          name: barName,
          type: "bar",
          barWidth: 10,
          itemStyle: {
            borderRadius: 5,
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: "#14c8d4" },
              { offset: 1, color: "#43eec6" },
            ]),
          },
          data: barData,
        },
        {
          name: lineName,
          type: "bar",
          barGap: "-100%",
          barWidth: 10,
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: "rgba(20, 200, 212, 0.5)" },
              { offset: 0.2, color: "rgba(20, 200, 212, 0.2)" },
              { offset: 1, color: "rgba(20, 200, 212, 0)" },
            ]),
          },
          z: -12,
          data: lineData,
          animationDuration: 2000,
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
