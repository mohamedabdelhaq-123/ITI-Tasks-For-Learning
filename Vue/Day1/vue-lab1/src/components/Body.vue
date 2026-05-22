<script setup>
import { computed } from 'vue';

const props=defineProps({
    mainproduct: {
        type: Object,
        required: true
    },
    relatedproducts: {
        type: Array,
        required: true
    }
});

function discount(price, discount) {
    return price - (price * discount) / 100;
}
// use props.mainproduct.price not mainproduct.price bec, mainproduct is not defined in this scope (made only for templates) but props is defined and has mainproduct as property
const discountedPrice = computed(()=>{
        return props.mainproduct.price - (props.mainproduct.price * props.mainproduct.discount) / 100;
});


</script>

<template>
    
    <div class="hero bg-base-200 min-h-screen">
        <div class="hero-content flex-col lg:flex-row gap-8 lg:gap-16 max-w-6xl mx-auto px-4">
            
            <div class="relative w-full max-w-sm shrink-0 mt-8 lg:mt-0">
                <img :src="mainproduct?.image" class="w-full rounded-2xl shadow-2xl object-cover aspect-square" alt="Main Product" />
                
                <span v-if="mainproduct?.badge" class="badge badge-warning badge-lg absolute top-4 left-4 shadow-lg font-bold uppercase tracking-wider">
                    {{ mainproduct.badge }}
                </span>
            </div>
            
            
            <div class="flex flex-col gap-4 w-full">
                <h1 class="text-4xl lg:text-5xl font-extrabold">{{ mainproduct.name }}</h1>
                <p class="text-lg text-base-content/80">
                    {{ mainproduct.description }}
                </p>
                
                
                <div class="flex flex-wrap gap-2">
                    <span class="badge badge-accent badge-outline" v-for="value in mainproduct.tags" :key="value"> 
                        {{ value }} 
                    </span>
                </div>
                
                
                <div class="flex items-center gap-3 mt-2">
                    <p v-if="mainproduct?.discount" class="text-4xl font-bold text-primary">
                        ${{ discountedPrice }} 
                        <span class="line-through text-base-content/40 text-xl font-normal ml-2">${{ mainproduct.price }}</span> 
                    </p>
                    <p v-else class="text-4xl font-bold text-primary">${{ mainproduct.price }}</p>
                </div>

                
                <div class="mt-6">
                    <button class="btn btn-primary btn-lg w-full sm:w-auto shadow-lg hover:-translate-y-1 transition-transform">
                        Add To Cart
                    </button>
                </div>
            </div>
        </div>
    </div>

    
    <div class="max-w-6xl mx-auto px-4 py-16">
        <div class="divider text-2xl font-bold mb-10 text-base-content/80">Related Products</div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            <div v-for="product in relatedproducts" :key="product.id" class="card bg-base-100 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border border-base-200">
                
                <figure class="px-4 pt-4">
                    <img :src="product.image" alt="Product Image" class="w-full h-56 object-cover rounded-xl shadow-sm" />
                </figure>
                
                
                <div class="card-body">
                    <h2 class="card-title">{{ product.name }}</h2>
                    
                    
                    <div class="flex items-center mt-auto pt-2">
                        <p v-if="product?.discount" class="text-2xl font-bold text-primary">
                            ${{discount(product.price, product.discount) }} 
                            <span class="line-through text-base-content/40 text-sm font-normal ml-2">${{ product.price }}</span> 
                        </p>
                        <p v-else class="text-2xl font-bold text-primary">${{ product.price }}</p>
                    </div>
                    
                    
                    <div class="card-actions justify-end mt-4">
                        <button class="btn btn-secondary btn-sm">Quick View</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
</style>



<!-- 
<template>
    <div class="hero bg-base-200 min-h-screen">
        <div class="hero-content flex-col lg:flex-row">
            <div class="relative max-w-sm">
                <img :src="mainproduct?.image" class="w-full rounded-lg shadow-2xl" />
                
                <span v-if="mainproduct?.badge" class="badge badge-warning absolute top-4 left-4 shadow-md font-bold">
                    {{ mainproduct.badge }}
                </span>
            </div>
            <div>
                <h1 class="text-5xl font-bold">{{ mainproduct.name }}</h1>
                <p class="py-6">
                    {{ mainproduct.description }}
                </p>
                <div class="badge badge-accent" v-for="value in mainproduct.tags"> {{ value }} </div>
                <p v-if="mainproduct?.discount">$ {{ discountedPrice}} <span class="line-through text-base-content/50 text-sm">{{ mainproduct.price }}</span> </p>
                <p v-else>{{ mainproduct.price }}</p>

                <button class="btn btn-primary">Add To Cart</button>
            </div>
        </div>
    </div>
    <div class="divider">Related Products </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div v-for="product in relatedproducts" :key="product.id" class="card bg-base-100 shadow-xl">
                <figure>
                    <img :src="product.image" alt="Product Image" class="w-full h-48 object-cover" />
                </figure>
                <div class="card-body">
                <h2 class="card-title">{{ product.name }}</h2>
                <p v-if="product?.discount">{{ discountedPrice}} <span
span class="line-through text-base-content/50 text-sm">{{ product.price }}</span> </p>
                <p v-else>{{ product.price }}</p>
                <div class="card-actions justify-end"></div>
                </div>
            </div>
        </div>
    
</template> -->
