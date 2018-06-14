import types from './types';

export const formsActions = Object.freeze({
    setFirstName: (name, meta) => ({
        type:    types.SET_FIRST_NAME,
        payload: name,
        meta,
    }),

    setLastName: lastName => ({
        type:    types.SET_LAST_NAME,
        payload: lastName,
    }),

    setEmail: email => ({
        type:    types.SET_EMAIL,
        payload: email,
    }),

    setPassword: password => ({
        type:    types.SET_PASSWORD,
        payload: password,
    }),

    setPhone: phone => ({
        type:    types.SET_PHONE,
        payload: phone,
    }),

    setAvatar: avatar => ({
        type:    types.SET_AVATAR,
        payload: avatar,
    }),

    setLang: lang => ({
        type:    types.SET_LANG,
        payload: lang,
    }),
});
