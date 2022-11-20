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

@Component({
  components: { FixedHeaderTable, UnFixedHeaderTable },
})
export default class DynamicTable extends Vue {}
</script>

<style lang="scss" scoped>
.dynamic-table-container {
  padding: 20px;
}
</style>
