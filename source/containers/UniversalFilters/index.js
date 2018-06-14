// vendor
import React, { Component } from 'react';
import { Button, Modal } from 'antd';

// proj
import { Catcher } from 'commons';
import { UniversalFiltersModal } from 'modals';

// own
import Styles from './styles.m.css';

export default class UniversalFilters extends Component {
    state = {
        visible: false,
    };

    setUniversalFiltersReasonModal = visible => {
        this.setState({ visible });
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
                />
            </Catcher>
        );
    }
}
