import { LOGGED_IN, LOGGED_OUT, GET_STATE } from '../actions/types';
import SecureLS from 'secure-ls';

// new SecureStorage()
var ls = new SecureLS({encodingType: 'rc4'});
var ls = new SecureLS({encodingType: 'rc4'});
let keys = ls.getAllKeys();
// ls.set('cart', {test : "test"})
console.log(keys);

var result = keys.includes("log");
console.log(result)
const initialState = result ? ls.get('log') :
{
    id : null,
    nom: null,
    email: null,
    prenom: null,
    role : null,
    token: null,
    loggedin : false,
}


const authReducer = (state = initialState, action) => {
    // console.log(action)
    switch(action.type){
        case LOGGED_IN :
            console.log(action.payload);
            let newstate = {
                id : action.payload.id,
                email : action.payload.email ,
                nom : action.payload.nom ,
                prenom : action.payload.prenom ,
                token : action.payload.token ,
                role : action.payload.role ,
                loggedin : true,
            }
            ls.set('log',newstate);
            // localStorage.setItem('log', JSON.stringify(newstate));
            return {
                id : action.payload.id,
                email : action.payload.email ,
                nom : action.payload.nom ,
                prenom : action.payload.prenom ,
                token : action.payload.token ,
                role : action.payload.role ,
                loggedin : true,
            }
        case LOGGED_OUT:
            ls.remove('log');
            // localStorage.removeItem('log');
            return {
                id : null,
                nom: null,
                email: null,
                prenom: null,
                role : null,
                token: null,
                loggedin : false,
            }
        
        case GET_STATE :
            console.log(state);
            return {
                ...state,
            }
        
    }
    return state
}

export default authReducer;

