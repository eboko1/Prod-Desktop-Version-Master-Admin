//
// Constants
//
export const moduleName = 'errorMessage';
const prefix = `cpb/${moduleName}`;

export const SET_ERROR_MESSAGE = `${prefix}/SET_ERROR_MESSAGE`;
export const RESET_ERROR_MESSAGE = `${prefix}/RESET_ERROR_MESSAGE`;

//
// Reducer
//
const ReducerState = {
    errorType:   '',
    errorEntity: {},
};

export default function popupsReducer(state = ReducerState, action) {
    const { type, payload } = action;

    switch (type) {
        case SET_ERROR_MESSAGE:
            return {
                ...state,
                errorType: payload.response
                    ? payload.response.message
                    : payload.message,
                errorEntity: payload.response
                    ? {
                        status:  payload.response.statusCode,
                        message: payload.response.message,
                    }
                    : {
                        status:  payload.status,
                        message: payload.message,
                    },
            };

        case RESET_ERROR_MESSAGE:
            return ReducerState;

        default:
            return state;
    }
}

/**
 * Selectors
 * */

export const stateSelector = state => state[ moduleName ];

export const selectErrorType = state => state[ moduleName ].errorType;
export const selectErrorEntity = state => state[ moduleName ].errorEntity;

//
// Action Creators
//
export const setErrorMessage = error => ({
    type:    SET_ERROR_MESSAGE,
    payload: error,
    error:   true,
});

export const resetErrorMessage = () => ({
    type: RESET_ERROR_MESSAGE,
});
