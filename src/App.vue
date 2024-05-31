<script setup lang="ts">
import { validateRouteByNameWithParams } from '~/router-required-params'

// edge untypeable case
// import { useRouter } from 'vue-router'
// const router = useRouter()
// const goToRoutePath = (to: string) => {
//   router.push(to)
// }

</script>

<template>
  <nav style="display: flex; gap: 12px; margin-bottom: 16px;">
    <RouterLink :to="validateRouteByNameWithParams({name: 'home', params: {prefix_city: 'new-york'}})">home</RouterLink>
    <RouterLink :to="validateRouteByNameWithParams({name: 'catalog.list'})">catalog.list</RouterLink>
    <RouterLink :to="validateRouteByNameWithParams({name: 'catalog.item', params: {id: '1'}})">catalog.item</RouterLink>
    <RouterLink :to="validateRouteByNameWithParams({name: 'catalog.item.reviews', params: {id: '1'}})">catalog.item.reviews</RouterLink>
    
    <!-- edge untypeable case
    <button @click="goToRoutePath('/catalog/123/reviews')">catalog.item.reviews 123</button>
    <RouterLink :to="'/catalog/124/reviews'">catalog.item.reviews 124</RouterLink> -->
  </nav>

  <hr/>

  <RouterView />
</template>
