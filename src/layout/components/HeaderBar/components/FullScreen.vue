<template>
  <div v-if="showFullScreenBtn" class="full-screen">
    <svg-icon
      :name="isFullscreen ? 'exit-fullscreen' : 'fullscreen'"
      @click="handleChange"
      width="18px"
      height="22px"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({})
export default class FullScreen extends Vue {
  public isFullscreen: boolean = false;

  get showFullScreenBtn() {
    return window.navigator.userAgent.indexOf("MSIE") < 0;
  }

  mounted() {
    let document: any = window.document;
    let isFullscreen =
      document.fullscreenElement ||
      document.mozFullScreenElement ||
      document.webkitFullscreenElement ||
      document.fullScreen ||
      document.mozFullScreen ||
      document.webkitIsFullScreen;
    isFullscreen = !!isFullscreen;
    document.addEventListener("fullscreenchange", () => {
      this.isFullscreen = !this.isFullscreen;
    });
    document.addEventListener("mozfullscreenchange", () => {
      this.isFullscreen = !this.isFullscreen;
    });
    document.addEventListener("webkitfullscreenchange", () => {
      this.isFullscreen = !this.isFullscreen;
    });
    document.addEventListener("msfullscreenchange", () => {
      this.isFullscreen = !this.isFullscreen;
    });
    this.isFullscreen = isFullscreen;
  }

  public handleFullscreen() {
    let document: any = window.document;
    let documentElement: any = document.documentElement;
    if (this.isFullscreen) {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    } else {
      if (documentElement.requestFullscreen) {
        documentElement.requestFullscreen();
      } else if (documentElement.mozRequestFullScreen) {
        documentElement.mozRequestFullScreen();
      } else if (documentElement.webkitRequestFullScreen) {
        documentElement.webkitRequestFullScreen();
      } else if (documentElement.msRequestFullscreen) {
        documentElement.msRequestFullscreen();
      }
    }
  }
  public handleChange() {
    this.handleFullscreen();
  }
}
</script>

<style lang="scss" scoped></style>
