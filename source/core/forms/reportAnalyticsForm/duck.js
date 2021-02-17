import {fetchReportAnalytics} from 'core/reports/reportAnalytics/duck';

/**
 * Constants
 * */

export const moduleName = 'reportAnalyticsForm';
const prefix = `cpb/${moduleName}`;

export const CREATE_ANALYTICS_ANALYTICS_FORM = `${prefix}/CREATE_ANALYTICS_ANALYTICS_FORM`;
export const CREATE_ANALYTICS_ANALYTICS_FORM_SUCCESS = `${prefix}/CREATE_ANALYTICS_ANALYTICS_FORM_SUCCESS`;

export const UPDATE_ANALYTICS_ANALYTICS_FORM = `${prefix}/UPDATE_ANALYTICS_ANALYTICS_FORM`;
export const UPDATE_ANALYTICS_ANALYTICS_FORM_SUCCESS = `${prefix}/UPDATE_ANALYTICS_ANALYTICS_FORM_SUCCESS`; 

export const CHANGE_CURRENT_FORM = `${prefix}/CHANGE_CURRENT_FORM`;

export const FETCH_ANALYTICS_CATALOGS_ANALYTICS_FORM = `${prefix}/FETCH_ANALYTICS_CATALOGS_ANALYTICS_FORM`;
export const FETCH_ANALYTICS_CATALOGS_ANALYTICS_FORM_SUCCESS = `${prefix}/FETCH_ANALYTICS_CATALOGS_ANALYTICS_FORM_SUCCESS`;

/**
 * Which form is currently focused(two types available)
 */
export const formKeys = {
    catalogForm: 'CATALOG_FORM',
    analyticsForm: 'ANALYTICS_FORM'
}

/**
 * Each analytics has its tree level respectivly
 */
export const analyticsLevels = {
    catalog: 1,
    analytics: 2
}

/**
 * Help to define how data have to be represented inside forms and what to do after submit button
 */
export const formModes = {
    EDIT: "EDIT",
    VIEW: "VIEW",
    ADD: "ADD"
}

/**
 * Reducer
 * */
const ReducerState = {
    fields: {
        catalogName: undefined,
        catalog: {},
        analyticsName: undefined,
        bookkeepingAccount: undefined,
        orderType: undefined
    },
    currentForm: formKeys.catalogForm,
    analyticsCatalogs: [],
    catalogsFilters: {
        level: analyticsLevels.catalog
    },
    errors:   [],
};

/* eslint-disable complexity */
export default function reducer(state = ReducerState, action) {
    const { type, payload } = action;

    switch (type) {
        case CHANGE_CURRENT_FORM:
            return {
                ...state,
                currentForm: payload
            };

        case FETCH_ANALYTICS_CATALOGS_ANALYTICS_FORM:
            return {
                ...state,
                analyticsCatalogsLoading: true,//Fetching started started
            };

        case FETCH_ANALYTICS_CATALOGS_ANALYTICS_FORM_SUCCESS:
            return {
                ...state,
                analyticsCatalogs: payload,
                analyticsCatalogsLoading: false, //Fetching finished
            };

        default:
            return state;
    }
}

/**
 * Selectors
 * */

export const stateSelector = state => state[ moduleName ];

/**
 * Action Creators
 * */

export const fetchAnalyticsCatalogs = () => ({
    type: FETCH_ANALYTICS_CATALOGS_ANALYTICS_FORM
});

export const fetchAnalyticsCatalogsSuccess = (analyticsCatalogs) => ({
    type: FETCH_ANALYTICS_CATALOGS_ANALYTICS_FORM_SUCCESS,
    payload: analyticsCatalogs
});

export const createAnalytics = ({analyticsEntity}) => ({
    type: CREATE_ANALYTICS_ANALYTICS_FORM,
    payload: {analyticsEntity}

});

export const createAnalyticsSuccess = () => ({
    type: CREATE_ANALYTICS_ANALYTICS_FORM_SUCCESS
});

export const updateAnalytics = ({analyticsId, newAnalyticsEntity}) => ({
    type: UPDATE_ANALYTICS_ANALYTICS_FORM,
    payload: {analyticsId, newAnalyticsEntity}

});

export const updateAnalyticsSuccess = () => {
    return function(dispatch) {
        dispatch(fetchReportAnalytics()); //Update after deleting
        return dispatch({
            type: UPDATE_ANALYTICS_ANALYTICS_FORM_SUCCESS
        });
    }
};

/**
 * Takes constant string representing form(form key, constants are located in the duck file
 * @param {string} newCurrentForm New form to be set
 */
export const changeCurrentForm = (newCurrentForm) => ({
    type: CHANGE_CURRENT_FORM,
    payload: newCurrentForm
});