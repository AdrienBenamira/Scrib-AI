export const models = (state = {
    fetching: false,
    fetched: false,
    failed: false,
    models: [],
    metrics: [],
    errorMessage: null,
    currentModelId: null,
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
        case 'CHANGE_CURRENT_MODEL':
            state = {
                ...state,
                currentModelId: state.models.map(model => model.id).indexOf(action.payload)
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
        case 'METRICS_FETCHED':
            state = {
                ...state, metrics: action.payload
            };
            break;
        case 'ADD_METRIC':
            state.metrics = [...state.metrics, {name: action.payload.name, order: state.metrics.length}];
            break;
        case 'UPDATE_METRICS':
            state.metrics = action.payload;
            break;
        default:
            state = { ...state };
            break;
    }

    return state;
};
