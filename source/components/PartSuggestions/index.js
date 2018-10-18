// vendor
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { Modal, List } from 'antd';

// proj
import { Catcher } from 'commons';

// own

export default class PartAttributes extends Component {
    render() {
        const { attributes, hideModal, showModal } = this.props;

        return (
            <Catcher>
                <Modal
                    title='TecDoc'
                    cancelText={ <FormattedMessage id='cancel' /> }
                    visible={ showModal }
                    onOk={ () => hideModal() }
                    onCancel={ () => hideModal() }
                >
                    <List
                        bordered
                        dataSource={ attributes }
                        renderItem={ item => (
                            <List.Item>
                                { `${item.description}: ${item.value}` }
                            </List.Item>
                        ) }
                    />
                </Modal>
            </Catcher>
        );
    }
}
