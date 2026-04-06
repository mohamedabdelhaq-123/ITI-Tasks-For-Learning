import { createSlice } from '@reduxjs/toolkit'

// const [items,setItems] = useState([]);
// const [totalPrice,setTotalPrice] = useState();
// => managed by redux in initialstate

const cartSlice =createSlice({
    name: "cart",
    initialState: {
        items:[], totalPrice:0
    },
    reducers: {
        addItem(currentState,action){
            
            const existingItem = currentState.items.find(item => item.id === action.payload.id);

            if (existingItem) 
            existingItem.quantity += 1;
            else 
            currentState.items.push({...action.payload,quantity:1}); // immer
            currentState.totalPrice+=action.payload.price;

        },
        removeItem(currentState,action){
            currentState.items=currentState.items.filter((item)=> item.id !==action.payload.id);
            currentState.totalPrice-=(action.payload.price)*(action.payload.quantity);
        },
        increment(currentState,action){
           currentState.items=currentState.items.map((item)=> {
                if(item.id === action.payload.id && item.quantity<action.payload.stock){
                    item.quantity+=1;
                    currentState.totalPrice+=action.payload.price;
                    return item;
                }
                else return item;
            })

        },
        decrement(currentState,action){
            if(action.payload.quantity===1){
                currentState.items=currentState.items.filter((item)=> item.id !==action.payload.id);
            }
            else{
                currentState.items=currentState.items.map((item)=> {
                if(item.id === action.payload.id && item.quantity!==0){
                    item.quantity-=1;
                    currentState.totalPrice-=action.payload.price;
                    return item;
                }
                else return item;
            })
            }
        },
        clearCart(currentState){ // it need no action (no payload just reset)
            currentState.items=[];
            currentState.totalPrice=0;

        }
    } 
})

export default cartSlice.reducer
export const {clearCart,addItem,removeItem,increment,decrement} = cartSlice.actions;
// export actions for children 
// export reducers for store

// action contains the data 
// currentState is the current state
// both passed as args by react 
// action.payload => {id:1,title:"shoe",price:45,,....}