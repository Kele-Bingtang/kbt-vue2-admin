<template>
  <div class="count-to-container">
    <el-row :gutter="20">
      <el-col :span="4">
        <el-card shadow="hover">
          <div slot="header" class="title">
            <span>基础用法</span>
          </div>
          <div class="count-to-content">
            <count-to :start-val="0" :end-val="2727" count-class="count-text" />
          </div>
        </el-card>
      </el-col>

      <el-col :span="5">
        <el-card shadow="hover">
          <div slot="header" class="title">
            <span>添加前缀和后缀</span>
          </div>
          <div class="count-to-content">
            <count-to :start-val="0" :end-val="2727" prefix="Lucky " suffix=" Num" count-class="count-text" />
          </div>
        </el-card>
      </el-col>

      <el-col :span="7">
        <el-card shadow="hover">
          <div slot="header" class="title">
            <span>保留 2 位小数点</span>
          </div>
          <div class="count-to-content">
            <count-to :start-val="0" :end-val="2727" :decimals="2" count-class="count-text" />
          </div>
        </el-card>
      </el-col>

      <el-col :span="8">
        <el-card shadow="hover">
          <div slot="header" class="title">
            <span>动画持续 10 秒</span>
          </div>
          <div class="count-to-content">
            <count-to
              :start-val="0"
              :end-val="2727"
              :decimals="2"
              :duration="10"
              :use-easing="false"
              count-class="count-text"
            />
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="count-to-row">
      <el-col :span="8">
        <el-card shadow="hover" style="height: 270px">
          <div slot="header" class="title">
            <span>单位转换（自带）</span>
          </div>
          <div class="count-to-content">
            <count-to
              :simplify="true"
              :end-val="27272"
              prefix="原始数据：27272 => "
              count-class="count-text"
              unit-class="unit-class"
            />
            <count-to
              :simplify="true"
              :end-val="27272727"
              prefix="原始数据：27272727 => "
              count-class="count-text"
              unit-class="unit-class"
            />
            <count-to
              :simplify="true"
              :end-val="27272727277"
              prefix="原始数据：27272727277 => "
              count-class="count-text"
              unit-class="unit-class"
            />
          </div>
        </el-card>
      </el-col>

      <el-col :span="8">
        <el-card shadow="hover">
          <div slot="header" class="title">
            <span>自定义单位</span>
          </div>
          <div class="count-to-content">
            <count-to
              :simplify="true"
              :end-val="2727"
              :unit="customUnit"
              count-class="count-text"
              unit-class="unit-class"
            >
              <span slot="prefix">原始数据：2727 =>&nbsp;</span>
            </count-to>

            <count-to
              :simplify="true"
              :end-val="27272"
              :unit="customUnit"
              count-class="count-text"
              unit-class="unit-class"
            >
              <span slot="prefix">原始数据：27272 =>&nbsp;</span>
            </count-to>

            <count-to
              :simplify="true"
              :end-val="272727"
              count-class="count-text"
              :unit="customUnit"
              unit-class="unit-class"
            >
              <span slot="prefix">原始数据：272727 =>&nbsp;</span>
            </count-to>
          </div>
        </el-card>
      </el-col>

      <el-col :span="8">
        <el-card shadow="hover" style="height: 270px">
          <div slot="header" class="title">
            <span>异步更新数据</span>
          </div>
          <div class="count-to-content" style="line-height: 149px">
            <count-to :end-val="asyncEndVal" count-class="count-text" />
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row class="count-to-row">
      <el-card shadow="hover">
        <div slot="header" class="title">
          <span>
            完整 Demo： &lt;count-to :start-val=&#x27;{{ startVal }}&#x27; :end-val=&#x27;{{ endVal }}&#x27;
            :duration=&#x27;{{ duration }}&#x27; :decimals=&#x27;{{ decimals }}&#x27; :separator=&#x27;{{
              separator
            }}&#x27; :prefix=&#x27;{{ prefix }}&#x27; :suffix=&#x27;{{ suffix }}&#x27; :autoplay=false&gt;
          </span>
        </div>
        <div class="count-to-content">
          <count-to
            ref="count"
            :start-val="startVal"
            :end-val="endVal"
            :duration="duration"
            :decimals="decimals"
            :separator="separator"
            :prefix="prefix"
            :suffix="suffix"
            :autoplay="false"
            class="count-demo"
          />
          <el-form :inline="true" :model="countToParams" class="demo-form-inline">
            <el-form-item label="起始值：">
              <el-input v-model="countToParams.startVal" placeholder="startVal"></el-input>
            </el-form-item>
            <el-form-item label="结束值：">
              <el-input v-model="countToParams.endVal" placeholder="endVal"></el-input>
            </el-form-item>
            <el-form-item label="持续时间：">
              <el-input v-model="countToParams.duration" placeholder="duration"></el-input>
            </el-form-item>
            <el-form-item label="保留小数：">
              <el-input v-model="countToParams.decimals" placeholder="decimals"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="start">Start</el-button>
              <el-button type="primary" @click="pauseResume">Pause/Resume</el-button>
              <el-button type="primary" @click="reset">Reset</el-button>
            </el-form-item>
            <el-form-item label="分隔符：">
              <el-input v-model="countToParams.separator" placeholder="separator"></el-input>
            </el-form-item>
            <el-form-item label="前缀：">
              <el-input v-model="countToParams.prefix" placeholder="prefix"></el-input>
            </el-form-item>
            <el-form-item label="后缀：">
              <el-input v-model="countToParams.suffix" placeholder="suffix"></el-input>
            </el-form-item>
          </el-form>
        </div>
      </el-card>
    </el-row>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import CountTo from "@/components/CountTo/index.vue";

