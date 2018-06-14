// Core
import { handleActions } from 'redux-actions';
import { fromJS } from 'immutable';

// Actions
import * as actions from './actions';

const initialState = fromJS({
    login: {
        email: {
            errors:     void 0,
            name:       'email',
            touched:    true,
            validating: false,
            value:      '',
            dirty:      false,
        },
        password: {
            errors:     void 0,
            name:       'password',
            touched:    true,
            validating: false,
            value:      '',
            dirty:      false,
        },
    },
});

export default handleActions(
    {
        [ actions.change ]: (state, { payload: field, meta: form }) =>
            state.update(form, form =>
                /**
                 * Сперва обновляет определенное поле определенной формы
                 * Затем − удаляет ошибки со всех полей формы
                 */
                form.merge(fromJS(field)).map(field => {
                    return field.delete('errors');
                })),
        [ actions.setErrors ]: (
            state,
            { payload: errors, meta: { form, field } },
        ) =>
            state.updateIn([ form, field ], field => field.merge(fromJS(errors))),
        [ actions.reset ]: (state, { meta: form }) =>
            state.set(form, initialState.get(form)),
    },
    initialState,
);
