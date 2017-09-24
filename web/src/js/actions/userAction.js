
export const connectUser = (username) => {
    return {
        type: 'CONNECT_USER',
        payload: username
    };
};

//TODO: user Actions