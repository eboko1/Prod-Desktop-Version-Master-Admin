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
    reviews: [
        {
            anonymous:       true,
            client_fullname: null,
            client_phone:    null,
            comfort:         3,
            complaint:       false,
            datetime:        '2018-08-30 16:19:05.559585',
            id:              6097,
            nps:             8,
            order_id:        null,
            order_num:       null,
            photo:           null,
            recommended:     false,
            repair_duration: 2,
            repair_quality:  10,
            service_quality: 6,
            text:            'Расслабились',
            user_id:         null,
            user_vehicle:    null,
            view_datetime:   '2018-08-30 16:20:56.378908',
            visit_date:      null,
        },
        {
            anonymous:       false,
            client_fullname: 'Вова Храпунов',
            client_phone:    null,
            comfort:         10,
            complaint:       false,
            datetime:        '2018-01-28 20:18:33.910591',
            id:              6080,
            nps:             10,
            order_id:        96792,
            order_num:       'MRD-1174-96792',
            photo:           null,
            recommended:     true,
            repair_duration: 10,
            repair_quality:  10,
            service_quality: 10,
            text:            null,
            user_id:         36638,
            user_vehicle:    'KIA RIO III  (2013)',
            view_datetime:   '2018-02-12 13:37:08.709026',
            visit_date:      '2018-01-26 00:00:00',
        },
        {
            anonymous:       false,
            client_fullname: 'Толик',
            client_phone:    '(050) 313-22-92',
            comfort:         7,
            complaint:       true,
            datetime:        '2015-11-25 18:25:12.448919',
            id:              77,
            nps:             7,
            order_id:        null,
            order_num:       null,
            photo:           null,
            recommended:     null,
            repair_duration: 7,
            repair_quality:  8,
            service_quality: 8,
            text:
                'Рассчитывал на более дешевы чек.А в остальном работой доволен.',
            user_id:       null,
            user_vehicle:  'Honda',
            view_datetime: '2015-11-25 18:31:06.501562',
            visit_date:    '2015-11-23 00:00:00',
        },
    ],
    filter: {},
    sort:   { page: 1, order: 'asc' },
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
