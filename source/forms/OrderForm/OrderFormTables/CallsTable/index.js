// vendor
import React, { Component } from 'react';
import { Table } from 'antd';
import { FormattedMessage } from 'react-intl';
import { connect } from "react-redux";

// proj
import { Catcher } from 'commons';
import {
    fetchRecordingLink,
    selectCallsLinksCache
} from "core/calls/duck";

// own
import Styles from './styles.m.css';
import { columnsConfig } from './config';

const mapStateToProps = state => {
    return {
        callsLinksCache: selectCallsLinksCache(state),
    };
};

const mapDispatchToProps = {
    fetchRecordingLink,
};

@connect(mapStateToProps, mapDispatchToProps)
class CallsTable extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {
            orderCalls,
            fetchRecordingLink,
            callsLinksCache
        } = this.props;

        const columns = columnsConfig({fetchRecordingLink, callsLinksCache}); //It should be in the render method because we update configs each time smth changing

        return (
            <Catcher>
                <Table
                    className={ Styles.callsTable }
                    dataSource={ orderCalls }
                    columns={ columns }
                    pagination={ false }
                    size='small'
                    locale={ {
                        emptyText: <FormattedMessage id='no_data' />,
                    } }
                />
            </Catcher>
        );
    }
}

export default CallsTable;
