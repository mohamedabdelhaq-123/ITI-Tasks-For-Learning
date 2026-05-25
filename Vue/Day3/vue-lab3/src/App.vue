<script setup>
// Js code here 
// setup for auto expose, no need for setup() and ret. everything

import { products } from '@/stores/Products';
import NavBar from '@/components/NavBar.vue';
import Footer from '@/components/Footer.vue';

function handleBuy(productId) {
  console.log(`Product with ID ${productId} added to cart! with stock ${products.find(p => p.id === productId).stock}`);
  products.find(p => p.id === productId).stock--;
  console.log(`Product with ID ${productId} stock after purchase: ${products.find(p => p.id === productId).stock}`);
}
</script>

<template>
<!-- <MainPage/> -->
 <NavBar/> <!--  send to navbar the data -->
 <RouterView v-slot="{ Component }">
  <component :is="Component" :products  @buy="handleBuy"/> <!--:products is shorthanded for :products="products" -->
</RouterView>
 <!-- all view components will receive view-prop -->

 <Footer/>
</template>

<style scoped></style>


<!-- 2. root component  -->

<!-- scoped keyword -> styles for this compononet only -->