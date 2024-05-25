<script setup lang="ts">
import {getLink} from '~/router-required-params'
</script>

<template>
  <nav style="display: flex; gap: 12px; margin-bottom: 16px;">
    <RouterLink :to="getLink({name: 'home'})">home</RouterLink>
    <RouterLink :to="getLink({name: 'catalog.list'})">catalog.list</RouterLink>
    <RouterLink :to="getLink({name: 'catalog.item', params: {id: '1'}})">catalog.item</RouterLink>
    <RouterLink :to="getLink({name: 'catalog.item.reviews', params: {id: '1'}})">catalog.item.reviews</RouterLink>
  </nav>

  <hr/>

  <RouterView />
</template>
