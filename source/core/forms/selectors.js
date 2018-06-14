// Core
import { createSelector } from 'reselect';

export const selectLoginForm = createSelector(
    state => state.forms.get('login'), // в forms/index fromik – закомменчен
    login => login.toJS(),
);
