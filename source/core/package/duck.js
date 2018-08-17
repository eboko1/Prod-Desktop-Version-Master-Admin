/**
 * Constants
 * */
export const moduleName = 'packages';
const prefix = `cpb/${moduleName}`;

export const FETCH_PACKAGES = `${prefix}/FETCH_PACKAGES`;
export const FETCH_PACKAGES_SUCCESS = `${prefix}/FETCH_PACKAGES_SUCCESS`;
export const FETCH_PACKAGES_ERROR = `${prefix}/FETCH_PACKAGES_ERROR`;

export const SET_EDIT_PACKAGE_ID = `${prefix}/SET_EDIT_PACKAGE_ID`;
export const SET_CREATE_PACKAGE = `${prefix}/SET_CREATE_PACKAGE`;

export const ON_CHANGE_PACKAGE_FORM = `${prefix}/ON_CHANGE_PACKAGE_FORM`;

export const UPDATE_PACKAGE = `${prefix}/UPDATE_PACKAGE`;
export const CREATE_PACKAGE = `${prefix}/CREATE_PACKAGE`;
export const DELETE_PACKAGE = `${prefix}/DELETE_PACKAGE`;

export const HIDE_FORMS = `${prefix}/HIDE_FORMS`;
export const ADD_ERROR = `${prefix}/ADD_ERROR`;
export const HANDLE_ERROR = `${prefix}/HANDLE_ERROR`;
/**
 * Reducer
 * */

let errorId = 1;

const ReducerState = {
    errors:            [],
    fields:            {},
    editPackageId:     null,
    createPackageForm: false,
    packages:          [],
};

export default function reducer(state = ReducerState, action) {
    const { type, payload } = action;

    switch (type) {
        case ON_CHANGE_PACKAGE_FORM:
            return {
                ...state,
                fields: {
                    ...state.fields,
                    ...payload,
                },
            };
        case FETCH_PACKAGES:
            return {
                ...state,
                editPackageId:     void 0,
                createPackageForm: false,
            };

        case FETCH_PACKAGES_SUCCESS:
            return {
                ...state,
                packages: payload,
            };

        case FETCH_PACKAGES_ERROR:
            return {
                ...state,
            };

        case SET_EDIT_PACKAGE_ID:
            return {
                ...state,
                editPackageId:     payload,
                createPackageForm: false,
            };

        case SET_CREATE_PACKAGE:
            return {
                ...state,
                editPackageId:     void 0,
                createPackageForm: true,
            };

        case UPDATE_PACKAGE:
            return {
                ...state,
            };

        case CREATE_PACKAGE:
            return {
                ...state,
            };

        case HIDE_FORMS:
            return {
                ...state,
                editPackageId:     void 0,
                createPackageForm: false,
            };

        case ADD_ERROR:
            return {
                ...state,
                errors: [ ...state.errors, { id: errorId++, ...payload }],
            };

        case HANDLE_ERROR:
            return {
                ...state,
                errors: state.errors.filter(({ id }) => id !== payload),
            };

        default:
            return state;
    }
}

export const setCreatePackage = create => ({
    type:    SET_CREATE_PACKAGE,
    payload: create,
});

export const setEditPackageId = packageId => ({
    type:    SET_EDIT_PACKAGE_ID,
    payload: packageId,
});

export const fetchPackages = () => ({
    type: FETCH_PACKAGES,
});

export const fetchPackagesSuccess = data => ({
    type:    FETCH_PACKAGES_SUCCESS,
    payload: data,
});

export const fetchPackagesError = () => ({
    type: FETCH_PACKAGES_ERROR,
});

export const onChangePackageForm = update => ({
    type:    ON_CHANGE_PACKAGE_FORM,
    payload: update,
});

export const updatePackage = (id, entity) => ({
    type:    UPDATE_PACKAGE,
    payload: { id, entity },
});

export const createPackage = entity => ({
    type:    CREATE_PACKAGE,
    payload: { entity },
});

export const deletePackage = id => ({
    type:    DELETE_PACKAGE,
    payload: { id },
});

export const hideForms = () => ({
    type: HIDE_FORMS,
});

export const addError = error => ({
    type:    ADD_ERROR,
    payload: error,
    error:   true,
});

export const handleError = id => ({
    type:    HANDLE_ERROR,
    payload: id,
});
