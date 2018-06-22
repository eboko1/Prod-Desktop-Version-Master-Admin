// vendor
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { withRouter } from 'react-router';

// proj
import { fetchOrdersStats, setOrdersStatusFilter } from 'core/orders/duck';
import book from 'routes/book';

// own
import Styles from './styles.m.css';
// eslint-disable-next-line
const mapStateToProps = (state, props) => {
    return {
        stats: state.orders.stats,
    };
};

@withRouter
@connect(mapStateToProps, { fetchOrdersStats, setOrdersStatusFilter })
class FunelContainer extends Component {
    componentDidMount() {
        this.props.fetchOrdersStats();
    }

    setStatus = status => {
        this.props.setOrdersStatusFilter(status);
    };

    render() {
        const { stats } = this.props;

        return (
            <div className={ Styles.funel }>
                <NavLink
                    exact
                    to={ `${book.orders}/appointments` }
                    activeClassName={ Styles.active }
                    onClick={ () =>
                        this.setStatus('not_complete,required,reserve,call')
                    }
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
                    onClick={ () => this.setStatus('approve') }
                >
                    <FormattedMessage id='funel.record' /> ({ stats.approve })
                </NavLink>
                <NavLink
                    exact
                    to={ `${book.orders}/in-progress` }
                    activeClassName={ Styles.active }
                    onClick={ () => this.setStatus('progress') }
                >
                    <FormattedMessage id='funel.repair' /> ({ stats.progress })
                </NavLink>
                <NavLink
                    exact
                    to={ `${book.orders}/success` }
                    activeClassName={ Styles.active }
                    onClick={ () => this.setStatus('success') }
                >
                    <FormattedMessage id='funel.done' /> ({ stats.success })
                </NavLink>
                <NavLink
                    exact
                    to={ `${book.orders}/reviews` }
                    activeClassName={ Styles.active }
                    onClick={ () => this.setStatus('success') }
                >
                    <FormattedMessage id='funel.review' /> ({ stats.review })
                </NavLink>
                <NavLink
                    exact
                    to={ `${book.orders}/invitations` }
                    activeClassName={ Styles.active }
                    onClick={ () => this.setStatus('invite') }
                >
                    <FormattedMessage id='funel.invitation' /> ({ stats.invite })
                </NavLink>
                <NavLink
                    exact
                    to={ `${book.orders}/canceled` }
                    activeClassName={ Styles.active }
                    onClick={ () => this.setStatus('cancel') }
                >
                    <FormattedMessage id='funel.cancel' /> ({ stats.cancel })
                </NavLink>
            </div>
        );
    }
}

export default FunelContainer;
