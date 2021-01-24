// vendor
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Select, Button, Icon, Modal, Input, Checkbox, Table, notification } from 'antd';
import _ from 'lodash';
import moment from 'moment';

// proj
import {
    setTrackingFilters,
    selectTrackingFilters,
    selectTrackingLoading,
} from 'core/storage/tracking';
import { TrackingTable } from 'components';
// own
const Option = Select.Option;

const mapStateToProps = state => ({
    collapsed: state.ui.collapsed,
    filters:   selectTrackingFilters(state),
    loading:   selectTrackingLoading(state),
    user:      state.auth,
});

const mapDispatchToProps = {
    setTrackingFilters,
};

@connect(
    mapStateToProps,
    mapDispatchToProps,
)
@injectIntl
export default class StoreProductTrackingModal extends Component {
    constructor(props) {
        super(props);
        this.state={
            
        };
    }

    handleCancel = () => {
        this.props.hideModal();
    }

    componentDidMount() {
        
    }

    componentDidUpdate(prevProps) {
        const { visible, setTrackingFilters, productId } = this.props;
        if(!prevProps.visible && this.props.visible) {
            setTrackingFilters({
                productId: productId,
                showOnlyReserves: true,
                page: 1
            })
        }
    }


    render() {
        const { children, visible, filters, loading } = this.props;

        return (
            <Modal
                visible={visible}
                title={<FormattedMessage id='navigation.products_reserves'/>}
                width={'80%'}
                zIndex={9999}
                onCancel={this.handleCancel}
                footer={null}
                maskClosable={false}
            >
                <TrackingTable
                    filters={ filters }
                    loading={ loading }
                    type={ 'reserves' } 
                />
            </Modal>
        );
    }
}