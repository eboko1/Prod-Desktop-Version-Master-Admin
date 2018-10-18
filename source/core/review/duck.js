/**
 * Constants
 * */
export const moduleName = 'review';
const prefix = `cpb/${moduleName}`;

export const FETCH_REVIEW = `${prefix}/FETCH_REVIEW`;
export const FETCH_REVIEW_SUCCESS = `${prefix}/FETCH_REVIEW_SUCCESS`;

export const POST_REVIEW_REPLY = `${prefix}/POST_REVIEW_REPLY`;
export const POST_REVIEW_REPLY_SUCCESS = `${prefix}/POST_REVIEW_REPLY_SUCCESS`;
export const POST_REVIEW_COMPLAIN = `${prefix}/POST_REVIEW_COMPLAIN`;
export const POST_REVIEW_COMPLAIN_SUCCESS = `${prefix}/POST_REVIEW_COMPLAIN_SUCCESS`;

/**
 * Reducer
 * */

const ReducerState = {
    // anonymous:       true,
    // clientFullname:  null,
    // clientPhone:     null,
    // comfort:         3,
    // complaint:       null,
    // datetime:        '2018-08-30 16:19:05.559585',
    // employeeId:      null,
    // employeeName:    null,
    // employeeSurname: null,
    // id:              6097,
    // nps:             8,
    // orderId:         null,
    // orderNum:        null,
    // photo:           null,
    // recommended:     false,
    // repairDuration:  2,
    // repairQuality:   10,
    // replyText:       null,
    // serviceQuality:  6,
    // text:            '',
    // userId:          null,
    // userVehicle:     null,
    // visitDate:       null,
};

export default function reducer(state = ReducerState, action) {
    const { type, payload } = action;

    switch (type) {
        case FETCH_REVIEW_SUCCESS:
            return {
                ...state,
                ...payload,
            };

        case POST_REVIEW_REPLY_SUCCESS:
            return {
                ...state,
                replyText: payload,
            };

        case POST_REVIEW_COMPLAIN_SUCCESS:
            return {
                ...state,
                complaint: payload,
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

export const postReviewReply = (id, reply) => ({
    type:    POST_REVIEW_REPLY,
    payload: { id, reply },
});

export const postReviewReplySuccess = reply => ({
    type:    POST_REVIEW_REPLY_SUCCESS,
    payload: reply,
});

export const postReviewComplain = (id, complain) => ({
    type:    POST_REVIEW_COMPLAIN,
    payload: { id, complain },
});
export const postReviewComplainSuccess = complain => ({
    type:    POST_REVIEW_COMPLAIN_SUCCESS,
    payload: complain,
});
