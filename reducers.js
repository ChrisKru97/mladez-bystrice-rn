import {combineReducers} from 'redux';

const initialState = {
    logged: false,
    username: '',
    token: '',
};

const loginReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_TOKEN':
            return {...state, token: action.payload}
        case 'SET_USERNAME':
            return {...state, username: action.payload}
        case 'LOGIN':
            return {...state, logged: true}
        case 'LOGOUT':
            return initialState
        default:
            return state
    }
}

export default combineReducers({
    login: loginReducer,
});