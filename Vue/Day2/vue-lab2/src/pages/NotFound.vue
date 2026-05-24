<script setup>
import router from "@/router";
import { onMounted, onUnmounted } from 'vue';

onMounted(() => {
  router.replace({ path: "/not-found" }); // replace of history, so user can't go back to the previous page by back button, and it will be replaced by the 404 page in the history stack
  // router.push({ path: "/not-found" }); // push to history, so user can go back to the previous page by back button, and it will be added to the history stack
  console.log('Redirecting to 404 page');
});
onUnmounted(() => console.log('404 Page unmounted'));

</script>

<template>
    <h1> 404</h1>
    <p>Page Not Found</p>
    <RouterLink to="/"><button class="btn btn-primary">Go back to Home</button></RouterLink>
</template>

<style scoped></style>
