export const text = (state = {
    fullText: '',
    errorMessage: '',
    failed: false,
    summarizing: false,
    summarized: false,
    summary: {
        content: null,
        userVersion: null,
        quality: 0,
        isAccepted: null
    }
}, action) => {
    switch (action.type) {
        case 'SUMMARIZATION_STARTED':
            state = {...state, fullText: action.payload, summarized: false, summarizing: true, summary: {
                content: null,
                quality: 0,
                isAccepted: false
            }};
            break;
        case 'SUMMARIZATION_FULFILED':
            state = {...state, summary: {
                content: action.payload,
                quality: 0,
                isAccepted: null
            }, summarizing: false, failed: false, errorMessage: '', summarized: true};
            break;
        case 'SUMMARIZATION_FAILED':
            state = {...state, failed: true, errorMessage: action.payload, summarizing: false};
            break;
        case 'ACCEPT_SUMMARY':
            //TODO
            state = {...state};
            break;
        case 'GRADE_SUMMARY':
            //TODO
            state = {...state};
            break;
        default:
            //TODO
            state = {...state};
            break;
    }

    return state;
};
