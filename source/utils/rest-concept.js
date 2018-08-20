// proj
import { fetchAPI } from 'utils';

export default new class API {
    fetchWatever = () => {
        return fetchAPI('METH', { query: '' });
    };
}();

// usage in saga

// import API
//
// yield call(API.fetchWatever)
