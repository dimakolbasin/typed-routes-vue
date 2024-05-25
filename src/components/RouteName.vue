<script setup lang="ts">
import { useRoute } from 'vue-router'
const route = useRoute()

</script>

<template>
  <h2>
    Current route path:
  </h2>

  <div style="border: 1px solid black; padding: 10px">
    {{ route.fullPath }}
  </div>
</template>
