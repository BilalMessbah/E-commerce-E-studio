import { GET_PRODUCT_BASKET, CHANGE_BASKET_COST, GET_STATE} from './types';


export const getBasket = () => {
    return (dispatch) => {
        console.log('getting to basket');
        dispatch({
            type : GET_PRODUCT_BASKET,
        })
    }
}

export const getLogin = () => {
    return (dispatch) => {
        console.log('checking login');
        dispatch({
            type : GET_STATE,
        })
    }
}

export const changeBasketCost = (newTotal) => {
    return (dispatch) => {
        console.log('getting to basket');
        dispatch({
            type : CHANGE_BASKET_COST,
            payload : newTotal,
        })
    }
}
