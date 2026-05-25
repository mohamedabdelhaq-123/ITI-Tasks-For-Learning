import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { useApi } from "@/composables/useApi";

const useProductStore = defineStore("products",()=>{ // id must be unique+ used by pinia to connect store to devtools

    const {data, loading, error, getAll, getOneProduct, updateProduct} = useApi(); // use composable to get API data

    // state-> refs
    const products = ref([]); // reactive data for ex: products:[]

    // getters -> computed
    const getProductById = computed(() => {
        return (id) =>{
        return products.value.find(p=>p.id==id);
        }
    });


    // actions-> funcs
    async function fetchProducts(){   
        await getAll(); // call API func to fetch products
        products.value = data.value; // update products ref with API data
    }

    async function decreaseStock(id){
        const product = products.value.find(p=>p.id==id);
        if(product && product.stock>0){
            const updatedProduct = {...product, stock: product.stock-1};
            await updateProduct(id, updatedProduct);
            // products.value= data.value;
        }
    }


    return {
        // state -> no priv vals.
        products,
        loading,
        error,
        // getters
        getProductById,
        // actions
        fetchProducts,
        decreaseStock
    }

})













export {useProductStore}; // best practice naming



// State manangement store for products (in react-> redux, angular-> ngrx, vue-> pinia)
// state managemt is way to manage state in centralized way/be global (better for testing, availablity, decrease proop drilling )
// Main part in state manag. is the store (Pinia) and 3 main concepts (state, getters, actions) approx. = state,computed, methods in components
// state-> reactive data for ex: products:[]
// getters-> computed properties auto. changes when state changes for ex: getProductsCount(){ return this.products.length}
// actions-> CRUD on state & API for ex: addProduct(product){ this.products.push(product)}
// can work with Option api (traditional) or composition api (modern vue3)

// Options api-> fixed config.(separation of concerns) (state:.., getters:.., actions:..), use this keyword to acess the 3
// compostion api->  flexible (logic can be grouped by feature), eliminate this, good for large proj., 
// setup stores (compositon way )-> good for using composables & can use glob. prop like $route, inject.,,,


// VIP when using store in components to use storeToRefs
// when we make dest. {products} = productStore, 
// products will be [] or snapshot (normal JS destructring), not using reactive ref
// vue knows the changes in store by using proxy and dest. break the link btw it and dest. state
// so better to use storeToRefs with states and getters , but actions are already funcs
// wrapps around states and getters and make own reactive ref
// so return new obj each property in it is reactive and still linked to store proxy
