export const stats = (state = {
    fetching: false,
    failed: false,
    errorMessage: null,
    options: {
        grade: null,
        isIncorrect: null,
        date: null,
        id: null,
        articleId: null,
        fullText: null,
        isGenerated: null,
    },
    results: []
}, action) => {
    switch (action.type) {
        case 'OPTIONS_UPDATED':
            state = {...state, options: action.payload};
            break;
        case 'FETCHING_RESULTS':
            state = {...state, fetching: true, failed: false, errorMessage: null};
            break;
        case 'RESULTS_FETCHED':
            state = {...state, fetching: false, results: action.payload};
            break;
        case 'FETCHING_FAILED':
            state = {...state, fetching: false, failed: true, errorMessage: action.payload};
            break;
        default:
            state = {...state};
            break;
    }

    return state;
};
