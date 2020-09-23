import authReducer from './authReducer'
import basketReducer from './basketReducer'
import { combineReducers } from 'redux'

const rootReducer = combineReducers({
    auth: authReducer,
    basketState: basketReducer
})

export default rootReducer