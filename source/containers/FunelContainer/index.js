// vendor
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { withRouter } from 'react-router';
import classNames from 'classnames';

// proj
import {
    fetchOrdersStats,
    setOrdersStatusFilter,
    resetOrdersDaterangeFilter,
} from 'core/orders/duck';
import { clearUniversalFilters } from 'core/forms/universalFiltersForm/duck';

import { Numeral } from 'commons';
import { images } from 'utils';
import book from 'routes/book';

// own
import Styles from './styles.m.css';

const mapStateToProps = state => ({
    stats: state.orders.stats,
});

const mapDispatchToProps = {
    fetchOrdersStats,
    setOrdersStatusFilter,
    resetOrdersDaterangeFilter,
    clearUniversalFilters,
};

@withRouter
@connect(
    mapStateToProps,
    mapDispatchToProps,
)
class FunelContainer extends Component {
    setStatus = status => {
        if (
            status === 'success' ||
            status === 'cancel' ||
            status === 'review'
        ) {
            this.props.resetOrdersDaterangeFilter();
        }

        this.props.clearUniversalFilters();
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
                            to={ {
                                pathname: `${book.orders}/appointments`,
                                state:    {
                                    status:
                                        'not_complete,required,call,reserve',
                                },
                            } }
                            className={ Styles.funel__tabs__link }
                            activeClassName={
                                Styles[ 'funel__tabs__link--active' ]
                            }
                            onClick={ () =>
                                this.setStatus(
                                    'not_complete,required,call,reserve',
                                )
                            }
                        >
                            <FormattedMessage id='appointments' />
                            <span className={ Styles.count }>
                                (
                                <Numeral>
                                    { stats.not_complete +
                                        stats.call +
                                        stats.required +
                                        stats.reserve }
                                </Numeral>
                                )
                            </span>
                        </NavLink>
                        <NavLink
                            exact
                            to={ {
                                pathname: `${book.orders}/approve`,
                                state:    { status: 'approve' },
                            } }
                            className={ Styles.funel__tabs__link }
                            activeClassName={
                                Styles[ 'funel__tabs__link--active' ]
                            }
                            onClick={ () => this.setStatus('approve') }
                        >
                            <FormattedMessage id='records' />
                            <span className={ Styles.count }>
                                (<Numeral>{ stats.approve }</Numeral>)
                            </span>
                        </NavLink>
                        <NavLink
                            exact
                            to={ {
                                pathname: `${book.orders}/progress`,
                                state:    { status: 'progress' },
                            } }
                            className={ Styles.funel__tabs__link }
                            activeClassName={
                                Styles[ 'funel__tabs__link--active' ]
                            }
                            onClick={ () => this.setStatus('progress') }
                        >
                            <FormattedMessage id='repairs' />
                            <span className={ Styles.count }>
                                (<Numeral>{ stats.progress }</Numeral>)
                            </span>
                        </NavLink>
                        <NavLink
                            exact
                            to={ {
                                pathname: `${book.orders}/success`,
                                state:    { status: 'success' },
                            } }
                            className={ Styles.funel__tabs__link }
                            activeClassName={
                                Styles[ 'funel__tabs__link--active' ]
                            }
                            onClick={ () => this.setStatus('success') }
                        >
                            <FormattedMessage id='done' />
                            <span className={ Styles.count }>
                                (<Numeral>{ stats.success }</Numeral>)
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
                            to={ {
                                pathname: `${book.orders}/invitations`,
                                state:    { status: 'invite' },
                            } }
                            className={ Styles[ 'funel__tabs__link--reverse' ] }
                            activeClassName={
                                Styles[ 'funel__tabs__link--active--reverse' ]
                            }
                            onClick={ () => this.setStatus('invite') }
                        >
                            <FormattedMessage id='invitations' />
                            <span className={ Styles.count }>
                                (<Numeral>{ stats.invite }</Numeral>)
                            </span>
                        </NavLink>
                        <NavLink
                            exact
                            to={ {
                                pathname: `${book.orders}/reviews`,
                                state:    { status: 'review' },
                            } }
                            className={ Styles[ 'funel__tabs__link--reverse' ] }
                            activeClassName={
                                Styles[ 'funel__tabs__link--active--reverse' ]
                            }
                            onClick={ () => this.setStatus('review') }
                        >
                            <FormattedMessage id='reviews' />
                            <span className={ Styles.count }>
                                (<Numeral>{ stats.review }</Numeral>)
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
                        to={ {
                            pathname: `${book.orders}/cancel`,
                            state:    { status: 'cancel' },
                        } }
                        className={ Styles.funel__tabs__link }
                        activeClassName={ Styles[ 'funel__tabs__link--active' ] }
                        onClick={ () => this.setStatus('cancel') }
                    >
                        <FormattedMessage id='cancels' />
                        <span className={ Styles.count }>
                            (<Numeral>{ stats.cancel }</Numeral>)
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
            <div>
                <FormattedMessage id='loading' />
            </div>
        );
    }
}

export default FunelContainer;
