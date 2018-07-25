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
import classNames from 'classnames';

// own
import Styles from './styles.m.css';
// eslint-disable-next-line
const mapStateToProps = state => ({
    stats: state.orders.stats, // ===
});

const mapDispatchToProps = {
    fetchOrdersStats,
    setOrdersStatusFilter,
    resetOrdersDaterangeFilter,
};

@withRouter
@connect(mapStateToProps, mapDispatchToProps)
class FunelContainer extends Component {
    setStatus = status => {
        if (status === 'success' || status === 'cancel' || status === 'review') {
            this.props.resetOrdersDaterangeFilter();
        }

        this.props.setOrdersStatusFilter(status);
    };

    render() {
        const { stats } = this.props;

        return stats ? (
            <div className={ Styles.funel }>
                <div
                    className={ Styles.funel__turn }
                    style={ {
                        backgroundImage: `url('${
                            images.funelArrowCurvedLeft
                        }')`,
                        backgroundRepeat: 'no-repeat',
                    } }
                />
                <div
                    className={ classNames(
                        Styles.funel__main,
                        Styles.funel__wrapper,
                        Styles[ 'funel__wrapper--column' ],
                    ) }
                >
                    <div className={ Styles.funel__wrapper }>
                        <NavLink
                            exact
                            to={ `${book.orders}/appointments` }
                            className={ Styles.funel__tabs__link }
                            activeClassName={
                                Styles[ 'funel__tabs__link--active' ]
                            }
                            onClick={ () =>
                                this.setStatus('not_complete,required,call')
                            }
                        >
                            <span>
                                <FormattedMessage id='funel.appointments' /> ({ stats.not_complete +
                                    stats.call +
                                    stats.required })
                            </span>
                        </NavLink>
                        <NavLink
                            exact
                            to={ `${book.orders}/approve` }
                            className={ Styles.funel__tabs__link }
                            activeClassName={
                                Styles[ 'funel__tabs__link--active' ]
                            }
                            onClick={ () => this.setStatus('approve,reserve') }
                        >
                            <span>
                                <FormattedMessage id='funel.record' /> ({ stats.approve +
                                    stats.reserve })
                            </span>
                        </NavLink>
                        <NavLink
                            exact
                            to={ `${book.orders}/in-progress` }
                            className={ Styles.funel__tabs__link }
                            activeClassName={
                                Styles[ 'funel__tabs__link--active' ]
                            }
                            onClick={ () => this.setStatus('progress') }
                        >
                            <span>
                                <FormattedMessage id='funel.repair' /> ({
                                    stats.progress
                                })
                            </span>
                        </NavLink>
                        <NavLink
                            exact
                            to={ `${book.orders}/success` }
                            className={ Styles.funel__tabs__link }
                            activeClassName={
                                Styles[ 'funel__tabs__link--active' ]
                            }
                            onClick={ () => this.setStatus('success') }
                        >
                            <span>
                                <FormattedMessage id='funel.done' /> ({
                                    stats.success
                                })
                            </span>
                        </NavLink>
                    </div>
                    <div
                        className={ classNames(
                            Styles.funel__wrapper,
                            Styles[ 'funel__wrapper--bottom' ],
                        ) }
                    >
                        <NavLink
                            exact
                            to={ `${book.orders}/invitations` }
                            className={ Styles[ 'funel__tabs__link--reverse' ] }
                            activeClassName={
                                Styles[ 'funel__tabs__link--active--reverse' ]
                            }
                            onClick={ () => this.setStatus('invite') }
                        >
                            <span>
                                <FormattedMessage id='funel.invitation' /> ({
                                    stats.invite
                                })
                            </span>
                            { /* </Link> */ }
                        </NavLink>
                        <NavLink
                            exact
                            to={ `${book.orders}/reviews` }
                            className={ Styles[ 'funel__tabs__link--reverse' ] }
                            activeClassName={
                                Styles[ 'funel__tabs__link--active--reverse' ]
                            }
                            onClick={ () => this.setStatus('review') }
                        >
                            <span>
                                <FormattedMessage id='funel.review' /> ({
                                    stats.review
                                })
                            </span>
                        </NavLink>
                    </div>
                </div>
                <div
                    className={ Styles[ 'funel__turn--arrow' ] }
                    style={ {
                        backgroundImage: `url('${
                            images.funelArrowCurvedRight
                        }')`,
                        backgroundRepeat: 'no-repeat',
                    } }
                />
                <div
                    className={ classNames(
                        Styles.funel__wrapper,
                        Styles.funel__additional,
                        Styles[ 'funel__wrapper--column' ],
                    ) }
                >
                    <NavLink
                        exact
                        to={ `${book.orders}/cancel` }
                        className={ Styles.funel__tabs__link }
                        activeClassName={ Styles[ 'funel__tabs__link--active' ] }
                        onClick={ () => this.setStatus('cancel') }
                    >
                        <span>
                            <FormattedMessage id='funel.cancel' /> ({
                                stats.cancel
                            })
                        </span>
                    </NavLink>
                    <div
                        className={ `${Styles[ 'funel__tabs__link--reverse' ]} ${
                            Styles[ 'funel__tabs__link--bottom' ]
                        } ` }
                    />
                </div>
                <div
                    className={ Styles[ 'funel__turn--arrow' ] }
                    style={ {
                        backgroundImage: `url('${
                            images.funelArrowCurvedRight
                        }')`,
                        backgroundRepeat: 'no-repeat',
                    } }
                />
            </div>
        ) : (
            <div>...loading</div>
        );
    }
}

export default FunelContainer;
