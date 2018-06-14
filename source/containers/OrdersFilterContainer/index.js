// vendor
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Input } from 'antd';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Catcher } from 'commons';
import Styles from './styles.m.css';
//proj
import { ordersSearch } from 'core/orders/duck';

const Search = Input.Search;
const ButtonGroup = Button.Group;

const mapStateToProps = (state, props) => {
    return {
        stats: state.orders.stats,
    };
};

@injectIntl
@connect(mapStateToProps, { ordersSearch })
export default class OrdersFilterContainer extends Component {
    _applyFilterMessage = event => {
        console.log('event', event.target.value);
        this.props.ordersSearch(event.target.value);
    };
    render() {
        const { status, stats, intl } = this.props;

        return (
            <Catcher>
                <div className={ Styles.filter }>
                    <Search
                        className={ Styles.search }
                        placeholder={ intl.formatMessage({
                            id: 'orders-filter.search_placeholder',
                        }) }
                        // placeholder={
                        //     <FormattedMessage id='orders-filter.search.search_placeholder' />
                        // }
                        // eslint-disable-next-line
                        onSearch={value => this._applyFilterMessage(value)}
                        onChange={ this._applyFilterMessage }
                        enterButton
                    />
                    { status === 'appointments' && (
                        <ButtonGroup className={ Styles.buttonGroup }>
                            <Button>
                                <FormattedMessage id='all' /> ({ stats.not_complete +
                                    stats.required +
                                    stats.reserve +
                                    stats.call })
                            </Button>
                            <Button>
                                <FormattedMessage id='not_complete' /> ({
                                    stats.not_complete
                                })
                            </Button>
                            <Button>
                                <FormattedMessage id='required' /> ({
                                    stats.required
                                })
                            </Button>
                            <Button>
                                <FormattedMessage id='reserve' /> ({
                                    stats.reserve
                                })
                            </Button>
                            <Button>
                                <FormattedMessage id='call' /> ({ stats.call })
                            </Button>
                        </ButtonGroup>
                    ) }
                </div>
            </Catcher>
        );
    }
}
