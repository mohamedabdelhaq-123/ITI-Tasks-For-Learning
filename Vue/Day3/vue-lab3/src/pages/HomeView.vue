<script setup>
import CarouselBanner from '@/components/CarouselBanner.vue';
import Slider from '@/components/Slider.vue';
import { onMounted, onUnmounted } from 'vue';
import { useProductStore } from '@/stores/ProductStore';
import { useLocalStorage } from '@/composables/useLocalStorage';
import { storeToRefs } from 'pinia';
import { useApi } from '@/composables/useApi';

const productStore = useProductStore();
const { products } = storeToRefs(productStore); // products will be reactive and update when store updates


onMounted(async() => {
  await productStore.fetchProducts();
  console.log('products:', productStore.products);
  console.log('Count:', productStore.products.length);
});
onUnmounted(()=> console.log('Home Page unmounted'));
// defineProps({
//   products: {
//     type: Array,
//     required: true
//   }
// });

// const { products } = productStore; // products will always be [] (or any state only not getters and actions) , solution is storeToRefs(productStore) to make products reactive and update when store updates
// console.log(typeof productStore.products)
// console.log('HomeView: products from store',productStore, productStore.products);

// const storedVal = useLocalStorage('MOkey', "test");
// console.log(storedVal.value, "EHEEEE");
// storedVal.value=[];
// console.log(storedVal.value)

// const {data, loading, error, getAll,getOneProduct,updateProduct} = useApi();

// console.log('HomeView: products from API', data.value);
// async function fetchProducts(){
// await getAll();
// console.log('HomeView: products from API after getAll', data.value);
// }
// fetchProducts();
// async function testDecreaseStock(){
//     // test 1 - fetchProducts
//   await productStore.fetchProducts()
//   console.log('products:', productStore.products)
//   console.log('count:', productStore.products.length)

//   // test 2 - getProductById
//   const product = productStore.getProductById(1)
//   console.log('product 15:', product)

//   // test 3 - decreaseStock
//   console.log('stock before:', productStore.products.find(p => p.id == 1)?.stock)
//   await productStore.decreaseStock(1)
//   console.log('stock after:', productStore.products.find(p => p.id == 1)?.stock)
// }
// testDecreaseStock();

</script>

<template>
<h1 class="text-3xl font-bold mb-6 px-4">Trending Now</h1>
<CarouselBanner :products="products"/>
<Slider :products="products" :tag="['Men']" :title="`Men's Collection`"/>
<Slider :products="products" :tag="['Women']" :title="`Women's Collection`"/>
<Slider :products="products" :tag="['Kids']" :title="`Kids' Collection`"/>
</template>

<style scoped>
</style>