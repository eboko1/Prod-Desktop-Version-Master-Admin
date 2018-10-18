/**
 * Constants
 * */
export const moduleName = 'reviews';
const prefix = `cpb/${moduleName}`;

export const FETCH_REVIEWS = `${prefix}/FETCH_REVIEWS`;
export const FETCH_REVIEWS_SUCCESS = `${prefix}/FETCH_REVIEWS_SUCCESS`;
export const SET_REVIEWS_PAGE_FILTER = `${prefix}/SET_REVIEWS_PAGE_FILTER`;

/**
 * Reducer
 * */

const ReducerState = {
    stats: {
        notRecommended:       null,
        recommended:          null,
        total:                null,
        npsRating:            null,
        totalRating:          null,
        comfortRating:        null,
        repairDurationRating: null,
        repairQualityRating:  null,
        serviceQualityRating: null,
    },
    reviews: [],
    filter:  {
        page: 1,
    },
};

export default function reducer(state = ReducerState, action) {
    const { type, payload } = action;

    switch (type) {
        case FETCH_REVIEWS_SUCCESS:
            return {
                ...state,
                ...payload,
            };

        case SET_REVIEWS_PAGE_FILTER:
            return {
                ...state,
                filter: {
                    page: payload,
                },
            };

        default:
            return state;
    }
}

/**
 * Selectors
 * */

export const stateSelector = state => state[ moduleName ];
export const selectReviewsFilter = state => state.reviews.filter;

/**
 * Actions
 * */

export const fetchReviews = filter => ({
    type:    FETCH_REVIEWS,
    payload: filter,
});

export const fetchReviewsSuccess = data => ({
    type:    FETCH_REVIEWS_SUCCESS,
    payload: data,
});

export const setReviewsPageFilter = page => ({
    type:    SET_REVIEWS_PAGE_FILTER,
    payload: page,
});
