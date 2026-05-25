<script setup>
import ProductCard from '@/components/ProductCard.vue';
import ProductDetails from '@/components/ProductDetails.vue';
import Slider from '@/components/Slider.vue';
import { onMounted, onUnmounted, ref ,computed} from 'vue';
import { useRoute } from 'vue-router';
import { useProductStore } from '@/stores/ProductStore';
import { storeToRefs } from 'pinia';  

const productStore = useProductStore();
const { products } = storeToRefs(productStore); // products will be reactive and update when

onMounted(async () => {
  if(productStore.products.length === 0){
    await productStore.fetchProducts()
  }
  console.log(`Product Page mounted for ID: ${route.params.id}`)
});
onUnmounted(()=> console.log('Product Page unmounted'));

// id is str in params
const route = useRoute();
// const id = route.params.id;
// const props = defineProps({
//   products: {
//     type: Array,
//     required: true
//   }
// });
//  const product = props.products.find(p => p.id == id);

const product = computed(() => 
  products.value.find(p => p.id == route.params.id) // computed to apply reactivity so when route changes the prod. updated
);
</script>

<template>
<ProductDetails v-if="product" :product/>
<Slider v-if="product" :products="products" :tag="product.tags" title="You may also like"/>
</template>

<style scoped>
</style>