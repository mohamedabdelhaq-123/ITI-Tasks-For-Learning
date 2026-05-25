<script setup>
import { onMounted, onUnmounted } from 'vue';
import { useCartStore } from '@/stores/CartStore';

onMounted(() => console.log('Cart View mounted'));
onUnmounted(() => console.log('Cart View unmounted'));

const cartStore = useCartStore();
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 py-12">
    <h1 class="text-3xl font-bold mb-8">Your Cart</h1>

    <div v-if="cartStore.items.length === 0" class="text-center py-24">
      <p class="text-2xl font-semibold text-base-content/50">Your cart is empty</p>
      <RouterLink to="/" class="btn btn-primary mt-6">Continue Shopping</RouterLink>
    </div>

    <div v-else>
      <div class="overflow-x-auto">
        <table class="table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Subtotal</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in cartStore.items" :key="item.id">
              <td>
                <div class="flex items-center gap-4">
                  <img :src="item.image" :alt="item.name" class="w-16 h-16 object-cover rounded-lg"/>
                  <span class="font-semibold">{{ item.name }}</span>
                </div>
              </td>

              <td>${{ item.price }}</td>

              <td>{{ item.qty }}</td>

              <td class="font-bold">${{ (item.price * item.qty).toFixed(2) }}</td>

              <td>
                <button
                  @click="cartStore.removeFromCart(item.id)"
                  class="btn btn-error btn-sm"
                >
                  Remove
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="flex justify-between items-center mt-8 border-t pt-6">
        <button @click="cartStore.clearCart()" class="btn btn-outline btn-error">
          Clear Cart
        </button>
        <div class="text-right">
          <p class="text-sm text-base-content/60">Total Items: {{ cartStore.totalItems }}</p>
          <p class="text-2xl font-extrabold mt-1">Total: ${{ cartStore.totalPrice.toFixed(2) }}</p>
        </div>
      </div>
    </div>

  </div>
</template>