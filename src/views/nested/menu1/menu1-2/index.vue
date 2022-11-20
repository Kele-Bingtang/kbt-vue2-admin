<template>
  <div style="padding: 30px">
    <el-alert :closable="false" title="menu 1-2" type="success"></el-alert>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({
  name: "Menu1-2",
})
export default class extends Vue {}
</script>
