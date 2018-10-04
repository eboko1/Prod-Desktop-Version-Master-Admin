/**
 * Constants
 * */
export const moduleName = 'reviews';
const prefix = `cpb/${moduleName}`;

export const FETCH_REVIEWS = `${prefix}/FETCH_REVIEWS`;
export const FETCH_REVIEWS_SUCCESS = `${prefix}/FETCH_REVIEWS_SUCCESS`;
export const SET_REVIEWS_SORT = `${prefix}/SET_REVIEWS_SORT`;

/**
 * Reducer
 * */

const ReducerState = {
    reviews: {},
    filter:  {},
    sort:    { page: 1, order: 'asc' },
};

export default function reducer(state = ReducerState, action) {
    const { type, payload } = action;

    switch (type) {
        case FETCH_REVIEWS_SUCCESS:
            return {
                ...state,
                review: payload,
            };

        case SET_REVIEWS_SORT:
            return {
                ...state,
                sort: {
                    ...state.sort,
                    ...payload,
                },
            };

        default:
            return state;
    }
}

export const fetchReviews = filter => ({
    type:    FETCH_REVIEWS,
    payload: filter,
});

export const fetchReviewsSuccess = data => ({
    type:    FETCH_REVIEWS_SUCCESS,
    payload: data,
});

export const setReviewsSort = sort => ({
    type:    SET_REVIEWS_SORT,
    payload: sort,
});
