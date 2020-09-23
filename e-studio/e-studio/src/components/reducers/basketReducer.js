import { ADD_PRODUCT_BASKET, GET_PRODUCT_BASKET , REMOVE_PRODUCT_BASKET, CHANGE_BASKET_COST, CLEAR_BASKET} from '../actions/types';
import SecureLS from 'secure-ls';

var ls = new SecureLS({encodingType: 'rc4'});
let keys = ls.getAllKeys();
// ls.set('cart', {test : "test"})
console.log(keys);

var result = keys.includes("cart");
console.log(result)
const initialState = result ? ls.get('cart') : 
{
    basketNumbers : 0,
    cartCost: 0,
    products: [],
}


const basketReducer = (state = initialState, action) => {
    // console.log(action)
    switch(action.type){
        case ADD_PRODUCT_BASKET :
            let newproducts = state.products;
            let newcartCost = state.cartCost;
            let previousid = 0;
            state.products.map( e => {
                if( e.id > previousid){
                    previousid = e.id;
                }
            })
            action.payload.id = previousid + 1;
            newproducts.push(action.payload);
            newcartCost += (action.payload.nbrhour * action.payload.prix) + action.payload.prixservices;
            console.log(newproducts)
            let newstate = {
                basketNumbers : state.basketNumbers + 1,
                products : newproducts,
                cartCost : newcartCost,
            };
            ls.set('cart', newstate);
            // localStorage.setItem('cart', JSON.stringify(newstate));
            return {
                basketNumbers : state.basketNumbers + 1,
                products : newproducts,
                cartCost : newcartCost,
            }
        case REMOVE_PRODUCT_BASKET:
            for(let x in state.products){
                let e = state.products;
                if( e[x].id == action.payload){
                    let newcartCost = state.cartCost;
                    newcartCost -= ((e[x].nbrhour * e[x].prix) + e[x].prixservices);
                    e.splice(x, 1);
                    let newstate = {
                        basketNumbers : state.basketNumbers - 1,
                        products : e,
                        cartCost : newcartCost,
                    };
                    ls.set('cart', newstate);
                    // localStorage.setItem('cart', JSON.stringify(newstate));
                    return {
                        basketNumbers : state.basketNumbers - 1,
                        products : e,
                        cartCost : newcartCost,
                    }
                }
                
            }
        
        case GET_PRODUCT_BASKET :
            return {
                ...state,
            }

        case CHANGE_BASKET_COST :
            console.log(action.payload);
            
            let nt = {
                basketNumbers : state.basketNumbers ,
                products : state.products,
                cartCost : action.payload,
            };
            ls.set('cart', nt);

            // localStorage.setItem('cart', JSON.stringify(nt));
            return {

                basketNumbers : state.basketNumbers ,
                products : state.products,              
                cartCost : action.payload,
            }
        case CLEAR_BASKET :

            let t = {
                basketNumbers : 0,
                cartCost: 0,
                products: [],
            }
            ls.set('cart', t);
            // localStorage.setItem('cart', JSON.stringify(t));
            return {
                basketNumbers : 0,
                cartCost: 0,
                products: [],
            }
        
        

    
    }
    return state
}

export default basketReducer;
