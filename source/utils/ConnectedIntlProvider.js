// vendor
import { connect } from 'react-redux';
import { IntlProvider } from 'react-intl';

// Proj
import { intl } from 'store/intl';

const defaultSelector = state => state.intl;

const mapStateToProps = (state, { intlSelector = defaultSelector }) => {
    if (intlSelector(state)) {
        return intlSelector(state);
    }

    return {
        locale:   intl.locale,
        messages: intl.messages,
    };
};

export const ConnectedIntlProvider = connect(
    mapStateToProps,
    null,
    null,
    {
        pure: false,
    },
)(IntlProvider);
