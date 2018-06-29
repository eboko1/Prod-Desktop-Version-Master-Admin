// vendor
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Modal } from 'antd';

// proj
import { onChangeUniversalFiltersForm } from 'core/forms/universalFiltersForm/duck';
import { fetchOrders, fetchStatsCounts, setUniversalFilters } from 'core/orders/duck';
import { fetchUniversalFiltersForm } from 'core/forms/universalFiltersForm/duck';

import { Catcher } from 'commons';
import { UniversalFiltersModal } from 'modals';
import { UniversalFiltersTags } from 'components';

// own
import Styles from './styles.m.css';

const mapStateToProps = state => {
    return {
        stats:  state.orders.statsCountsPanel.stats.stats,
        filter: state.orders.filter,
    };
};

const mapDispatchToProps = {
    fetchOrders,
    fetchStatsCounts,
    fetchUniversalFiltersForm,
    setUniversalFilters,
    onChangeUniversalFiltersForm,
};

@connect(mapStateToProps, mapDispatchToProps)
export default class UniversalFilters extends Component {
    state = {
        visible: false,
    };

    setUniversalFiltersModal = visible => {
        this.setState(state => {
            if (!state.visible) {
                this.props.fetchStatsCounts();
                this.props.fetchUniversalFiltersForm();
            }

            return { visible };
        });
    };

    render() {
        return (
            <Catcher>
                <section className={ Styles.filters }>
                    <Button
                        type='primary'
                        onClick={ () => this.setUniversalFiltersModal(true) }
                    >
                        Фильтр
                    </Button>
                    <UniversalFiltersTags filter={ this.props.filter } fetchOrders={ this.props.fetchOrders } onChangeUniversalFiltersForm={ this.props.onChangeUniversalFiltersForm } setUniversalFilters={ this.props.setUniversalFilters }/>
                </section>
                <UniversalFiltersModal
                    visible={ this.state.visible }
                    show={ this.setUniversalFiltersModal }
                    stats={ this.props.stats }
                    filter={ this.props.filter }
                    // onSubmit={}
                    // onClose={}
                />
            </Catcher>
        );
    }
}
