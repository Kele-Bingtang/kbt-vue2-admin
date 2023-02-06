<template>
  <div style="height: 80%; display: flex; flex-direction: column; justify-content: center; align-items: center">
    <el-button v-if="timeStr" type="primary" @click="handleClick">{{ timeStr }}</el-button>
    <div style="font-size: 45px; height: 500px; line-height: 500px">{{ timeStr }}</div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({ name: "Home1" })
export default class extends Vue {
  public timeStr = "";
  public timer = -1;

  mounted() {
    this.timer = setInterval(() => {
      this.getTime();
    }, 1000);
  }

  beforeDestroy() {
    clearInterval(this.timer);
  }

  // 路由周期 - 路由激活
  activated() {
    this.timer = setInterval(() => {
      this.getTime();
    }, 1000);
  }

  // 路由周期 - 路由失活
  deactivated() {
    clearInterval(this.timer);
  }

  public getTime() {
    let hours = new Date().getHours();
    let minutes = new Date().getMinutes();
    let seconds = new Date().getSeconds();
    let realHours = hours < 10 ? "0" + hours : hours;
    let realMinutes = minutes < 10 ? "0" + minutes : minutes;
    let realSeconds = seconds < 10 ? "0" + seconds : seconds;
    if (hours >= 6 && hours < 11) {
      this.timeStr = `早上好呀~~，现在是 ${realHours}:${realMinutes}:${realSeconds}，吃早餐了吗？😊🤭`;
    } else if (hours >= 12 && hours <= 16) {
      this.timeStr = `下午好呀~~，现在是 ${realHours}:${realMinutes}:${realSeconds}，繁忙的下午也要适当休息哦🥤🏀~~`;
    } else if (hours >= 16 && hours <= 19) {
      this.timeStr = `到黄昏了~~，现在是 ${realHours}:${realMinutes}:${realSeconds}，该准备吃饭啦🥗🍖~~`;
    } else if (hours >= 19 && hours < 24) {
      this.timeStr = `晚上好呀~~，现在是 ${realHours}:${realMinutes}:${realSeconds}，该准备洗漱睡觉啦🥱😪~~`;
    } else if (hours >= 0 && hours < 6) {
      this.timeStr = `别再熬夜了~~，现在是 ${realHours}:${realMinutes}:${realSeconds}，早点睡吧，让我们一起欣赏早上的太阳~~😇🛏`;
    }
  }

  public handleClick() {
    this.$message({
      message: this.timeStr,
      type: "info",
    });
  }
}
</script>

<style lang="scss" scoped></style>
