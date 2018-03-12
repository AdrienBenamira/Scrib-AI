export const user = (state = {
    username: '',
    password: '',
    failed: false,
    connecting: true,
    connected: false,
    signup: {
        signingup: false,
        done: false,
        failed: false,
        errorMessage: ''
    }
}, action) => {
    switch (action.type) {
        case 'CONNECT_USER':
            state = {...state, failed: false, connecting: true};
            break;
        case 'CONNECTION_FULFILLED':
            state = {
                ...state,
                connecting: false,
                failed: false,
                connected: true,
                username: action.payload.username,
                password: action.payload.password
            };
            break;
        case 'CONNECTION_FAILED':
            state = {...state, connecting: false, failed: true};
            break;
        case 'LOGOUT':
            state = {...state, connected: false, connecting:false, username: '', password: ''};
            break;
        case 'ADD_USER':
            state = {...state, signup: {...state.signup, signingup: true, failed: false, done: false}};
            break;
        case 'SIGNUP_FAILED':
            state = {...state, signup: {...state.signup, signingup: false, failed: true, errorMessage: action.payload}};
            break;
        case 'USER_ADDED':
            state = {...state, signup: {...state.signup, signingup: false, done: true}};
            break;
        default:
            state = {...state};
            break;
    }

    return state;
};