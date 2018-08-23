/**
 * Constants
 * */
export const moduleName = 'addBusinessPackage';
const prefix = `cpb/${moduleName}`;

export const ON_CHANGE_BUSINESS_PACKAGE_FORM = `${prefix}/ON_CHANGE_BUSINESS_PACKAGE_FORM`;


/**
 * Reducer
 * */

const ReducerState = {
    fields: {},
};

export default function reducer(state = ReducerState, action) {
    const { type, payload } = action;

    switch (type) {
        case ON_CHANGE_BUSINESS_PACKAGE_FORM:
            return {
                ...state,
                fields: {
                    ...state.fields,
                    ...payload,
                },
            };

        default:
            return state;
    }
}

export const onChangeBusinessPackageForm = update => ({
    type:    ON_CHANGE_BUSINESS_PACKAGE_FORM,
    payload: update,
});
