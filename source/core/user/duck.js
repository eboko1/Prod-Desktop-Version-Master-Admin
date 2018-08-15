/**
 * Constants
 **/
export const moduleName = 'user';
const prefix = `cpb/${moduleName}`;

export const SET_USER = `${prefix}/SET_USER`;

/**
 * Reducer
 **/
const ReducerState = {
    avatar:     null,
    businessId: null,
    email:      null,
    id:         null,
    isAdmin:    null,
    language:   null,
    name:       '',
    phone:      null,
    roleIds:    [],
    scope:      [],
    surname:    '',
};
// const ReducerState = {
//     avatar:     null,
//     businessId: 1819,
//     email:      'kvkv122@gmail.com',
//     id:         720,
//     isAdmin:    true,
//     language:   'ua',
//     name:       'СТО',
//     phone:      '(063) 563-93-41',
//     roleIds:    [],
//     scope:      [ 'ADMIN' ],
//     surname:    'Партнер',
// };

export default function reducer(state = ReducerState, action) {
    const { type, payload } = action;

    switch (type) {
        case SET_USER:
            return { ...state, ...payload };

        default:
            return state;
    }
}

/**
 * Selectors
 **/

/**
 * Action Creators
 **/

export const setUser = user => ({
    type:    SET_USER,
    payload: user,
});
