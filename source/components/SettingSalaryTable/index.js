// vendor
import React, { Component } from 'react';
import { Table, Icon, Button, Input, Select, message, DatePicker } from 'antd';
import { FormattedMessage } from 'react-intl';
import moment from 'moment';
import { v4 } from 'uuid';
import { withRouter } from 'react-router';

// proj
import { Catcher } from 'commons';

// own
import Styles from './styles.m.css';
const Option = Select.Option;

@withRouter
export default class SettingSalaryTable extends Component {
    constructor(props) {
        super(props);
        this.columns = [
            {
                title:     '',
                dataIndex: 'review',
                width:     '10%',
                render:    (text, record) => {
                    /* eslint-disable complexity */
                    return (
                        <>
                            <Button
                                onClick={ () => {
                                    if (
                                        record.id === 'add' &&
                                        record.employeeId === null
                                    ) {
                                        this.setState({ employeeEmpty: true });
                                        message.error('You must add employee');
                                    } else {
                                        this.props.saveSalary(
                                            record,
                                            record.id,
                                        );

                                        if (record.id === 'add') {
                                            this.setState({
                                                newSalary: {
                                                    id:               'add',
                                                    considerDiscount: false,
                                                    employeeId:       null,
                                                    endDate:          null,
                                                    percent:          0,
                                                    percentFrom:      'ORDER',
                                                    period:           'DAY',
                                                    ratePerPeriod:    0,
                                                    startDate:        moment(),
                                                    employee:         {
                                                        name:    '',
                                                        surname: '',
                                                    },
                                                },
                                            });
                                        }
                                    }
                                } }
                            >
                                <Icon
                                    className={ Styles.employeeTableIcon }
                                    type='save'
                                />
                            </Button>
                            {record.id !== 'add' ? (
                                <Button
                                    onClick={ () => {
                                        this.props.deleteSalary(record.id);
                                    } }
                                >
                                    <Icon
                                        className={ Styles.employeeTableIcon }
                                        type='delete'
                                    />
                                </Button>
                            ) : null}
                        </>
                    );
                },
            },

            {
                title:     <FormattedMessage id='employee-table.employee' />,
                dataIndex: 'employee.id',
                width:     '10%',
                render:    (text, record) => {
                    if (
                        this.state.changingId === 'add' &&
                        this.state.changingId === record.id &&
                        this.state.changingInputName === 'employee'
                    ) {
                        return (
                            <Select
                                name='employee'
                                placeholder={
                                    <FormattedMessage id='employee-table.employee' />
                                }
                                onChange={ this.handleChangeNew.bind(
                                    this,
                                    'employee',
                                ) }
                                style={ { minWidth: '135px' } }
                                value={ record.employeeId }
                            >
                                { this.props.employees &&
                                    this.props.employees.map(employee => (
                                        <Option value={ employee.id } key={ v4() }>
                                            { `${employee.name} ${
                                                employee.surname
                                            }` }
                                        </Option>
                                    )) }
                            </Select>
                        );
                    } else if (
                        this.state.changingId !== 'add' &&
                        this.state.changingId === record.id &&
                        this.state.changingInputName === 'employee'
                    ) {
                        return (
                            <Select
                                name='employee'
                                placeholder={
                                    <FormattedMessage id='employee-table.employee' />
                                }
                                onChange={ this.handleChangeTableSelect.bind(
                                    this,
                                    record.id,
                                    'employee',
                                ) }
                                style={ { minWidth: '135px' } }
                                value={ record.employeeId }
                            >
                                { this.props.employees.map(employee => {
                                    return (
                                        <Option value={ employee.id } key={ v4() }>
                                            { `${employee.name} ${
                                                employee.surname
                                            }` }
                                        </Option>
                                    );
                                }) }
                            </Select>
                        );
                    } else if (text || !text) {
                        return (
                            <div
                                style={ { cursor: 'pointer' } }
                                onClick={ () => {
                                    this.setState({
                                        changingId:        record.id,
                                        changingInputName: 'employee',
                                    });
                                } }
                            >
                                { record.employee.name ?
                                    `${record.employee.name} ${
                                        record.employee.surname
                                    }`
                                    : (
                                        <Button>
                                            <FormattedMessage id='change_employee' />
                                        </Button>
                                    ) }
                            </div>
                        );
                    }
                },
            },
            {
                title:     <FormattedMessage id='employee.jobTitle' />,
                dataIndex: 'jobTitle',
                width:     '10%',
                render:    (text, record) => {
                    return ( 
                        record.employee ?
                            record.employee.jobTitle
                            : ''
                    );
                    
                },
            },
            {
                title:     <FormattedMessage id='setting-salary.period' />,
                dataIndex: 'period',
                width:     '10%',
                render:    (text, record) => {
                    if (
                        this.state.changingId === 'add' &&
                        this.state.changingId === record.id &&
                        this.state.changingInputName === 'period'
                    ) {
                        return (
                            <Select
                                name='period'
                                placeholder={
                                    <FormattedMessage id='setting-salary.period' />
                                }
                                onChange={ this.handleChangeNew.bind(
                                    this,
                                    'period',
                                ) }
                                style={ { minWidth: '135px' } }
                                value={ record.period }
                            >
                                { [ 'DAY', 'WEEK', 'MONTH' ].map(period => (
                                    <Option value={ period } key={ v4() }>
                                        <FormattedMessage id={ `${period}` }/>
                                    </Option>
                                )) }
                            </Select>
                        );
                    } else if (
                        this.state.changingId !== 'add' &&
                        this.state.changingId === record.id &&
                        this.state.changingInputName === 'period'
                    ) {
                        return (
                            <Select
                                name='period'
                                placeholder={
                                    <FormattedMessage id='setting-salary.period' />
                                }
                                onChange={ this.handleChangeTableSelect.bind(
                                    this,
                                    record.id,
                                    'period',
                                ) }
                                style={ { minWidth: '135px' } }
                                value={ record.period }
                            >
                                { [ 'DAY', 'WEEK', 'MONTH' ].map(period => (
                                    <Option value={ period } key={ v4() }>
                                        <FormattedMessage id={ `${period}` }/>
                                    </Option>
                                )) }
                            </Select>
                        );
                    } else if (text || !text) {
                        return (
                            <div
                                style={ { cursor: 'pointer' } }
                                onClick={ () => {
                                    this.setState({
                                        changingId:        record.id,
                                        changingInputName: 'period',
                                    });
                                } }
                            >
                                { text ?
                                    <FormattedMessage id={ `${text}` }/>  :
                                    <Button>
                                        <FormattedMessage id='change_period' />
                                    </Button> }
                            </div>
                        );
                    }
                },
            },
            {
                title:     <FormattedMessage id='setting-salary.startDate' />,
                dataIndex: 'startDate',
                width:     '10%',
                render:    (text, record) => {
                    if (
                        this.state.changingId === 'add' &&
                        this.state.changingId === record.id &&
                        this.state.changingInputName === 'startDate'
                    ) {
                        return (
                            <DatePicker
                                name='startDate'
                                placeholder={
                                    <FormattedMessage id='setting-salary.startDate' />
                                }
                                onChange={ this.handleChangeNew.bind(
                                    this,
                                    'startDate',
                                ) }
                                style={ { minWidth: '135px' } }
                                value={ moment(record.startDate) }
                            />
                                
                        );
                    } else if (
                        this.state.changingId !== 'add' &&
                        this.state.changingId === record.id &&
                        this.state.changingInputName === 'startDate'
                    ) {
                        return (
                            <DatePicker
                                name='startDate'
                                placeholder={
                                    <FormattedMessage id='setting-salary.startDate' />
                                }
                                onChange={ this.handleChangeTableSelect.bind(
                                    this,
                                    record.id,
                                    'startDate',
                                ) }
                                style={ { minWidth: '135px' } }
                                value={ moment(record.startDate) }
                            />
                            
                        );
                    } else if (text || !text) {
                        return (
                            <div
                                style={ { cursor: 'pointer' } }
                                onClick={ () => {
                                    this.setState({
                                        changingId:        record.id,
                                        changingInputName: 'startDate',
                                    });
                                } }
                            >
                                { text ?
                                    moment(text).format('YYYY-MM-DD') :
                                    <Button>
                                        <FormattedMessage id='change_start_date' /> 
                                    </Button> }
                            </div>
                        );
                    }
                },
            },
            {
                title:     <FormattedMessage id='setting-salary.endDate' />,
                dataIndex: 'endDate',
                width:     '10%',
                render:    (text, record) => {
                    if (
                        this.state.changingId === 'add' &&
                        this.state.changingId === record.id &&
                        this.state.changingInputName === 'endDate'
                    ) {
                        return (
                            <DatePicker
                                name='endDate'
                                placeholder={
                                    <FormattedMessage id='setting-salary.endDate' />
                                }
                                onChange={ this.handleChangeNew.bind(
                                    this,
                                    'endDate',
                                ) }
                                style={ { minWidth: '135px' } }
                                value={ record.endDate?moment(record.endDate):'' }
                            />
                                
                        );
                    } else if (
                        this.state.changingId !== 'add' &&
                        this.state.changingId === record.id &&
                        this.state.changingInputName === 'endDate'
                    ) {
                        return (
                            <DatePicker
                                name='endDate'
                                placeholder={
                                    <FormattedMessage id='setting-salary.endDate' />
                                }
                                onChange={ this.handleChangeTableSelect.bind(
                                    this,
                                    record.id,
                                    'endDate',
                                ) }
                                style={ { minWidth: '135px' } }
                                value={ record.endDate?moment(record.endDate):'' }
                            />
                            
                        );
                    } else if (text || !text) {
                        return (
                            <div
                                style={ { cursor: 'pointer' } }
                                onClick={ () => {
                                    this.setState({
                                        changingId:        record.id,
                                        changingInputName: 'endDate',
                                    });
                                } }
                            >
                                { text ? 
                                    moment(text).format('YYYY-MM-DD') :
                                    <Button>
                                        <FormattedMessage id='change_end_date' /> 
                                    </Button> }
                            </div>
                        );
                    }
                },
            },
            {
                title:     <FormattedMessage id='setting-salary.ratePerPeriod' />,
                dataIndex: 'ratePerPeriod',
                width:     '10%',

                render: (text, record) => {
                    if (
                        this.state.changingId === 'add' &&
                        this.state.changingId === record.id &&
                        this.state.changingInputName === 'ratePerPeriod'
                    ) {
                        return (
                            <Input
                                name='ratePerPeriod'
                                placeholder={
                                    <FormattedMessage id='setting-salary.ratePerPeriod' />
                                }
                                onKeyPress={ this.handleChangeNew.bind(
                                    this,
                                    null,
                                ) }
                                defaultValue={ text }
                            />
                        );
                    } else if (
                        this.state.changingId !== 'add' &&
                        this.state.changingId === record.id &&
                        this.state.changingInputName === 'ratePerPeriod'
                    ) {
                        return (
                            <Input
                                name='ratePerPeriod'
                                placeholder={
                                    <FormattedMessage id='setting-salary.ratePerPeriod' />
                                }
                                onKeyPress={ this.handleChangeTableRow.bind(
                                    this,
                                    record.id,
                                ) }
                                defaultValue={ text }
                            />
                        );
                    } else if (text || !text) {
                        return (
                            <div
                                style={ { cursor: 'pointer' } }
                                onClick={ () => {
                                    this.setState({
                                        changingId:        record.id,
                                        changingInputName: 'ratePerPeriod',
                                    });
                                } }
                            >
                                { text || text === 0 ?
                                    // <FormattedMessage id={ `${text}` } />
                                    text

                                    : (
                                        <Button>
                                            <FormattedMessage id='change_rate_per_period' /> 
                                        </Button>
                                    ) }
                            </div>
                        );
                    }
                },
            },


            
            {
                title:     <FormattedMessage id='setting-salary.percentFrom' />,
                dataIndex: 'percentFrom',
                width:     '10%',
                render:    (text, record) => {
                    if (
                        this.state.changingId === 'add' &&
                        this.state.changingId === record.id &&
                        this.state.changingInputName === 'percentFrom'
                    ) {
                        return (
                            <Select
                                name='percentFrom'
                                placeholder={
                                    <FormattedMessage id='setting-salary.percentFrom' />
                                }
                                onChange={ this.handleChangeNew.bind(
                                    this,
                                    'percentFrom',
                                ) }
                                style={ { minWidth: '135px' } }
                                value={ record.percentFrom }
                            >
                                { [ 'ORDER', 'ORDER_HOURS', 'ORDER_SERVICES', 'SPARE_PARTS_PROFIT', 'ORDER_PROFIT' ].map(percent => (
                                    <Option value={ percent } key={ v4() }>
                                        <FormattedMessage id={ `${percent}` }/>
                                    </Option>
                                )) }
                            </Select>
                        );
                    } else if (
                        this.state.changingId !== 'add' &&
                        this.state.changingId === record.id &&
                        this.state.changingInputName === 'percentFrom'
                    ) {
                        return (
                            <Select
                                name='percentFrom'
                                placeholder={
                                    <FormattedMessage id='setting-salary.percentFrom' />
                                }
                                onChange={ this.handleChangeTableSelect.bind(
                                    this,
                                    record.id,
                                    'percentFrom',
                                ) }
                                style={ { minWidth: '135px' } }
                                value={ record.percentFrom }
                            >
                                { [ 'ORDER', 'ORDER_HOURS', 'ORDER_SERVICES', 'SPARE_PARTS_PROFIT', 'ORDER_PROFIT' ].map(percent => (
                                    <Option value={ percent } key={ v4() }>
                                        <FormattedMessage id={ `${percent}` }/>
                                    </Option>
                                )) }
                            </Select>
                        );
                    } else if (text || !text) {
                        return (
                            <div
                                style={ { cursor: 'pointer' } }
                                onClick={ () => {
                                    this.setState({
                                        changingId:        record.id,
                                        changingInputName: 'percentFrom',
                                    });
                                } }
                            >
                                { text || text === 0 ?
                                    // <FormattedMessage id={ `${text}` } />
                                    text
                                    : (
                                        <Button>
                                            <FormattedMessage id='change_percent_from' />
                                        </Button>
                                    ) }
                            </div>
                        );
                    }
                },
            },
            // {
            //     title:     <FormattedMessage id='setting-salary.percentFrom' />,
            //     dataIndex: 'percentFrom',
            //     width:     '10%',
            // },
            {
                title:     <FormattedMessage id='setting-salary.percent' />,
                dataIndex: 'percent',
                width:     '10%',
                render:    (text, record) => {
                    if (
                        this.state.changingId === 'add' &&
                        this.state.changingId === record.id &&
                        this.state.changingInputName === 'percent'
                    ) {
                        return (
                            <Input
                                name='percent'
                                placeholder={
                                    <FormattedMessage id='setting-salary.percent' />
                                }
                                onKeyPress={ this.handleChangeNew.bind(
                                    this,
                                    null,
                                ) }
                                defaultValue={ text }
                            />
                        );
                    } else if (
                        this.state.changingId !== 'add' &&
                        this.state.changingId === record.id &&
                        this.state.changingInputName === 'percent'
                    ) {
                        return (
                            <Input
                                name='percent'
                                placeholder={
                                    <FormattedMessage id='setting-salary.percent' />
                                }
                                onKeyPress={ this.handleChangeTableRow.bind(
                                    this,
                                    record.id,
                                ) }
                                defaultValue={ text }
                            />
                        );
                    } else if (text || !text) {
                        return (
                            <div
                                style={ { cursor: 'pointer' } }
                                onClick={ () => {
                                    this.setState({
                                        changingId:        record.id,
                                        changingInputName: 'percent',
                                    });
                                } }
                            >
                                { text || text === 0 ?
                                    // <FormattedMessage id={ `${text}` } />
                                    text

                                    : (
                                        <Button>
                                            <FormattedMessage id='change_percent' />
                                        </Button>
                                    ) }
                            </div>
                        );
                    }
                },
            },
            {
                title: (
                    <FormattedMessage id='setting-salary.considerDiscount' />
                ),
                dataIndex: 'considerDiscount',
                width:     '10%',
                render:    (text, record) => {
                    // console.log(record.considerDiscount);
                    if (
                        this.state.changingId === 'add' &&
                        this.state.changingId === record.id &&
                        this.state.changingInputName === 'considerDiscount'
                    ) {
                        return (
                            <Select
                                name='considerDiscount'
                                placeholder={
                                    <FormattedMessage id='setting-salary.considerDiscount' />
                                }
                                onChange={ this.handleChangeNew.bind(
                                    this,
                                    'considerDiscount',
                                ) }
                                style={ { minWidth: '135px' } }
                                value={ record.considerDiscount }
                            >
                                <Option value key={ v4() }>
                                    
                                    <FormattedMessage id='yes' />

                                </Option>

                                <Option value={ false } key={ v4() }>
                                    <FormattedMessage id='no' />
                                    
                                </Option>
                            </Select>
                        );
                    } else if (
                        this.state.changingId !== 'add' &&
                        this.state.changingId === record.id &&
                        this.state.changingInputName === 'considerDiscount'
                    ) {
                        return (
                            <Select
                                name='considerDiscount'
                                placeholder={
                                    <FormattedMessage id='setting-salary.considerDiscount' />
                                }
                                onChange={ this.handleChangeTableSelect.bind(
                                    this,
                                    record.id,
                                    'considerDiscount',
                                ) }
                                style={ { minWidth: '135px' } }
                                value={ record.considerDiscount }
                            >
                                <Option value key={ v4() }>
                                    
                                    <FormattedMessage id='yes' />

                                </Option>

                                <Option value={ false } key={ v4() }>
                                    <FormattedMessage id='no' />
                                    
                                </Option>
                            </Select>
                        );
                    } else if (text || !text) {

                        return (
                            <div
                                style={ { cursor: 'pointer' } }
                                onClick={ () => {
                                    this.setState({
                                        changingId:        record.id,
                                        changingInputName: 'considerDiscount',
                                    });
                                } }
                            >
                                { text || text === 0 || text === false ?
                                    text === true ?
                                        <FormattedMessage id='yes' />
                                        :
                                        <FormattedMessage id='no' />
                                    : (
                                        <Button><FormattedMessage id='change_consider_discount' /></Button>
                                    ) }
                            </div>
                        );
                    }
                },
            },
        ];
        this.state = {
            employeeEmpty: false,
            newSalary:     {
                id:               'add',
                considerDiscount: false,
                employeeId:       null,
                endDate:          null,
                percent:          0,
                percentFrom:      'ORDER',
                period:           'DAY',
                ratePerPeriod:    0,
                startDate:        moment(),
                employee:         {
                    name:    '',
                    surname: '',
                },
            },
        };
    }

