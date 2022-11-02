<template>
  <div>
    <tinymce v-if="tinymceActive" v-model="content" :height="400" />
    <!-- <div class="editor-content" v-html="content"></div> -->
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Tinymce from "@/components/Tinymce/index.vue";

@Component({
  components: { Tinymce },
})
export default class TinymceDemo extends Vue {
  public content = `<h1 style="text-align: center;">Welcome to the TinyMCE demo!</h1><p style="text-align: center; font-size: 15px;"><img title="Logo" src="./favicon.ico" alt="Logo" width="100" height="100" /><ul>
      <li>Our <a href="//www.tinymce.com/docs/">documentation</a> is a great resource for learning how to configure TinyMCE.</li><li>Have a specific question? Visit the <a href="https://community.tinymce.com/forum/">Community Forum</a>.</li><li>We also offer enterprise grade support as part of <a href="https://tinymce.com/pricing">TinyMCE premium subscriptions</a>.</li>
    </ul>`;

  public tinymceActive = true;

  deactivated() {
    this.tinymceActive = false;
  }

  activated() {
    this.tinymceActive = true;
  }
}
</script>

<style lang="scss" scoped></style>
