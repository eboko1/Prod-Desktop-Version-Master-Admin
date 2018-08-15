/**
 * Constants
 **/
export const moduleName = 'order';
const prefix = `cpb/${moduleName}`;

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
