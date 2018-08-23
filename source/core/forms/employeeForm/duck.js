import moment from 'moment';
/**
 * Constants
 * */
export const moduleName = 'employeeForm';
const prefix = `cpb/${moduleName}`;

export const ON_CHANGE_EMPLOYEE_FORM = `${prefix}/ON_CHANGE_EMPLOYEE_FORM`;
export const INIT_EMPLOYEE_FORM = `${prefix}/INIT_EMPLOYEE_FORM`;
export const RESET_EMPLOYEE_FORM = `${prefix}/RESET_EMPLOYEE_FORM`;
export const SAVE_EMPLOYEE = `${prefix}/SAVE_EMPLOYEE`;
export const SAVE_EMPLOYEE_SUCCESS = `${prefix}/SAVE_EMPLOYEE_SUCCESS`;
export const SAVE_EMPLOYEE_FAILURE = `${prefix}/SAVE_EMPLOYEE_FAILURE`;
export const FETCH_EMPLOYEE_BY_ID = `${prefix}/FETCH_EMPLOYEE_BY_ID`;
export const FETCH_EMPLOYEE_BY_ID_SUCCESS = `${prefix}/FETCH_EMPLOYEE_BY_ID_SUCCESS`;
export const FETCH_EMPLOYEE_BY_ID_FAILURE = `${prefix}/FETCH_EMPLOYEE_BY_ID_FAILURE`;

/**
 * Reducer
 * */

const ReducerState = {
    fields: {
        email:              { value: void 0, name: 'email' },
        phone:              { value: void 0, name: 'phone' },
        enabled:            true,
        hireDate:           { value: moment(), name: 'hireDate' },
        jobTitle:           { value: void 0, name: 'jobTitle' },
        name:               { value: void 0, name: 'name' },
        sendSmsCancelOrder: false,
        sendSmsManualOrder: false,
        sendSmsNewOrder:    false,
        surname:            { value: void 0, name: 'surname' },
    },
    modalStatus: '',
    employeeId:  null,
};

// eslint-disable-next-line
export default function reducer(state = ReducerState, action) {
    const { type, payload } = action;

    switch (type) {
        case ON_CHANGE_EMPLOYEE_FORM:
            return {
                ...state,
                fields: {
                    ...state.fields,
                    ...payload,
                },
            };

        case INIT_EMPLOYEE_FORM:
        case FETCH_EMPLOYEE_BY_ID_SUCCESS:
        

            return {
                ...state,
                fields: {
                    email: {
                        value:   payload.email,
                        name:    'email',
                        dirty:   false,
                        touched: true,
                    },
                    phone: {
                        value:   payload.phone,
                        name:    'phone',
                        dirty:   false,
                        touched: true,
                    },
                    enabled: {
                        value:   payload.enabled,
                        name:    'enabled',
                        dirty:   false,
                        touched: true,
                    },
                    hireDate: {
                        value:   moment(payload.hireDate),
                        name:    'hireDate',
                        dirty:   false,
                        touched: true,
                    },
                    jobTitle: {
                        value:   payload.jobTitle,
                        name:    'jobTitle',
                        dirty:   false,
                        touched: true,
                    },
                    name: {
                        value:   payload.name,
                        name:    'name',
                        dirty:   false,
                        touched: true,
                    },
                    sendSmsCancelOrder: {
                        value:   payload.sendSmsCancelOrder,
                        name:    'sendSmsCancelOrder',
                        dirty:   false,
                        touched: true,
                    },
                    sendSmsManualOrder: {
                        value:   payload.sendSmsManualOrder,
                        name:    'sendSmsManualOrder',
                        dirty:   false,
                        touched: true,
                    },
                    sendSmsNewOrder: {
                        value:   payload.sendSmsNewOrder,
                        name:    'sendSmsNewOrder',
                        dirty:   false,
                        touched: true,
                    },
                    surname: {
                        value:   payload.surname,
                        name:    'surname',
                        dirty:   false,
                        touched: true,
                    },
    
                },
            };

        case RESET_EMPLOYEE_FORM:
            return ReducerState;

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

export const onChangeEmployeeForm = update => ({
    type:    ON_CHANGE_EMPLOYEE_FORM,
    payload: update,
});
export const initEmployeeForm = data => ({
    type:    INIT_EMPLOYEE_FORM,
    payload: data,
});
export const resetEmployeeForm = () => ({
    type: RESET_EMPLOYEE_FORM,
});
export const saveEmployee = (employee, id) => ({
    type:    SAVE_EMPLOYEE,
    payload: employee,
    id:      id,
});
export const saveEmployeeSuccess = data => ({
    type:    SAVE_EMPLOYEE_SUCCESS,
    payload: data,
});
export const saveEmployeeFailure = data => ({
    type:    SAVE_EMPLOYEE_FAILURE,
    payload: data,
});
export const fetchEmployeeById = (id) => ({
    type:    FETCH_EMPLOYEE_BY_ID,
    payload: id,

});
export const fetchEmployeeByIdSuccess = data => ({
    type:    FETCH_EMPLOYEE_BY_ID_SUCCESS,
    payload: data,
});
export const fetchEmployeeByIdFailure = data => ({
    type:    FETCH_EMPLOYEE_BY_ID_FAILURE,
    payload: data,
});
