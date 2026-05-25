<script setup>
import { onMounted, onUnmounted } from 'vue';
import { randomProducts } from '@/utils/RandomProducts';
import { computed } from 'vue';
onMounted(() => console.log('Carousel Banner mounted'));
onUnmounted(()=> console.log('Carousel Banner unmounted'));

const props= defineProps({
  products: {
    type: Array,
    required: true
  }
});

// const carouselProducts = props.products?.filter(product => product.badge === 'NEW') || [];
// const randomCarouselProducts = randomProducts(carouselProducts).slice(0, 6); 

const randomCarouselProducts = computed(() => {
  const carouselProducts = props.products?.filter(product => product.badge === 'NEW') || [];
  console.log('Computing random carousel products');
  return randomProducts(carouselProducts).slice(0, 6);
});
console.log(randomCarouselProducts.value);
</script>

<template>
  <div
    v-if="randomCarouselProducts.length"
    class="relative max-w-5xl mx-auto h-[480px] rounded-3xl overflow-hidden shadow-2xl bg-base-200"
  >
    <div class="carousel w-full h-full">
      <div
        v-for="(product, index) in randomCarouselProducts"
        :key="product.id"
        :id="'slide-' + index"
        class="carousel-item relative w-full h-full"
      >
        <img
          :src="product.image"
          :alt="product.name"
          loading="lazy"
          class="w-full h-full object-cover"
        />

        <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        <div v-if="product.badge" class="absolute top-5 left-6">
          <span class="badge badge-primary text-white font-bold px-4 py-3 text-sm tracking-widest">
            {{ product.badge }}
          </span>
        </div>

        <div class="absolute bottom-16 left-6 right-20 text-white">
          <h2 class="text-3xl font-bold drop-shadow-lg mb-1">{{ product.name }}</h2>
          <p class="text-sm text-white/70 mb-3 line-clamp-1">{{ product.description }}</p>
        </div>

        <div class="absolute left-0 right-0 top-1/2 -translate-y-1/2 flex justify-between px-4">
          
          <a  :href="'#slide-' + (index === 0 ? randomCarouselProducts.length - 1 : index - 1)"
            class="btn btn-circle bg-white/20 border-none text-white hover:bg-white/40 backdrop-blur-sm"
          >
            ❮
          </a>
          
          <a  :href="'#slide-' + (index === randomCarouselProducts.length - 1 ? 0 : index + 1)"
            class="btn btn-circle bg-white/20 border-none text-white hover:bg-white/40 backdrop-blur-sm"
          >
            ❯
          </a>
        </div>
      </div>
      
    </div>

    <div class="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
      
      <a  v-for="(_, index) in randomCarouselProducts"
        :key="index"
        :href="'#slide-' + index"
        class="w-2.5 h-2.5 rounded-full bg-white/40 hover:bg-white transition-all duration-300"
      />
    </div>
  </div>

</template>
<style scoped>
</style>