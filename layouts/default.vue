<template>
  <div class="box-all">
    <v-header v-if="isRouterAlive"></v-header>
    <nuxt v-if="isRouterAlive" />
  </div>
</template>

<script>
import VHeader from "~/components/header";

export default {
  provide() {
    return {
      reload: this.reload,
    };
  },
  data() {
    return {
      isRouterAlive: true,
    };
  },
  components: {
    VHeader,
  },
  methods: {
    reload() {
      this.isRouterAlive = false;
      this.$nextTick(function () {
        this.isRouterAlive = true;
      });
    },
  },
};
</script>
<style>
#__nuxt,
#__layout,
.box-all {
  height: 100%;
  width: 100%;
}
</style>
