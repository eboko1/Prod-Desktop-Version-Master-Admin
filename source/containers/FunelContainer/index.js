// vendor
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { withRouter } from 'react-router';

// proj
import {
    fetchOrdersStats,
    setOrdersStatusFilter,
    resetOrdersDaterangeFilter,
} from 'core/orders/duck';

import { images } from 'utils';
import book from 'routes/book';

// own
import Styles from './styles.m.css';
// eslint-disable-next-line
const mapStateToProps = state => ({
    stats: state.orders.stats,
});

const mapDispatchToProps = {
    fetchOrdersStats,
    setOrdersStatusFilter,
    resetOrdersDaterangeFilter,
};

@withRouter
@connect(mapStateToProps, mapDispatchToProps)
class FunelContainer extends Component {
    componentDidMount() {
        this.props.fetchOrdersStats();
    }

    setStatus = status => {
        if (status === 'success' || status === 'cancel') {
            this.props.resetOrdersDaterangeFilter();
        }

        this.props.setOrdersStatusFilter(status);
    };

    render() {
        const { stats } = this.props;

        return stats ? (
            <div className={ Styles.funel }>
                <NavLink
                    exact
                    to={ `${book.orders}/appointments` }
                    activeClassName={ Styles.active }
                    className={ Styles.link }
                    onClick={ () =>
                        this.setStatus('not_complete,required,reserve,call')
                    }
                >
                    <FormattedMessage id='funel.appointments' />
                    <div>
                        ({ stats.not_complete +
                            stats.call +
                            stats.reserve +
                            stats.required })
                    </div>
                    <img src={ images.funelTopLeft } />
                </NavLink>
                <NavLink
                    exact
                    to={ `${book.orders}/approved` }
                    className={ Styles.link }
                    activeClassName={ Styles.active }
                    onClick={ () => this.setStatus('approve') }
                >
                    <FormattedMessage id='funel.record' />
                    <div>({ stats.approve })</div>
                    <img src={ images.funelRight } />
                </NavLink>
                <NavLink
                    exact
                    to={ `${book.orders}/in-progress` }
                    className={ Styles.link }
                    activeClassName={ Styles.active }
                    onClick={ () => this.setStatus('progress') }
                >
                    <FormattedMessage id='funel.repair' />
                    <div>({ stats.progress }) </div>
                    <img src={ images.funelRight } />
                </NavLink>
                <NavLink
                    exact
                    to={ `${book.orders}/success` }
                    className={ Styles.link }
                    activeClassName={ Styles.active }
                    onClick={ () => this.setStatus('success') }
                >
                    <FormattedMessage id='funel.done' />
                    <div>({ stats.success })</div>
                    <img src={ images.funelTopRight } />
                </NavLink>
                <div>
                    <img src={ images.funelBottomLeft } />
                </div>
                <NavLink
                    exact
                    to={ `${book.orders}/invitations` }
                    className={ `${Styles.link} ${Styles.invitations}` }
                    activeClassName={ Styles.active }
                    onClick={ () => this.setStatus('invite') }
                >
                    <img src={ images.funelLeft } />
                    <FormattedMessage id='funel.invitation' />
                    <div>({ stats.invite })</div>
                </NavLink>
                <NavLink
                    exact
                    to={ `${book.orders}/reviews` }
                    className={ `${Styles.link} ${Styles.reviews}` }
                    activeClassName={ Styles.active }
                    onClick={ () => this.setStatus('review') }
                >
                    <img src={ images.funelLeft } />
                    <FormattedMessage id='funel.review' />
                    <div>({ stats.review })</div>
                </NavLink>
                <div>
                    <img src={ images.funelBottomRight } />
                </div>
                <NavLink
                    exact
                    to={ `${book.orders}/cancel` }
                    className={ `${Styles.link} ${Styles.canceled}` }
                    activeClassName={ Styles.active }
                    onClick={ () => this.setStatus('cancel') }
                >
                    <FormattedMessage id='funel.cancel' /> ({ stats.cancel })
                </NavLink>
            </div>
        ) : (
            <div>...loading</div>
        );
    }
}

export default FunelContainer;
