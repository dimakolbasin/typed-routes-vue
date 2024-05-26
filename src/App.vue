<script setup lang="ts">
import {getRoute} from '~/router-required-params'
</script>

<template>
  <nav style="display: flex; gap: 12px; margin-bottom: 16px;">
    <RouterLink :to="getRoute({name: 'home'})">home</RouterLink>
    <RouterLink :to="getRoute({name: 'catalog.list'})">catalog.list</RouterLink>
    <RouterLink :to="getRoute({name: 'catalog.item', params: {id: '1'}})">catalog.item</RouterLink>
    <RouterLink :to="getRoute({name: 'catalog.item.reviews', params: {id: '1'}})">catalog.item.reviews</RouterLink>
  </nav>

  <hr/>

  <RouterView />
</template>
