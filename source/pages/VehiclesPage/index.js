// vendor
import React, {Component} from 'react';
import {FormattedMessage, injectIntl } from 'react-intl';
import {connect} from 'react-redux';
import {Icon} from 'antd';
import _ from 'lodash';

// proj
import {Layout, Spinner} from 'commons';

// own
import Styles from './styles.m.css';

const mapStateToProps = state => ({});

const mapDispatchToProps = {};

@injectIntl
@connect(mapStateToProps, mapDispatchToProps)
export default class VehiclesPage extends Component {
    constructor(props) {
        super(props);
    }

    render() {

        return (
            <Layout
                title={"Title here"}
                description={"Description"}
                controls={"Controls"}
            >
                Hello world!!!
            </Layout>
        )
    }
}