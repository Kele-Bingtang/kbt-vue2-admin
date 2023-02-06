<template>
  <div class="dynamic-table-container">
    <p>固定表头</p>
    <fixed-header-table />
    <p>不固定表头</p>
    <un-fixed-header-table />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import FixedHeaderTable from "./fixed-header-table.vue";
import UnFixedHeaderTable from "./un-fixed-header-table.vue";

@Component({ name: "DynamicTable", components: { FixedHeaderTable, UnFixedHeaderTable } })
export default class extends Vue {}
</script>

<style lang="scss" scoped>
.dynamic-table-container {
  padding: 20px;
}
</style>
