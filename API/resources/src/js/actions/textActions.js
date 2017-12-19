export const updateArticle = (content) => {
    return {
        type: 'ARTICLE_UPDATED',
        payload: content
    };
};

export const summarize = (summary) => {
    return {
        type: 'SUMMARIZATION_STARTED',
        payload: summary
    };
};

export const changeModel = (model) => {
    return {
        type: 'CHANGE_MODEL',
        payload: model
    };
};

export const summarize_site = (origin) => {
    return {
        type: 'START_SUMMARIZATION_FROM_URL',
        payload: origin
    };
};

export const summarizationFailed = (message) => {
    return {
        type: 'SUMMARIZATION_FAILED',
        payload: message
    };
};

export const summarizationFullfiled = (response) => {
    return {
        type: 'SUMMARIZATION_FULFILED',
        payload: response
    };
};

export const summarizationFullfiledFromURL = (response) => {
    return {
        type: 'SUMMARIZATION_FULFILED_FROM_URL',
        payload: response
    };
};

export const gradeSummary = (grade) => {
    return {
        type: 'GRADE_SUMMARY',
        payload: grade
    };
};


export const changeRatio = (ratio) => {
    return {
        type: 'CHANGE_RATIO',
        payload: ratio
    };
};

export const refuseSummary = () => {
    return {
        type: 'REFUSE_SUMMARY'
    };
};

export const updateUserVersion = (content) => {
    return {
        type: 'UPDATE_USER_VERSION',
        payload: content
    };
};

export const editSummary = () => {
    return {
        type: 'EDIT_SUMMARY'
    };
};

export const startUpload = () => {
    return {
        type: 'SUMARRY_UPLOADING'
    };
};

export const uploadFulfilled = () => {
    return {
        type: 'SUMMARY_UPLOADED'
    };
};

export const uploadFailed = (message) => {
    return {
        type: 'SUMMARY_UPLOAD_FAILED',
        payload: message
    };
};
