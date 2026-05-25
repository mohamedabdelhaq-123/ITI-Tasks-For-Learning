// desired to save cart iteams in local storage
// when start look at local storage with cetrain key for ex: mycart
// else use default


import { ref, watch } from "vue";

function useLocalStorage(key, value){ // give key and val and put them in local storage

    const storedVal= ref(value); // reactive ref.
    const existingVal= localStorage.getItem(key);
    if(existingVal!==null)
        storedVal.value=JSON.parse(existingVal);
    else 
        localStorage.setItem(key,JSON.stringify(value));

    watch(storedVal, // watch ref. if their any change make this callback
        ()=>{
        localStorage.setItem(key,JSON.stringify(storedVal.value));
    }, 
    {deep:true} // if the value was object so if modified in it not its ref. the reactivity won't work, so WATCH DEEPly
    );

    return storedVal; // ret. ref. so the component using it can read or write reactively
};


export {useLocalStorage};