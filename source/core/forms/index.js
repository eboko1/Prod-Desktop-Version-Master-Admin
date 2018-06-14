import { combineReducers } from 'redux';

import formikForm from './formikForm/reducer';

const forms = combineReducers({
    formikForm,
});

export default forms;
