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
            <count-to :start-val="0" :end-val="2727" prefix="Cost " suffix=" Money" count-class="count-text" />
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
            <span>持续时间 10,000 毫秒</span>
          </div>
          <div class="count-to-content">
            <count-to
              :start-val="0"
              :end-val="2727"
              :decimals="2"
              :duration="5"
              :use-easing="false"
              count-class="count-text"
            />
            <count-to1 :start-val="0" :end-val="2727" :decimals="2" :duration="5000" />
            <count-to1 :end-val="2727" :decimals="2" :duration="5000" :use-easing="false" style="display: block" />
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="count-to-row">
      <el-col :span="5">
        <el-card shadow="hover">
          <div slot="header" class="title">
            <span>转换单位简化数据</span>
          </div>
          <div class="count-to-content">
            <count-to :simplify="true" :end-val="2727" count-class="count-text" unit-class="unit-class" />
          </div>
        </el-card>
      </el-col>

      <el-col :span="5">
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
              class="count"
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

      <el-col :span="5">
        <el-card shadow="hover">
          <div slot="header" class="title">
            <span>异步更新数据</span>
          </div>
          <div class="count-to-content">
            <count-to :end-val="asynEndVal" count-class="count-text" />
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row>
      <el-card shadow="hover">
        <div slot="header" class="title">
          <span>综合实力</span>
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
            <el-form-item label="startVal：">
              <el-input v-model="countToParams.startVal" placeholder="startVal"></el-input>
            </el-form-item>
            <el-form-item label="endVal：">
              <el-input v-model="countToParams.endVal" placeholder="endVal"></el-input>
            </el-form-item>
            <el-form-item label="duration：">
              <el-input v-model="countToParams.duration" placeholder="duration"></el-input>
            </el-form-item>
            <el-form-item label="decimals：">
              <el-input v-model="countToParams.decimals" placeholder="decimals"></el-input>
            </el-form-item>
            <el-form-item label="separator：">
              <el-input v-model="countToParams.separator" placeholder="separator"></el-input>
            </el-form-item>
            <el-form-item label="prefix：">
              <el-input v-model="countToParams.prefix" placeholder="prefix"></el-input>
            </el-form-item>
            <el-form-item label="suffix：">
              <el-input v-model="countToParams.suffix" placeholder="suffix"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="start">Start</el-button>
              <el-button type="primary" @click="pauseResume">pause/resume</el-button>
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
import CountTo1 from "vue-count-to";

@Component({
  components: {
    CountTo,
    CountTo1,
  },
})
export default class CountToDemo extends Vue {
  public asynEndVal = 199;
  public timer = 0;

  public countToParams = {
    startVal: 0,
    endVal: 2017,
    duration: 4,
    decimals: 0,
    separator: "",
    suffix: " rmb",
    prefix: "¥ ",
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
      this.asynEndVal += parseInt(Math.random() * 30 + "");
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
        alert("digits argument must be between 0 and 20");
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
    this.$refs.count && (this.$refs.count as any).pauseResume();
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
  .count {
    margin: 20px 0;
  }
  .count-demo {
    font-size: 50px;
    color: #f6416c;
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
    color: #dc9387;
  }
  .unit-class {
    font-size: 30px;
    color: #dc9387;
  }
}
</style>
