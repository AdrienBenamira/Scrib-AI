export const workers = (state = {
    number: 1,
    workers: []
}, action) => {
    switch (action.type) {
        case 'SET_NUMBER_WORKERS':
            state = {...state, number: action.payload};
            break;
        case 'ADD_WORKER':
            state = {...state, number: state.number + 1};
            break;
        case 'REMOVE_WORKER':
            state = {...state, number: state.number - 1};
            break;
        case 'SET_WORKERS':
            state = {...state, workers: action.payload};
            break;
        default:
            state = {...state};
            break;
    }
    return state;
};
