
export const connectUser = (values) => {
    return {
        type: 'CONNECT_USER',
        payload: values
    };
};

export const userConnected = () => {
    return {
        type: 'CONNECTION_FULFILLED'
    };
};

//TODO: user Actions