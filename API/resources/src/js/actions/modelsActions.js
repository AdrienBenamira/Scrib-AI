
export const fetchModels = () => {
    return {
        type: 'FETCHING_MODELS'
    };
};

export const modelsFetched = (result) => {
    return {
        type: 'MODELS_FETCHED',
        payload: result
    };
};

export const fetchingFailed = (err) => {
    return {
        type: 'FETCHING_FAILED',
        payload: err
    };
};

export const fetchActions = () => {
    return {
        type: 'FETCHING_ACTIONS'
    }
};

export const actionsFetched = (data) => {
    return {
        type: 'ACTIONS_FETCHED',
        payload: data
    }
};

export const fetchActionsFailed = (err) => {
    return {
        type: 'FETCH_ACTIONS_FAILED',
        payload: err
    }
};

export const changeCurrentModel = (modelId) => {
    return {
        type: 'CHANGE_CURRENT_MODEL',
        payload: modelId
    }
};

export const metricsFetched = (metrics) => {
    return {
        type: 'METRICS_FETCHED',
        payload: metrics
    };
};

export const addMetric = (metric) => {
    return {
        type: 'ADD_METRIC',
        payload: metric
    };
};

export const updateMetrics = (metrics) => {
    return {
        type: 'UPDATE_METRICS',
        payload: metrics
    };
};

