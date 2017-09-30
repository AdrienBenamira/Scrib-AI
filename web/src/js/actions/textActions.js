export const summarize = () => {
    return {
        type: 'SUMMARIZATION_STARTED'
    };
};

export const summarizationFailed = (message) => {
    return {
        type: 'SUMMARIZATION_FAILED',
        payload: message
    };
};

export const summarizationFullfiled = (summary) => {
    return {
        type: 'SUMMARIZATION_FULFILED',
        payload: summary
    };
};
