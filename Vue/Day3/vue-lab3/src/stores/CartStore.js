
import { defineStore } from "pinia";
import { computed } from "vue";
import { useLocalStorage } from "@/composables/useLocalStorage";
import { useProductStore } from "@/stores/ProductStore";

const useCartStore = defineStore("cart", () => {

    // state
    const items = useLocalStorage('cart', []);

    // getters
    const totalItems = computed(() => 
        items.value.reduce((sum, item) => sum + item.qty, 0)
    );

    const totalPrice = computed(() =>
        items.value.reduce((sum, item) => sum + (item.price * item.qty), 0)
    );

    // actions
    function addToCart(product) {
        const productStore = useProductStore();
        const existing = items.value.find(item => item.id == product.id);
        if (existing) {
            existing.qty += 1;
        } else {
            items.value.push({ ...product, qty: 1 });
        }
        productStore.decreaseStock(product.id);
    }

    function removeFromCart(id) {
        items.value = items.value.filter(item => item.id != id);
    }

    function clearCart() {
        items.value = [];
    }

    return {
        items,
        totalItems,
        totalPrice,
        addToCart,
        removeFromCart,
        clearCart
    }
});

export { useCartStore };