    componentDidUpdate(prevProps) {
        if (this.props.salaries && prevProps.salaries !== this.props.salaries) {
            this.setState({ salariesTable: [ ...this.props.salaries ] });
        }
    }

    handleChangeTableSelect = (id, name, e, es) => {
        const { salariesTable } = this.state;
        salariesTable.map(item => {
            if (item.id === id) {
                if (name === 'employee') {
                    item.employeeId = e;
                    item[ name ].id = e;
                    // item[ name ].id=e

                    item[ name ].name = es.props.children.split(' ')[ 0 ];
                    item[ name ].surname = es.props.children.split(' ')[ 1 ];
                } else {
                    item[ name ] = e;
                }
            }

            return item;
        });

        this.setState({
            salariesTable:     salariesTable,
            changingId:        null,
            changingInputName: null,
        });
    };

    handleChangeTableRow(id, e) {
        const { salariesTable } = this.state;

        if (e.key === 'Enter') {
            salariesTable.map(item => {
                if (item.id === id) {
                    item[ e.target.name ] = e.target.value;
                }

                return item;
            });

            this.setState({
                salariesTable:     salariesTable,
                changingId:        null,
                changingInputName: null,
            });
        }
    }

    handleChangeNew = (name, e, es) => {
        const { newSalary } = this.state;
        if (name) {
            if (name === 'employee') {
                newSalary.employeeId = e;
                newSalary.employee.name = es.props.children.split(' ')[ 0 ];
                newSalary.employee.surname = es.props.children.split(' ')[ 1 ];
            } else {
                newSalary[ name ] = e;
            }

            this.setState({
                newSalary:         newSalary,
                changingId:        null,
                changingInputName: null,
            });
        } else if (e.key === 'Enter') {
            newSalary[ e.target.name ] = e.target.value;
            this.setState({
                newSalary:         newSalary,
                changingId:        null,
                changingInputName: null,
            });
        }
    };

    render() {
        const { salariesTable, newSalary } = this.state;
        const columns = this.columns;

        return (
            <Catcher>
                <Table
                    dataSource={
                        salariesTable && salariesTable.length > 0
                            ? [ newSalary, ...salariesTable ].map(
                                (salary, index) => ({
                                    ...salary,
                                    index,
                                    key: v4(),
                                }),
                            )
                            : [ newSalary ].map((salary, index) => ({
                                ...salary,
                                index,
                                key: v4(),
                            }))
                    }
                    columns={ columns }
                    scroll={ { x: 1500 } }
                    pagination={ false }
                    locale={ {
                        emptyText: <FormattedMessage id='no_data' />,
                    } }
                />
            </Catcher>
        );
    }
}
