import { ADD_PRODUCT_BASKET , LOGGED_IN} from './types';
import { array } from 'prop-types';

export const addBasket = (productName) => {
    return (dispatch) => {
        console.log('adding to basket');
        console.log('Product : ', productName);

        dispatch({
            type : ADD_PRODUCT_BASKET,
            payload : productName,
        })
    }
}


export const login = (info) => {
    return (dispatch) => {
        console.log('loggin in');

        dispatch({
            type : LOGGED_IN,
            payload : info,
        })
    }
}