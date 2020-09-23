import { REMOVE_PRODUCT_BASKET , LOGGED_OUT, CLEAR_BASKET} from './types';

export const removeOneBasket = (id) => {
    return (dispatch) => {
        console.log(`removing ${id} from basket`);
        dispatch({
            type : REMOVE_PRODUCT_BASKET,
            payload : id,
        })
    }
}

export const clearBasket = () => {
    return (dispatch) => {
        console.log(`clearing basket`);
        dispatch({
            type : CLEAR_BASKET,
        })
    }
}


export const logout = () => {
    return (dispatch) => {
        console.log(`Login out`);
        dispatch({
            type : LOGGED_OUT,
        })
    }
}
