export const text = (state = {
    fullText: '',
    summary: {
        content: '',
        quality: 0,
        isAccepted: null
    }
}, action) => {
    switch (action.type) {
        case 'TEXT_UPLOADED':
            //TODO
            break;
        case 'TEXT_TREATED':
            //TODO
            break;
        case 'TEXT_ERROR':
            //TODO
            break;
        case 'ACCEPT_SUMMARY':
            //TODO
            break;
        case 'GRADE_SUMMARY':
            //TODO
            break;
        default:
            //TODO
            break;
    }

    return {...state};
};
