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
    notRecommended:       1,
    recommended:          2,
    countReviews:         2,
    npsRating:            40,
    rating:               8.2,
    comfortRating:        9.2,
    repairDurationRating: 7.4,
    repairQualityRating:  7.6,
    serviceQualityRating: 8.4,
    reviews:              [
        {
            anonymous:      true,
            clientFullname: null,
            clientPhone:    null,
            comfort:        3,
            complaint:      false,
            datetime:       '2018-08-30 16:19:05.559585',
            id:             6097,
            nps:            8,
            orderId:        null,
            orderNum:       null,
            photo:          null,
            recommended:    false,
            repairDuration: 2,
            repairQuality:  10,
            serviceQuality: 6,
            text:           'Расслабились',
            userId:         null,
            userVehicle:    null,
            viewDatetime:   '2018-08-30 16:20:56.378908',
            visitDate:      null,
        },
        {
            anonymous:      false,
            clientFullname: 'Вова Храпунов',
            clientPhone:    null,
            comfort:        10,
            complaint:      false,
            datetime:       '2018-01-28 20:18:33.910591',
            id:             6080,
            nps:            10,
            orderId:        96792,
            orderNum:       'MRD-1174-96792',
            photo:          null,
            recommended:    true,
            repairDuration: 10,
            repairQuality:  10,
            serviceQuality: 10,
            text:           null,
            userId:         36638,
            userVehicle:    'KIA RIO III  (2013)',
            viewDatetime:   '2018-02-12 13:37:08.709026',
            visitDate:      '2018-01-26 00:00:00',
        },
        {
            anonymous:      false,
            clientFullname: 'Толик',
            clientPhone:    '(050) 313-22-92',
            comfort:        7,
            complaint:      true,
            datetime:       '2015-11-25 18:25:12.448919',
            id:             77,
            nps:            7,
            orderId:        null,
            orderNum:       null,
            photo:          null,
            recommended:    null,
            repairDuration: 7,
            repairQuality:  8,
            serviceQuality: 8,
            text:
                'Рассчитывал на более дешевы чек.А в остальном работой доволен.',
            userId:       null,
            userVehicle:  'Honda',
            viewDatetime: '2015-11-25 18:31:06.501562',
            visitDate:    '2015-11-23 00:00:00',
        },
    ],
    filter: {
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
