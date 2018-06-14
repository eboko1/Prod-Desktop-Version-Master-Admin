// Core
// react-intl-redux
import { connect } from 'react-redux';
import { IntlProvider } from 'react-intl';

const defaultSelector = state => state.intl;

const mapStateToProps = (state, { intlSelector = defaultSelector }) => {
    return intlSelector(state);
};

export const ConnectedIntlProvider = connect(mapStateToProps, null, null, {
    pure: false,
})(IntlProvider);

// export default ConnectedIntlProvider;