@Component({ name: "CountToDemo", components: { CountTo } })
export default class extends Vue {
  public asyncEndVal = 199;
  public timer = 0;

  public countToParams = {
    startVal: 0,
    endVal: 1999,
    duration: 4,
    decimals: 0,
    separator: ",",
    suffix: " Year",
    prefix: "Be ",
  };

  public customUnit = [
    { value: 3, label: "千多" },
    { value: 4, label: "万多" },
    { value: 5, label: "十万多" },
  ];

  mounted() {
    this.init();
  }

  activated() {
    this.init();
  }

  deactivated() {
    this.timer = 0;
  }

  beforeDestroy() {
    this.timer = 0;
  }

  public init() {
    this.timer = setInterval(() => {
      this.asyncEndVal += parseInt(Math.random() * 30 + "");
    }, 2000);
  }

  get startVal() {
    if (this.countToParams.startVal) {
      return this.countToParams.startVal;
    } else {
      return 0;
    }
  }

  get endVal() {
    if (this.countToParams.endVal) {
      return this.countToParams.endVal;
    } else {
      return 0;
    }
  }

  get duration() {
    if (this.countToParams.duration) {
      return this.countToParams.duration;
    } else {
      return 100;
    }
  }

  get decimals() {
    if (this.countToParams.decimals) {
      if (this.countToParams.decimals < 0 || this.countToParams.decimals > 20) {
        alert("decimals 值应该在 0 - 20 区间内");
        return 0;
      }
      return this.countToParams.decimals;
    } else {
      return 0;
    }
  }

  get separator() {
    return this.countToParams.separator;
  }

  get suffix() {
    return this.countToParams.suffix;
  }

  get prefix() {
    return this.countToParams.prefix;
  }

  public start() {
    this.$refs.count && (this.$refs.count as any).start();
  }

  public pauseResume() {
    this.$refs.count && (this.$refs.count as any).pause();
  }

  public reset() {
    this.$refs.count && (this.$refs.count as any).reset();
  }
}
</script>

<style lang="scss" scoped>
.count-to-container {
  padding: 20px;
  .count-to-row {
    margin-top: 20px;
  }
  .count-to-content {
    text-align: center;
  }
  .count-demo {
    font-size: 50px;
    color: var(--theme-color);
    display: block;
    margin-bottom: 20px;
    text-align: center;
    font-size: 80px;
    font-weight: 500;
  }
}
</style>
<style lang="scss">
.count-to-container {
  .count-text {
    font-size: 50px;
    color: var(--theme-color);
  }
  .unit-class {
    font-size: 30px;
    color: var(--theme-color);
  }
}
</style>
