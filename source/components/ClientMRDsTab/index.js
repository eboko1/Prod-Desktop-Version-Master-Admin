// vendor
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { DatePicker } from 'antd';
import moment from 'moment';

// proj
import {
    fetchClientMRDs,
    setFilterDate,
    setClientMRDsPage,
} from 'core/clientMRDs/duck';
import { Loader } from "commons";
import ClientMRDsTable from '../Tables/ClientMRDsTable'


// own
import Styles from './styles.m.css';

const DEF_DATE_FORMAT = 'DD/MM/YYYY';

const mapStateToProps = state => ({
    isFetching: state.ui.clientMRDsFetching,
    MRDsUntilDate: state.clientMRDs.filter.MRDsUntilDate,
    clientMRDsPage: state.clientMRDs.filter.page,
    mrds: state.clientMRDs.mrds,
    stats: state.clientMRDs.stats,
});

const mapDispatchToProps = {
    fetchClientMRDs,
    setClientMRDsPage,
    setFilterDate,
};

@connect(
    mapStateToProps,
    mapDispatchToProps,
)
export default class ClientMRDsTab extends Component {
    constructor(props) {
        super(props);
        
        this.onDatePicker.bind(this);
    }

    componentDidMount() {
        const { clientId } = this.props;
        
        this.props.setFilterDate(moment().format(DEF_DATE_FORMAT));
        this.props.fetchClientMRDs({ clientId });
        
    }

    onDatePicker(date) {
        const { clientId } = this.props;

        this.props.setFilterDate(date.format(DEF_DATE_FORMAT));
        this.props.fetchClientMRDs({ clientId });
    }

    render() {
        const {
            isFetching,
            mrds,
            stats,
            setClientMRDsPage,
            fetchClientMRDs,
            clientMRDsPage,
            clientId
        } = this.props;
        if (isFetching) {
            return <Loader loading={ isFetching } />;
        }

        return (
            <>
                <div className={Styles.headerContainer}>
                    <DatePicker
                        allowClear={false}
                        defaultValue={moment(this.props.MRDsUntilDate, DEF_DATE_FORMAT)}
                        format={DEF_DATE_FORMAT}
                        onChange={date => this.onDatePicker(date)}></DatePicker
                    >
                </div>

                <ClientMRDsTable
                    isFetching={isFetching}
                    mrds={mrds}
                    setMRDsPage={setClientMRDsPage}
                    fetchMRDs={fetchClientMRDs}
                    clientMRDsPage={clientMRDsPage}
                    clientId={clientId}
                    stats={stats}
                />
            </>
        );
    }
}
