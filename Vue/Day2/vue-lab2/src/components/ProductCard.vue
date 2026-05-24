<script setup>
import { onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';

onMounted(() => console.log('Product Card mounted'));
onUnmounted(() => console.log('Product Card unmounted'));

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
});

// const router = useRouter();

// function handleClick() {
//     router.replace(`/product/${props.product.id}`); // replace of history, so user can't go back to the previous page by back button, and it will be replaced by the product page in the history stack
// //   router.push(`/product/${props.product.id}`);
// }
</script>

<template>
<RouterLink :to="`/product/${props.product.id}`" class="group relative cursor-pointer">
  <div class="group relative cursor-pointer">
    <img
      :src="props.product.image"
      :alt="props.product.name"
      class="aspect-square w-full rounded-md bg-gray-200 object-cover group-hover:opacity-75 lg:aspect-auto lg:h-80"
    />
    <div class="mt-4 flex justify-between">
      <div>
        <h3 class="text-sm text-gray-700">{{ props.product.name }}</h3>
        <!-- <p class="mt-1 text-sm text-gray-500">
          <span v-if="props.product.badge" class="badge badge-sm">{{ props.product.badge }}</span>
        </p> -->
      </div>
      <p class="text-sm font-medium text-white-900">${{ props.product.price }}</p>
    </div>
  </div>
  </RouterLink>
</template>

<style scoped>
</style>