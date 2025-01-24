<script setup>
  import Navigation from './Edit/Navigation.vue';
</script>

<template>
  <v-row class="h-100">
    <v-col cols="3" class="h-100 border-right">
      <Navigation />
    </v-col>
    <v-col cols="9" class="h-100">
      <router-view class="h-100 overflow-hidden overflow-y-auto" />
    </v-col>
  </v-row>
</template>

<style lang="scss" scoped>
.h-fill {
  height: calc(100% - 12px);
}
</style>
