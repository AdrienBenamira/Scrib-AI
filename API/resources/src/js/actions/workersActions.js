export const setNumberWorkers = (number) => {
    return {
        type: 'SET_NUMBER_WORKERS',
        payload: number
    };
};

export const addWorker = () => {
    return {
        type: 'ADD_WORKER'
    };
};

export const removeWorker = () => {
    return {
        type: 'REMOVE_WORKER'
    };
};

export const setWorkers = (workers) => {
    return {
        type: 'SET_WORKERS',
        payload: workers
    };
};