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
    anonymous:       true,
    clientFullname:  null,
    clientPhone:     null,
    comfort:         3,
    complaint:       null,
    datetime:        '2018-08-30 16:19:05.559585',
    employeeId:      null,
    employeeName:    null,
    employeeSurname: null,
    id:              6097,
    nps:             8,
    orderId:         null,
    orderNum:        null,
    photo:           null,
    recommended:     false,
    repairDuration:  2,
    repairQuality:   10,
    reply:           null,
    serviceQuality:  6,
    text:            'Тестовый комментарий',
    userId:          null,
    userVehicle:     null,
    visitDate:       null,
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
