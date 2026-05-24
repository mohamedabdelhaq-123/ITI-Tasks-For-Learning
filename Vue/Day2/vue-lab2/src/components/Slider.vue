<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue';
import ProductCard from '@/components/ProductCard.vue';
import { useRoute } from 'vue-router';

onMounted(() => console.log('Slider mounted'));
onUnmounted(() => console.log('Slider unmounted'));

const props = defineProps({
  products: {
    type: Array,
    required: true
  },
  tag: {
    type: Array,
    default: () => []
  },
  title: {
    type: String,
    required: true
  }
});
// const id = useRoute().params.id;
const scrollContainer = ref(null);

// const productsSlider = computed(() =>
//   props.products.filter(p => props.tag.some(tag => p.tags.includes(tag)))
// );

const productsSlider = computed(() => {
//   console.log('slider products:', props.products);
//   console.log('slider tag:', props.tag);
  return props.products.filter(p => { if (p.id == useRoute().params.id) return false; // so same prod. not repeated in related section
    return props.tag.some(tag => p.tags.includes(tag));
  });
});
const scroll = (direction) => {
  scrollContainer.value.scrollBy({
    left: direction === 'left' ? -340 : 340,
    behavior: 'smooth'
  });
};
</script>

<template>
  <div class="py-10">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl font-bold tracking-tight">{{ props.title }}</h2>
        <div class="flex gap-2">
          <button @click="scroll('left')" class="btn btn-circle btn-sm btn-outline">❮</button>
          <button @click="scroll('right')" class="btn btn-circle btn-sm btn-outline">❯</button>
        </div>
      </div>

      <div
        ref="scrollContainer"
        class="flex gap-6 overflow-x-auto pb-4 scroll-smooth"
      >
        <div
          v-for="product in productsSlider"
          :key="product.id"
          class="min-w-[240px] max-w-[240px]"
        >
          <ProductCard :product="product" />
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
div::-webkit-scrollbar {
  display: none;
}
</style>