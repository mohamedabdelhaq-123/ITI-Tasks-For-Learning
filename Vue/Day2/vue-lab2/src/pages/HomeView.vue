<script setup>
import CarouselBanner from '@/components/CarouselBanner.vue';
import Slider from '@/components/Slider.vue';
import { onMounted, onUnmounted } from 'vue';

onMounted(() => console.log('Home Page mounted')); // HomeView mounted — X products loaded
onUnmounted(()=> console.log('Home Page unmounted'));
defineProps({
  products: {
    type: Array,
    required: true
  }
});
</script>

<template>
<h1 class="text-3xl font-bold mb-6 px-4">Trending Now</h1>
<CarouselBanner :products/>
<Slider :products :tag="['Men']" :title="`Men's Collection`"/>
<Slider :products :tag="['Women']" :title="`Women's Collection`"/>
<Slider :products :tag="['Kids']" :title="`Kids' Collection`"/>
</template>

<style scoped>
</style>