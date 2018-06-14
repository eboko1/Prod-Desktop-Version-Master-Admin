import React, { Component } from 'react';
import { Modal, Button } from 'antd';

// own
import Styles from './styles.m.css';

export default class UniversalFiltersModal extends Component {
    render() {
        const { show, visible } = this.props;

        return (
            <Modal
                title='Universal Filters'
                cancelText='cancel'
                okText='submit'
                wrapClassName={ Styles.ufmoldal }
                visible={ visible }
                onOk={ () => show(false) }
                onCancel={ () => show(false) }
            >
                <p>Status...</p>
                <p>Manual...</p>
            </Modal>
        );
    }
}
