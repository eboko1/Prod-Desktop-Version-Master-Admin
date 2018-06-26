// vendor
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Modal } from 'antd';

// proj
import { fetchStatsCounts } from 'core/orders/duck';
import { fetchUniversalFiltersForm } from 'core/forms/universalFiltersForm/duck';

import { Catcher } from 'commons';
import { UniversalFiltersModal } from 'modals';

// own
import Styles from './styles.m.css';

const mapStateToProps = state => {
    return {
        stats: state.orders.statsCountsPanel.stats.stats,
    };
};

@connect(mapStateToProps, { fetchStatsCounts, fetchUniversalFiltersForm })
export default class UniversalFilters extends Component {
    state = {
        visible: false,
    };

    setUniversalFiltersReasonModal = visible => {
        this.setState({ visible });
        // TODO: R&D
        this.props.fetchStatsCounts(); // Triggers on Modal close
        this.props.fetchUniversalFiltersForm();
    };

    render() {
        return (
            <Catcher>
                <section className={ Styles.filters }>
                    UniversalFilters:
                    <Button
                        onClick={ () =>
                            this.setUniversalFiltersReasonModal(true)
                        }
                    >
                        UF modal
                    </Button>
                </section>
                <UniversalFiltersModal
                    visible={ this.state.visible }
                    show={ this.setUniversalFiltersReasonModal }
                    stats={ this.props.stats }
                />
            </Catcher>
        );
    }
}
