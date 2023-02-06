<template>
  <div style="padding: 30px">
    <el-alert :closable="false" title="menu 1-3" type="success">
      <transition name="fade-transform" mode="out-in">
        <router-view />
      </transition>
    </el-alert>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({ name: "Menu1-3" })
export default class extends Vue {}
</script>
