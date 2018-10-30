// vendor
import React, { Component } from 'react';
import { Icon, Select, Table } from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';
import _ from 'lodash';
import moment from 'moment';

// proj
import { Catcher } from 'commons';
import {
    DecoratedInputNumber,
    DecoratedInput,
    DecoratedSelect,
} from 'forms/DecoratedFields';

// own
import { columnsConfig } from './config.js';
import Styles from './styles.m.css';
const Option = Select.Option;

@injectIntl
export default class ArrayServiceInput extends Component {
    constructor(props) {
        super(props);

        const { initialService } = props;
        this.uuid = _.isArray(initialService) ? initialService.length : 0;
        const keys = _.isArray(initialService) ? _.keys(initialService) : [];

        this.state = { keys: [ ...keys, this.uuid++ ] };
    }

    componentDidUpdate(prevProps) {
        if (!_.isEqual(this.props.initialService, prevProps.initialService)) {
            this.props.form.resetFields();

            const { initialService } = this.props;
            this.uuid = _.isArray(initialService) ? initialService.length : 0;
            const keys = _.isArray(initialService)
                ? _.keys(initialService)
                : [];

            this.setState({ keys: [ ...keys, this.uuid++ ] });
        }
    }

    _getServiceData = (key, callback) => {
        // const { form } = this.props;
        // form.validateFields([ `service[${key}]` ], err => {
        //     if (err) {
        //         return;
        //     }
        // const service = form.getFieldValue(`service[${key}]`);
        // const serviceWithParsedHours = _.mapValues(
        //     service,
        //     value =>
        //         moment.isMoment(value) ? value.format('YYYY-MM-DD') : value,
        // );
        //
        // callback &&
        //     callback({
        //         ...serviceWithParsedHours,
        //         subjectType: 'employee',
        //     });
        // });
    };

    _add = () => {
        const keys = this.state.keys;
        this.setState({ keys: [ ...keys, this.uuid++ ] });
    };

    _handleAdd = key => {
        const { keys } = this.state;
        const services = this.props.form.getFieldValue('services');

        if (_.last(keys) === key && !services[ key ].service) {
            this.setState({ keys: [ ...keys, this.uuid++ ] });
        }
    };

    render() {
        const { initialService, loading } = this.props;
        const { getFieldDecorator } = this.props.form;
        const { formatMessage } = this.props.intl;
        const { keys } = this.state;

        const columns = columnsConfig(
            this.props,
            this.state,
            this._handleAdd,
            // this._handleUpdate,
            this._onDelete,
        );

        return (
            <Catcher>
                <Table
                    loading={ loading }
                    rowClassName={ ({ key }) => {
                        const wasEdited = _.get(this.props.fields, [ 'service', key ]);
                        const exists = _.get(initialService, [ key ]);

                        if (!exists) {
                            return Styles.newServiceRow;
                        } else if (wasEdited) {
                            return Styles.editedServiceRow;
                        }
                    } }
                    dataSource={ keys.map(key => ({ key })) }
                    columns={ columns }
                    size='small'
                    scroll={ { x: 1000 } }
                    pagination={ false }
                    defaultExpandAllRows
                    locale={ {
                        emptyText: <FormattedMessage id='no_data' />,
                    } }
                />
            </Catcher>
        );
    }
}
