<template>
  <div class="count-to-component">
    <slot name="prefix">
      <span v-if="prefix">{{ prefix }}</span>
    </slot>
    <p class="content-outer">
      <span :class="[countClass]" :id="counterId">{{ init }}</span>
      <span :class="[unitClass]">{{ unitText }}</span>
    </p>
    <slot name="suffix">
      <span v-if="suffix">{{ suffix }}</span>
    </slot>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import CountUp from "countup";

interface Unit {
  value: number;
  label: string;
}

@Component({})
export default class CountTo extends Vue {
  public counter: any = null;
  public unitText = "";

  @Prop({ default: 0 })
  public init!: number;

  /**
   * @description 起始值，即动画开始前显示的数值
   */
  @Prop({ default: 0 })
  public startVal!: number;

  /**
   * @description 结束值，即动画结束后显示的数值
   */
  @Prop({ required: true })
  public endVal!: number;

  /**
   * @description 数值的前缀
   */
  @Prop({ default: "" })
  public prefix!: string;

  /**
   * @description 数值的后缀
   */
  @Prop({ default: "" })
  public suffix!: string;

  /**
   * @description 保留几位小数
   */
  @Prop({ default: 0 })
  public decimals!: number;

  /**
   * @description 分隔整数和小数的符号，默认是小数点
   */
  @Prop({ default: "." })
  public decimal!: string;

  /**
   * @description 动画持续的时间，单位是秒
   */
  @Prop({ default: 3 })
  public duration!: number;

  /*
   * @description 动画延迟开始的时间，单位是秒
   */
  @Prop({ default: 0 })
  public delay!: number;

  /**
   * @description 是否自动播放
   */
  @Prop({ default: true })
  public autoplay!: boolean;

  /**
   * @description 是否使用 easing 动画效果
   */
  @Prop({ default: true })
  public useEasing!: boolean;

  /*
   * @description 是否使用分组，分组后每三位会用一个符号分隔，即 1000 位 1,000
   */
  @Prop({ default: true })
  public useGroup!: boolean;

  /**
   * @description 用于分组（useGroup）的符号
   */
  @Prop({ default: "," })
  public separator!: string;

  /**
   * @description 是否简化显示，设为 true 后会使用 unit 单位来做相关省略
   */
  @Prop({ default: false })
  public simplify!: boolean;

  /**
   * @description 自定义单位，如 { value: 3, label: "K+" }, { value: 6, label: "M+" } 即大于 3 位数小于 6 位数的用 k+ 来做省略
   *              1000 即显示为 1K+
   */
  @Prop({
    default: () => {
      return [
        { value: 3, label: "K+" },
        { value: 6, label: "M+" },
        { value: 9, label: "B+" },
      ];
    },
  })
  public unit!: Array<Unit>;
  @Prop({ default: "" })
  countClass!: string;
  @Prop({ default: "" })
  unitClass!: string;

  @Watch("endVal")
  private onEndChange(newVal: number) {
    let endVal = this.getValue(newVal);
    if (this.autoplay) {
      this.counter.update(endVal);
    }
  }

  get counterId() {
    return `count_to_${(this as any)._uid}`;
  }

  mounted() {
    this.$nextTick(() => {
      if (this.autoplay) {
        this.initCountUp();
      }
    });
  }

  private initCountUp() {
    let endVal = this.getValue(this.endVal);
    this.counter = new (CountUp as any)(this.counterId, this.startVal, endVal, this.decimals, this.duration, {
      useEasing: this.useEasing,
      useGrouping: this.useGroup,
      separator: this.separator,
      decimal: this.decimal,
    });
    setTimeout(() => {
      if (!this.counter.error) this.counter.start();
    }, this.delay);
  }

  private getHandleVal(val: number, len: number) {
    return {
      endVal: parseInt(val / Math.pow(10, this.unit[len - 1].value) + ""),
      unitText: this.unit[len - 1].label,
    };
  }

  private transformValue(val: number) {
    let len = this.unit.length;
    let res = {
      endVal: 0,
      unitText: "",
    };
    if (val < Math.pow(10, this.unit[0].value)) res.endVal = val;
    else {
      for (let i = 1; i < len; i++) {
        if (val >= Math.pow(10, this.unit[i - 1].value) && val < Math.pow(10, this.unit[i].value))
          res = this.getHandleVal(val, i);
      }
    }
    if (val > Math.pow(10, this.unit[len - 1].value)) {
      res = this.getHandleVal(val, len);
    }
    return res;
  }

  private getValue(val: number) {
    let res = 0;
    if (this.simplify) {
      let { endVal, unitText } = this.transformValue(val);
      this.unitText = unitText;
      res = endVal;
    } else {
      res = val;
    }
    return res;
  }

  public start() {
    this.initCountUp();
  }

  public pause() {
    this.counter.pauseResume();
  }

  public reset() {
    this.counter.reset();
  }
}
</script>

<style lang="scss" scoped>
.count-to-component {
  .content-outer {
    display: inline-block;
    margin: 0;
  }
}
</style>
