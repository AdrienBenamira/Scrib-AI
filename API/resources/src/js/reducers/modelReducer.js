export const models = (state = {
    fetching: false,
    fetched: false,
    failed: false,
    models: [],
    errorMessage: null,
    actions: {
        fetching: false,
        fetched: false,
        actions: [],
        failed: false,
        errorMessage: null
    }
}, action) => {
    switch (action.type) {
        case 'FETCHING_MODELS':
            state = { ...state, fetching: true, failed: false, errorMessage: null };
            break;
        case 'MODELS_FETCHED':
            state = { ...state, fetching: false, fetched: true, models: action.payload };
            break;
        case 'FETCHING_FAILED':
            state = { ...state, fetching: false, fetched: false, failed: true, errorMessage: action.payload };
            break;
        case 'FETCHING_ACTIONS':
            state = { ...state, actions: { ...state.actions, actions: [], fetching: true, failed: false, errorMessage: null } };
            break;
        case 'ACTIONS_FETCHED':
            state = {
                ...state,
                actions: { ...state.actions, fetching: false, fetched: true, actions: action.payload }
            };
            break;
        case 'FETCH_ACTIONS_FAILED':
            state = {
                ...state,
                actions: {
                    ...state.actions,
                    fetching: false,
                    fetched: false,
                    failed: true,
                    errorMessage: action.payload
                }
            };
            break;
        default:
            state = { ...state };
            break;
    }

    return state;
};
