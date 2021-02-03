/**
 * Constants
 * */

export const moduleName = 'reportAnalyticsForm';
const prefix = `cpb/${moduleName}`;

export const CREATE_ANALYTICS_ANALYTICS_FORM = `${prefix}/CREATE_ANALYTICS_ANALYTICS_FORM`;
export const CREATE_ANALYTICS_ANALYTICS_FORM_SUCCESS = `${prefix}/CREATE_ANALYTICS_ANALYTICS_FORM_SUCCESS`;

export const CHANGE_CURRENT_FORM = `${prefix}/CHANGE_CURRENT_FORM`;

export const FETCH_ANALYTICS_CATALOGS_ANALYTICS_FORM = `${prefix}/FETCH_ANALYTICS_CATALOGS_ANALYTICS_FORM`;
export const FETCH_ANALYTICS_CATALOGS_ANALYTICS_FORM_SUCCESS = `${prefix}/FETCH_ANALYTICS_CATALOGS_ANALYTICS_FORM_SUCCESS`;

// export const ON_CHANGE_ADD_CLIENT_FORM = `${prefix}/ON_CHANGE_ADD_CLIENT_FORM`;

// export const ADD_ERROR = `${prefix}/ADD_ERROR`;
// export const HANDLE_ERROR = `${prefix}/HANDLE_ERROR`;

//Which form is currently focused(two types available)
export const formKeys = {
    catalogForm: 'CATALOG_FORM',
    analyticsForm: 'ANALYTICS_FORM'
}

export const analyticsLevels = {
    catalog: 1,
    analytics: 2
}

/**
 * Reducer
 * */

// let errorId = 1;

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

        // case ON_CHANGE_ADD_CLIENT_FORM:
        //     return {
        //         ...state,
        //         fields: {
        //             ...state.fields,
        //             ...payload,
        //         },
        //     };

        // case ADD_ERROR:
        //     return {
        //         ...state,
        //         errors: [ ...state.errors, { id: errorId++, ...payload }],
        //     };

        // case HANDLE_ERROR:
        //     return {
        //         ...state,
        //         errors: state.errors.filter(({ id }) => id !== payload),
        //     };

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

/**
 * Takes constant string representing form(form key, constants are located in the duck file
 * @param {string} newCurrentForm New form to be set
 */
export const changeCurrentForm = (newCurrentForm) => ({
    type: CHANGE_CURRENT_FORM,
    payload: newCurrentForm
});

// export const onChangeAddClientForm = (fields, { form, field }) => ({
//     type:    ON_CHANGE_ADD_CLIENT_FORM,
//     payload: fields,
//     meta:    { form, field },
// });

// export const addError = error => ({
//     type:    ADD_ERROR,
//     payload: error,
//     error:   true,
// });

// export const handleError = id => ({
//     type:    HANDLE_ERROR,
//     payload: id,
// });
