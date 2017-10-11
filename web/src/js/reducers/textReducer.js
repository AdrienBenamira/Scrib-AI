export const text = (state = {
    fullText: '',
    origin: '',
    errorMessage: '',
    failed: false,
    ratio: 0.4,
    summarizing: false,
    summarized: false,
    summary: {
        content: null,
        chrono: null,
        title: '',
        userVersion: 'Loading',
        hasUserEdited: false,
        grade: 0,
        isAccepted: true
    },
    upload: {
        uploading: false,
        done: false,
        failed: false,
        errorMessage: ''
    }
}, action) => {
    switch (action.type) {
        case 'ARTICLE_UPDATED':
            state = { ...state, fullText: action.payload };
            break;
        case 'SUMMARIZATION_STARTED':
            state = {
                ...state, upload: {
                    uploading: false,
                    done: false,
                    failed: false,
                    errorMessage: ''
                }, fullText: action.payload, summarized: false, summarizing: true, summary: {
                    content: null,
                    chrono: null,
                    grade: 0,
                    isAccepted: false
                }
            };
            break;
        case 'START_SUMMARIZATION_FROM_URL':
            state = {
                ...state, upload: {
                    uploading: false,
                    done: false,
                    failed: false,
                    errorMessage: ''
                }, fullText: '',
                origin: action.payload,
                summarized: false, summarizing: true, summary: {
                    content: null,
                    chrono: null,
                    grade: 0,
                    isAccepted: false
                }
            };
            break;
        case 'SUMMARIZATION_FULFILLED_FROM_URL':
            state = {
                ...state,
                summary: {
                    content: action.payload.summary,
                    userVersion: 'Loading...',
                    hasUserEdited: false,
                    chrono: action.payload.chrono,
                    grade: 0,
                    isAccepted: null
                },
                fullText: action.payload.fullText,
                summarizing: false,
                failed: false,
                errorMessage: '',
                summarized: true
            };
            break;
        case 'SUMMARIZATION_FULFILED':
            state = {
                ...state, summary: {
                    content: action.payload.summary,
                    userVersion: 'Loading...',
                    hasUserEdited: false,
                    chrono: action.payload.chrono,
                    grade: 0,
                    isAccepted: null
                }, summarizing: false, failed: false, errorMessage: '', summarized: true
            };
            break;
        case 'SUMMARIZATION_FAILED':
            state = { ...state, failed: true, errorMessage: action.payload, summarizing: false, summarized: false };
            break;
        case 'REFUSE_SUMMARY':
            state = { ...state, summary: { ...state.summary, isAccepted: false, grade: 0 } };
            break;
        case 'GRADE_SUMMARY':
            state = { ...state, summary: { ...state.summary, isAccepted: true, grade: action.payload } };
            break;
        case 'EDIT_SUMMARY':
            state = { ...state, summary: { ...state.summary, userVersion: state.summary.content } };
            break;
        case 'UPDATE_USER_VERSION':
            state = { ...state, summary: { ...state.summary, hasUserEdited: true, userVersion: action.payload } };
            break;
        case 'SUMMARY_UPLOADED':
            state = { ...state, upload: { ...state.upload, done: true, uploading: false } };
            break;
        case 'SUMMARY_UPLOAD_FAILED':
            state = {
                ...state,
                upload: { ...state.upload, failed: true, errorMessage: action.payload, uploading: false }
            };
            break;
        case 'SUMARRY_UPLOADING':
            state = { ...state, upload: { ...state.upload, uploading: true, failed: false, errorMessage: '' } };
            break;
        case 'CHANGE_RATIO':
            state = { ...state, ratio: action.payload };
            break;

        default:
            state = { ...state };
            break;
    }

    return state;
};
