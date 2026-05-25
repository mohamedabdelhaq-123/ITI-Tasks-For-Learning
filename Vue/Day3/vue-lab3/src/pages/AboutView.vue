<script setup>
import { onMounted, onUnmounted } from 'vue';

onMounted(() => console.log('About View mounted'));
onUnmounted(() => console.log('About View unmounted'));
</script>

<template>

    <div class="text-center py-16 px-4 max-w-3xl mx-auto">
      <h1 class="text-4xl font-black tracking-widest uppercase mb-6">POVue Store At A Glance</h1>
      <p class="text-gray-600 text-base leading-relaxed">
        POVue is a modern shoe destination built for everyone — from runners to fashion lovers.
        We believe great footwear should be accessible, stylish, and built to last.
        Every step matters, and we're here to make yours count.
      </p>
    </div>

    <div class="max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center gap-12">
      <div class="w-full md:w-1/2">
        <img
          src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=600&fit=crop"
          alt="Shoes collection"
          class="w-full h-[380px] object-cover"
        />
      </div>
      <div class="w-full md:w-1/2">
        <h2 class="text-2xl font-black uppercase tracking-wide mb-4">Footwear Loved By Many</h2>
        <p class="text-gray-600 leading-relaxed">
          It all started with a passion for quality shoes in Cairo, Egypt.
          Today, POVue carries hundreds of styles across Men, Women, and Kids categories.
          We partner with the world's top brands — Nike, Adidas, Puma, New Balance and more —
          to bring you the best selection at honest prices.
          Our goal is simple: make great shoes accessible to as many people as possible.
        </p>
      </div>
    </div>

    <div class="max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row-reverse items-center gap-12">
      <div class="w-full md:w-1/2">
        <img
          src="https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&h=600&fit=crop"
          alt="How we do it"
          class="w-full h-[380px] object-cover"
        />
      </div>
      <div class="w-full md:w-1/2">
        <h2 class="text-2xl font-black uppercase tracking-wide mb-4">How We Do It</h2>
        <p class="text-gray-600 leading-relaxed">
          We carefully curate every product in our store.
          Each shoe is selected based on quality, comfort, and style.
          Our team tests products before they hit the shelves so you never have to compromise.
          From everyday sneakers to performance running shoes, we've got every occasion covered.
        </p>
      </div>
    </div>

</template>

<style scoped>
</style>