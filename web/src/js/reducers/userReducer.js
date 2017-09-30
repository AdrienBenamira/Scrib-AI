export const user = (state = {
    username: '',
    password: '',
    failed: false,
    connecting: false,
    connected: false
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
        default:
            state = {...state};
            break;
    }

    return state;
};