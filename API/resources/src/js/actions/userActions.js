
export const connectUser = () => {
    return {
        type: 'CONNECT_USER',
    };
};

export const userConnected = (values) => {
    return {
        type: 'CONNECTION_FULFILLED',
        payload: values
    };
};

export const connectionFailed = () => {
    return {
        type: 'CONNECTION_FAILED'
    };
};

export const logout = () => {
    return {
        type: 'LOGOUT'
    };
};

export const addUser = () => {
    return {
        type: 'ADD_USER'
    };
};

export const signupFailed = (message) => {
    return {
        type: 'SIGNUP_FAILED',
        payload: message
    };
};

export const userAdded = () => {
    return {
        type: 'USER_ADDED'
    };
};
