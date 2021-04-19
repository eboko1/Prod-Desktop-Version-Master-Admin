// vendor
import React, { Component } from 'react';
import { connect } from 'react-redux';

// proj
import {
    fetchCalls
} from "core/calls/duck";

// own
import Styles from './styles.m.css';
import CallsTable from './CallsTable';

const mapStateToProps = state => ({
    
});

const mapDispatchToProps = {
    fetchCalls
};

@connect(
    mapStateToProps,
    mapDispatchToProps,
)
export default class ClientCallsTab extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.fetchCalls();
    }

    render() {
        return (
            <>
                <div>
                    
                </div>
                <CallsTable />
            </>
        );
    }
}
