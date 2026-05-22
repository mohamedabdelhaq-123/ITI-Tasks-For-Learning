<script setup>
    import NavBar  from '@/components/NavBar.vue';
    import Body  from '@/components/Body.vue';
    import Footer  from '@/components/Footer.vue';
    import { MainProduct, RelatedProducts,navLinks,SiteName } from '@/stores/Products.js';
</script>

<template>
    <NavBar :title="SiteName"  :links="navLinks"/> <!--  send to navbar the data -->
    <Body :mainproduct="MainProduct" :relatedproducts="RelatedProducts" /><!--  send to body the data -->
    <Footer/>

</template>

<style scoped>
</style>  