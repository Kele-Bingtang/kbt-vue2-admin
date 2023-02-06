<template></template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({ name: "Redirect" })
export default class extends Vue {
  created() {
    const { params, query } = this.$route;
    const { path } = params;
    if (path) {
      this.$router.replace({ path: "/" + path, query }).catch(err => {
        console.warn(err);
      });
    } else {
      this.$router.replace({ path: "/", query }).catch(err => {
        console.warn(err);
      });
    }
  }
}
</script>
