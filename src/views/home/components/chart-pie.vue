<template>
  <div :style="{ width: width, height: height }"></div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import * as echarts from "echarts";

export interface PieData {
  name: string;
  value: number;
}

@Component({})
export default class ChartPie extends Vue {
  public chart: any;

  @Prop({ required: true })
  public data!: Array<PieData>;
  @Prop({ default: "" })
  public title!: string;
  @Prop({ default: "" })
  public subTitle!: string;
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
    let legendData = this.data.map(item => item.name);
    this.chart = echarts.init(this.$el as HTMLElement, "shine");
    this.chart.setOption({
      title: {
        text: this.title,
        subtext: this.subTitle,
        x: "center",
      },
      tooltip: {
        trigger: "item",
        formatter: "{a} <br/>{b} : {c} ({d}%)",
      },
      legend: {
        left: "left",
        orient: "vertical",
        data: legendData,
      },
      series: [
        {
          name: this.title,
          type: "pie",
          radius: [15, 95],
          center: ["50%", "60%"],
          data: this.data,
          animationDuration: 2700,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: "rgba(0, 0, 0, 0.5)",
            },
          },
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
