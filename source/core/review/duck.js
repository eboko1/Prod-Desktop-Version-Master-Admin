/**
 * Constants
 * */
export const moduleName = 'review';
const prefix = `cpb/${moduleName}`;

export const FETCH_REVIEW = `${prefix}/FETCH_REVIEW`;
export const FETCH_REVIEW_SUCCESS = `${prefix}/FETCH_REVIEW_SUCCESS`;

/**
 * Reducer
 * */

const ReducerState = {
    review: {},
};

export default function reducer(state = ReducerState, action) {
    const { type, payload } = action;

    switch (type) {
        case FETCH_REVIEW_SUCCESS:
            return {
                ...state,
                review: payload,
            };

        default:
            return state;
    }
}

export const fetchReview = id => ({
    type:    FETCH_REVIEW,
    payload: { id },
});

export const fetchReviewSuccess = review => ({
    type:    FETCH_REVIEW_SUCCESS,
    payload: review,
});
