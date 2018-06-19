// vendor
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { withRouter } from 'react-router';

// proj
import { fetchOrdersStats } from 'core/orders/duck';
import book from 'routes/book';

// own
import Styles from './styles.m.css';
// eslint-disable-next-line
const mapStateToProps = (state, props) => {
    return {
        stats: state.orders.stats,
    };
};
// eslint-disable-next-line
const mapDispatchToProps = (dispatch, props) => {
    return {
        actions: bindActionCreators(
            {
                fetchOrdersStats: fetchOrdersStats,
            },
            dispatch,
        ),
    };
};

@withRouter
@connect(mapStateToProps, mapDispatchToProps)
class FunelContainer extends Component {
    componentDidMount() {
        this.props.actions.fetchOrdersStats();
    }

    render() {
        const { stats } = this.props;

        return (
            <div className={ Styles.funel }>
                <NavLink
                    exact
                    to={ `${book.orders}/appointments` }
                    activeClassName={ Styles.active }
                >
                    <FormattedMessage id='funel.appointments' /> ({ stats.not_complete +
                        stats.call +
                        stats.reserve +
                        stats.required })
                </NavLink>
                <NavLink
                    exact
                    to={ `${book.orders}/approved` }
                    activeClassName={ Styles.active }
                >
                    <FormattedMessage id='funel.record' /> ({ stats.approve })
                </NavLink>
                <NavLink
                    exact
                    to={ `${book.orders}/in-progress` }
                    activeClassName={ Styles.active }
                >
                    <FormattedMessage id='funel.repair' /> ({ stats.progress })
                </NavLink>
                <NavLink
                    exact
                    to={ `${book.orders}/success` }
                    activeClassName={ Styles.active }
                >
                    <FormattedMessage id='funel.done' /> ({ stats.success })
                </NavLink>
                <NavLink
                    exact
                    to={ `${book.orders}/reviews` }
                    activeClassName={ Styles.active }
                >
                    <FormattedMessage id='funel.review' /> ({ stats.review })
                </NavLink>
                <NavLink
                    exact
                    to={ `${book.orders}/invitations` }
                    activeClassName={ Styles.active }
                >
                    <FormattedMessage id='funel.invitation' /> ({ stats.invite })
                </NavLink>
                <NavLink
                    exact
                    to={ `${book.orders}/canceled` }
                    activeClassName={ Styles.active }
                >
                    <FormattedMessage id='funel.cancel' /> ({ stats.cancel })
                </NavLink>
            </div>
        );
    }
}

export default FunelContainer;
