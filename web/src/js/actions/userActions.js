
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

