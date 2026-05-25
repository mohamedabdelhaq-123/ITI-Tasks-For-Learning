import { ref } from 'vue';

function useApi(url='http://localhost:4000/products/'){

    const data = ref(null);
    const error = ref(null);
    const loading = ref(false);

    async function getAll(){
        try{
            loading.value=true;
            error.value=null;
            const res = await fetch(url);
            if(!res.ok) throw new Error(`status ${res.status}`);

            data.value = await res.json();
            console.log(data);
        }
        catch(err){
            error.value=err.message;
            console.log(err);   
        }
        finally{
            loading.value=false;
        }
    }

    async function getOneProduct(id){
        try{
            error.value=null;
            loading.value=true;
            const res = await fetch(url+id);
            if(!res.ok) throw new Error(`status ${res.status}`);

            data.value = await res.json();
            console.log(data);
        }
        catch(err){
            error.value=err.message;
            console.log(err);   
        }
        finally{
            loading.value=false;
        }
    }

    async function updateProduct(id, updatedData){
        try{
            error.value=null;
            loading.value=true;
            const res = await fetch(url+id, {
                method:'PUT',
                headers:{'Content-Type':'application/json'},
                body: JSON.stringify(updatedData)
            });
            if(!res.ok) throw new Error(`status ${res.status}`);

            // data.value = await res.json();
            console.log(data);
        }
        catch(err){
            error.value=err.message;
            console.log(err);   
        }
        finally{
            loading.value=false;
        }
    }

  return {data,loading,error, getAll, getOneProduct, updateProduct};
}


export {useApi};












// what is composable? func. for encapsulating and reusability of logic (ref, computed, watch , lifecycle,..)
// before in option api was mixins -> name conflicts, bad debugging
// when composition api -> composables
// when import in multiple components you make separated instances no shared data just shared logic
// best practices for composables:
// 1- start with use (useApi, useAuth, useProducts)
// 2- return only what is needed (state, funcs, computed) to avoid tight coupling and make it more reusable
// 3- can use other composables inside it (ex: useFetch inside useApi)
// 4- can be used in setup of components or even in stores (pinia) for better logic grouping and reusability