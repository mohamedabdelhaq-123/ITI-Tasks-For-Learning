<script setup>
import ProductCard from '@/components/ProductCard.vue';
import ProductDetails from '@/components/ProductDetails.vue';
import Slider from '@/components/Slider.vue';
import { onMounted, onUnmounted, ref ,computed} from 'vue';
import { useRoute } from 'vue-router';

onMounted(() => console.log(`Product Page mounted for ID: ${useRoute().params.id}`)); // ProductView mounted for ID: X
onUnmounted(()=> console.log('Product Page unmounted'));

// id is str in params
const route = useRoute();
// const id = route.params.id;
const props = defineProps({
  products: {
    type: Array,
    required: true
  }
});
//  const product = props.products.find(p => p.id == id);

const product = computed(() => 
  props.products.find(p => p.id == route.params.id) // computed to apply reactivity so when route changes the prod. updated
);
</script>

<template>
<ProductDetails :product @buy="$emit('buy',$event)"/>
<Slider :products :tag="product.tags" :title="'You may also like'"/>
</template>

<style scoped>
</style>