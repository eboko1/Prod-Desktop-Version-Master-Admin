// vendor
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import {
    Table,
    Button,
    Modal,
    Upload,
    Icon,
    Checkbox,
    Select,
    Input,
    InputNumber,
    Popconfirm,
    Radio,
    notification,
} from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';

// proj
import { Catcher, Spinner } from 'commons';
import { permissions, isForbidden } from 'utils';
import { images } from 'utils';
import { ConfirmDiagnosticModal } from 'modals';
import {
    API_URL,
    addNewDiagnosticTemplate,
    getDiagnosticsTemplates,
    addNewDiagnosticRow,
    sendDiagnosticAnswer,
    deleteDiagnosticProcess,
    deleteDiagnosticTemplate,
    getPartProblems,
    sendMessage,
} from 'core/forms/orderDiagnosticForm/saga';

// own
import Styles from './styles.m.css';

@injectIntl
class DiagnosticTable extends Component {
    _isMounted = false;

    constructor(props) {
        super(props);
        this.state = {
            update:                      false,
            orderDiagnostic:             props.orderDiagnostic,
            orderId:                     props.orderId,
            selectedRows:                [],
            rowsCount:                   0,
            headerCheckboxIndeterminate: false,
            checkedAll:                  false,
            possibleRows:                [],
            dataSource:                  [],
            groupsTitles:                [],
            partsTitles:                 [],
            filterPlan:                  null,
            filterStage:                 null,
            filterStatus:                null,
            filterCommentary:            null,
            filterPhoto:                 null,
        };

        this.templatesData =
            this.templatesData == undefined ? {} : this.templatesData;
        this.templatesTitles = [];
        this.groupsTitles = [];
        this.partsTitles = [];
        this.planFilterOptions = [];
        this.ok = 0;
        this.bad = 0;
        this.critical = 0;
        this.open = 0;
        this.withCommentary = 0;
        this.withPhoto = 0;
        this.getCurrentDiagnostic = this.getCurrentDiagnostic.bind(this);
        this.addNewDiagnostic = this.addNewDiagnostic.bind(this);
        this.deleteDiagnostic = this.deleteDiagnostic.bind(this);
        this.onPlanChange = this.onPlanChange.bind(this);
        this.onStageChange = this.onStageChange.bind(this);
        this.onDetailChange = this.onDetailChange.bind(this);
        this.getTemplatesList = this.getTemplatesList.bind(this);
        this.updateDataSource = this.updateDataSource.bind(this);
        this.deleteRow = this.deleteRow.bind(this);
        this.onCheckAll = this.onCheckAll.bind(this);
        this.editSelectedRowsStatus = this.editSelectedRowsStatus.bind(this);
        this.deleteSelectedRows = this.deleteSelectedRows.bind(this);
        this.setPhoto = this.setPhoto.bind(this);
        this.photoKeys = [];
        this.columns = [
            {
                title: () => {
                    const {
                        filterPlan,
                        filterStage,
                        filterStatus,
                        filterCommentary,
                        filterPhoto,
                    } = this.state;
                    const filtered =
                        filterPlan ||
                        filterStage ||
                        filterStatus ||
                        filterCommentary;
                    var count = this.props.disabled
                        ? this.state.dataSource.length
                        : filtered
                            ? this.state.dataSource.length
                            : this.state.dataSource.length - 1;
                    if (count < 0) { count = 0; }
                    let type = filtered ? 'danger' : 'normal';

                    return (
                        <div className={ Styles.filter_column_header_wrap }>
                            <p style={ { paddingLeft: 10 } }>#</p>
                            <Button
                                type={ type }
                                style={ {
                                    color:           '#fff !important',
                                    backgroundColor: '#ff2a2c !important',
                                    borderColor:     '#ff2a2c !important',
                                } }
                                style={ { maxWidth: 60 } }
                                onClick={ () => {
                                    this.setState({
                                        filterPlan:       null,
                                        filterStage:      null,
                                        filterStatus:     null,
                                        filterCommentary: null,
                                        filterPhoto:      null,
                                    });
                                    {
                                        this.getCurrentDiagnostic();
                                    }
                                } }
                            >
                                { filtered ? (
                                    <Icon type='close-circle' />
                                ) : 
                                    count
                                }
                            </Button>
                        </div>
                    );
                },
                dataIndex: 'key',
                key:       'key',
                width:     '5%',
                render:    (num, element) => {
                    let checked = this.state.selectedRows.indexOf(num) > -1;

                    return (
                        <div style={ { paddingLeft: 5 } }>
                            <span>{ num } </span>
                            <Checkbox
                                disabled={
                                    this.props.disabled || element.disabled
                                }
                                onChange={ () => {
                                    this.onChangeCheckbox(num);
                                } }
                                checked={ checked }
                            />
                        </div>
                    );
                },
            },
            {
                title: () => {
                    const { Option } = Select;

                    return (
                        <div
                            className={ Styles.filter_column_header_wrap }
                            style={ { width: '100%' } }
                        >
                            <FormattedMessage id='order_form_table.diagnostic.plan' />
                            <Select
                                allowClear
                                showSearch
                                value={
                                    this.state.filterPlan === null
                                        ? undefined
                                        : this.state.filterPlan
                                }
                                style={ { width: '80%' } }
                                dropdownStyle={ { minWidth: 280 } }
                                placeholder={
                                    <FormattedMessage id='order_form_table.diagnostic.plan' />
                                }
                                onChange={ selectValue => {
                                    if (selectValue != '') {
                                        this.setState({
                                            filterPlan: selectValue,
                                        }); 
                                    }
                                    {
                                        this.getCurrentDiagnostic();
                                    }
                                } }
                            >
                                { this.templatesTitles.map((template, i) => (
                                    <Option key={ i + 1 } value={ template.title }>
                                        { template.title }
                                    </Option>
                                )) }
                            </Select>
                        </div>
                    );
                },
                dataIndex: 'plan',
                key:       'plan',
                width:     '15%',
                render:    plan => {
                    const { Option } = Select;

                    return plan != '' ? (
                        <p>{ plan }</p>
                    ) : (
                        <Select
                            disabled={ this.props.disabled }
                            showSearch
                            placeholder={
                                <FormattedMessage id='order_form_table.diagnostic.plan' />
                            }
                            onChange={ this.onPlanChange }
                            dropdownStyle={ { minWidth: 280 } }
                        >
                            { this.templatesTitles.map((template, i) => (
                                <Option key={ i + 1 } value={ template.id }>
                                    { template.title }
                                </Option>
                            )) }
                        </Select>
                    );
                },
            },
            {
                title: () => {
                    const { Option } = Select;
                    let options =
                        undefined !== this.planFilterOptions
                            ? this.planFilterOptions
                            : [];

                    return (
                        <div
                            className={ Styles.filter_column_header_wrap }
                            style={ { width: '100%' } }
                        >
                            <p>
                                <FormattedMessage id='order_form_table.diagnostic.stage' />
                            </p>
                            <Select
                                allowClear
                                style={ { width: '80%' } }
                                value={
                                    this.state.filterStage === null
                                        ? undefined
                                        : this.state.filterStage
                                }
                                showSearch
                                placeholder={
                                    <FormattedMessage id='order_form_table.diagnostic.stage' />
                                }
                                dropdownStyle={ { minWidth: 280 } }
                                onChange={ selectValue => {
                                    if (selectValue != '') {
                                        this.setState({
                                            filterStage: selectValue,
                                        });
                                    }
                                    {
                                        this.getCurrentDiagnostic();
                                    }
                                } }
                            >
                                { options.map((stage, i) => (
                                    <Option key={ i + 1 } value={ stage.title }>
                                        { stage.title }
                                    </Option>
                                )) }
                            </Select>
                        </div>
                    );
                },
                dataIndex: 'stage',
                key:       'stage',
                width:     '15%',
                render:    stage => {
                    const { Option } = Select;
                    let options = this.state.groupsTitles
                        ? this.state.groupsTitles
                        : [];

                    return stage != '' ? (
                        <p>{ stage }</p>
                    ) : (
                        <Select
                            showSearch
                            placeholder={
                                <FormattedMessage id='order_form_table.diagnostic.stage' />
                            }
                            disabled={
                                this.props.disabled || options.length == 0
                            }
                            onChange={ this.onStageChange }
                            dropdownStyle={ { minWidth: 280 } }
                        >
                            { options.map((template, i) => (
                                <Option key={ i + 1 } value={ template.id }>
                                    { template.title }
                                </Option>
                            )) }
                        </Select>
                    );
                },
            },
            {
                title: () => {
                    let bgColorOK =
                            this.state.filterStatus == 'OK'
                                ? 'var(--green)'
                                : 'rgb(200,225,180)',
                        bgColorBAD =
                            this.state.filterStatus == 'BAD'
                                ? 'rgb(255, 255, 0)'
                                : 'rgb(255,240,180)',
                        bgColorCRITICAL =
                            this.state.filterStatus == 'CRITICAL'
                                ? 'rgb(255, 126, 126)'
                                : 'rgb(250,175,175)',
                        bgColorBAD_AND_CRITICAL = {
                            bad:
                                this.state.filterStatus == 'BAD&CRITICAL'
                                    ? 'rgb(255, 255, 0)'
                                    : 'rgb(255,240,180)',
                            critical:
                                this.state.filterStatus == 'BAD&CRITICAL'
                                    ? 'rgb(255, 126, 126)'
                                    : 'rgb(250,175,175)',
                        },
                        bgColorOPEN =
                            this.state.filterStatus == 'OPEN'
                                ? 'rgb(155, 89, 182)'
                                : 'rgb(210, 190, 230)',
                        boxShadow = '1px 1px 4px -1px inset';

                    return (
                        <div className={ Styles.filter_column_header_wrap }>
                            <FormattedMessage id='order_form_table.diagnostic.detail' />
                            <div style={ { display: 'flex' } }>
                                <div className={ Styles.filter_button_wrap }>
                                    <Button
                                        style={ {
                                            width:           '100%',
                                            backgroundColor: bgColorOK,
                                        } }
                                        onClick={ () => {
                                            if (
                                                this.state.filterStatus == 'OK'
                                            ) {
                                                this.setState({
                                                    filterStatus: null,
                                                });
                                            } else {
                                                this.setState({
                                                    filterStatus: 'OK',
                                                });
                                            }
                                            {
                                                this.getCurrentDiagnostic();
                                            }
                                        } }
                                        title={ this.props.intl.formatMessage({
                                            id:
                                                'order_form_table.diagnostic.filter',
                                        }) }
                                    >
                                        <FormattedMessage id='order_form_table.diagnostic.status.ok' />
                                    </Button>
                                    <Input
                                        style={
                                            this.state.filterStatus == 'OK'
                                                ? { boxShadow: boxShadow }
                                                : {}
                                        }
                                        className={ Styles.filter_input }
                                        value={ this.ok }
                                    />
                                </div>
                                <div className={ Styles.filter_button_wrap }>
                                    <Button
                                        style={ {
                                            width:           '100%',
                                            backgroundColor: bgColorBAD,
                                        } }
                                        onClick={ () => {
                                            if (
                                                this.state.filterStatus == 'BAD'
                                            ) {
                                                this.setState({
                                                    filterStatus: null,
                                                });
                                            } else {
                                                this.setState({
                                                    filterStatus: 'BAD',
                                                });
                                            }
                                            {
                                                this.getCurrentDiagnostic();
                                            }
                                        } }
                                        title={ this.props.intl.formatMessage({
                                            id:
                                                'order_form_table.diagnostic.filter',
                                        }) }
                                    >
                                        <FormattedMessage id='order_form_table.diagnostic.status.bad' />
                                    </Button>
                                    <Input
                                        style={
                                            this.state.filterStatus == 'BAD'
                                                ? { boxShadow: boxShadow }
                                                : {}
                                        }
                                        className={ Styles.filter_input }
                                        value={ this.bad }
                                    />
                                </div>
                                <div className={ Styles.filter_button_wrap }>
                                    <Button
                                        style={ {
                                            width:           '100%',
                                            backgroundColor: bgColorCRITICAL,
                                        } }
                                        onClick={ () => {
                                            if (
                                                this.state.filterStatus ==
                                                'CRITICAL'
                                            ) {
                                                this.setState({
                                                    filterStatus: null,
                                                });
                                            } else {
                                                this.setState({
                                                    filterStatus: 'CRITICAL',
                                                });
                                            }
                                            {
                                                this.getCurrentDiagnostic();
                                            }
                                        } }
                                        title={ this.props.intl.formatMessage({
                                            id:
                                                'order_form_table.diagnostic.filter',
                                        }) }
                                    >
                                        <FormattedMessage id='order_form_table.diagnostic.status.critical' />
                                    </Button>
                                    <Input
                                        style={
                                            this.state.filterStatus ==
                                            'CRITICAL'
                                                ? { boxShadow: boxShadow }
                                                : {}
                                        }
                                        className={ Styles.filter_input }
                                        value={ this.critical }
                                    />
                                </div>
                                <div className={ Styles.filter_button_wrap }>
                                    <Button
                                        style={ { width: '100%', padding: 0 } }
                                        onClick={ () => {
                                            if (
                                                this.state.filterStatus ==
                                                'BAD&CRITICAL'
                                            ) {
                                                this.setState({
                                                    filterStatus: null,
                                                });
                                            } else {
                                                this.setState({
                                                    filterStatus:
                                                        'BAD&CRITICAL',
                                                });
                                            }
                                            {
                                                this.getCurrentDiagnostic();
                                            }
                                        } }
                                        title={ this.props.intl.formatMessage({
                                            id:
                                                'order_form_table.diagnostic.filter',
                                        }) }
                                    >
                                        <span
                                            className={
                                                Styles.filter_half_button
                                            }
                                            style={ {
                                                backgroundColor:
                                                    bgColorBAD_AND_CRITICAL.bad,
                                                borderRadius: '4px 0px 0px 4px',
                                            } }
                                        >
                                            <FormattedMessage id='order_form_table.diagnostic.status.bad' />
                                        </span>
                                        <span
                                            className={
                                                Styles.filter_half_button
                                            }
                                            style={ {
                                                backgroundColor:
                                                    bgColorBAD_AND_CRITICAL.critical,
                                                borderRadius: '0px 4px 4px 0px',
                                            } }
                                        >
                                            <FormattedMessage id='order_form_table.diagnostic.status.critical' />
                                        </span>
                                    </Button>
                                    <Input
                                        style={
                                            this.state.filterStatus ==
                                            'BAD&CRITICAL'
                                                ? { boxShadow: boxShadow }
                                                : {}
                                        }
                                        className={ Styles.filter_input }
                                        value={ this.bad + this.critical }
                                    />
                                </div>
                                <div className={ Styles.filter_button_wrap }>
                                    <Button
                                        style={ {
                                            width:           '100%',
                                            color:           'rgb(72, 72, 72)',
                                            backgroundColor: bgColorOPEN,
                                        } }
                                        onClick={ () => {
                                            if (
                                                this.state.filterStatus ==
                                                'OPEN'
                                            ) {
                                                this.setState({
                                                    filterStatus: null,
                                                });
                                            } else {
                                                this.setState({
                                                    filterStatus: 'OPEN',
                                                });
                                            }
                                            {
                                                this.getCurrentDiagnostic();
                                            }
                                        } }
                                        title={ this.props.intl.formatMessage({
                                            id:
                                                'order_form_table.diagnostic.filter',
                                        }) }
                                    >
                                        <FormattedMessage id='order_form_table.diagnostic.status.open' />
                                    </Button>
                                    <Input
                                        style={
                                            this.state.filterStatus == 'OPEN'
                                                ? { boxShadow: boxShadow }
                                                : {}
                                        }
                                        className={ Styles.filter_input }
                                        value={ this.open }
                                    />
                                </div>
                            </div>
                        </div>
                    );
                },
                dataIndex: 'detail',
                key:       'detail',
                width:     '35%',
                render:    (detail, rowProp) => {
                    const { Option } = Select;
                    let options =
                        undefined !== this.state.partsTitles
                            ? this.state.partsTitles
                            : [];

                    return detail != '' ? (
                        <span>
                            <p>{ detail }</p>
                            <p style={ { fontStyle: 'italic' } }>
                                { rowProp.actionTitle }
                            </p>
                        </span>
                    ) : (
                        <Select
                            disabled={
                                this.props.disabled || options.length == 0
                            }
                            showSearch
                            placeholder={
                                <FormattedMessage id='order_form_table.diagnostic.detail' />
                            }
                            onChange={ this.onDetailChange }
                        >
                            { options.map((template, i) => (
                                <Option key={ i + 1 } value={ template.id }>
                                    { template.title }
                                </Option>
                            )) }
                        </Select>
                    );
                },
            },
            {
                title: () => {
                    return (
                        <div className={ Styles.filter_column_header_wrap }>
                            <p
                                style={ {
                                    whiteSpace: 'nowrap',
                                    overflowX:  'hidden',
                                } }
                            >
                                <FormattedMessage id='order_form_table.diagnostic.commentary' />
                            </p>
                            <Button
                                style={
                                    this.state.filterCommentary
                                        ? {
                                            backgroundColor:
                                                  'rgb(210, 190, 230)',
                                        }
                                        : {}
                                }
                                onClick={ () => {
                                    if (this.state.filterCommentary != null) {
                                        this.setState({
                                            filterCommentary: null,
                                        });
                                    } else {
                                        this.setState({
                                            filterCommentary: 'COMMENTARY',
                                        });
                                    }
                                    this.getCurrentDiagnostic();
                                } }
                            >
                                { this.withCommentary }
                            </Button>
                        </div>
                    );
                },
                dataIndex: 'commentary',
                key:       'commentary',
                width:     '5%',
                render:    (commentary, rowProp) => (
                    <CommentaryButton
                        disabled={
                            this.props.disabled ||
                            rowProp.disabled ||
                            !rowProp.partId
                        }
                        getCurrentDiagnostic={ this.getCurrentDiagnostic }
                        commentary={ commentary }
                        rowProp={ rowProp }
                    />
                ),
            },
            {
                title: () => {
                    return (
                        <div className={ Styles.filter_column_header_wrap }>
                            <FormattedMessage id='order_form_table.diagnostic.duplicate' />
                        </div>
                    );
                },
                dataIndex: 'duplicate',
                key:       'duplicate',
                width:     '5%',
                render:    (data, rowProp) => (
                    /*<PhotoButton
                        disabled={this.props.disabled || rowProp.disabled}
                        getCurrentDiagnostic={this.getCurrentDiagnostic}
                        setPhoto={this.setPhoto}
                        rowProp={rowProp}
                        photo={photo}
                    />*/
                    <Button
                        type='primary'
                        disabled={
                            this.props.disabled ||
                            rowProp.disabled ||
                            !rowProp.partId
                        }
                        onClick={ async () => {
                            await addNewDiagnosticRow(
                                rowProp.orderId,
                                rowProp.diagnosticTemplateId,
                                rowProp.groupId,
                                rowProp.partId,
                                rowProp.templateIndex,
                            );
                            await this.getCurrentDiagnostic();
                        } }
                        title={ this.props.intl.formatMessage({
                            id: 'order_form_table.diagnostic.duplicate_line',
                        }) }
                    >
                        <Icon type='plus' />
                    </Button>
                ),
            },
            {
                title: () => {
                    return (
                        <div>
                            <FormattedMessage id='order_form_table.diagnostic.status' />
                        </div>
                    );
                },
                dataIndex: 'status',
                key:       'status',
                width:     '15%',
                render:    (text, rowProp) => {
                    return rowProp.plan ? (
                        <DiagnosticStatusButton
                            disabled={ this.props.disabled || rowProp.disabled }
                            getCurrentDiagnostic={ this.getCurrentDiagnostic }
                            status={ text }
                            rowProp={ rowProp }
                        />
                    ) : (
                        <Button
                            type='primary'
                            style={ { width: '100%' } }
                            onClick={ () => {
                                notification.success({
                                    message: this.props.intl.formatMessage({
                                        id: 'message_sent',
                                    }),
                                });
                                sendMessage(this.props.orderId);
                            } }
                            disabled={ isForbidden(
                                this.props.user,
                                permissions.ACCESS_TELEGRAM,
                            ) }
                        >
                            <FormattedMessage id='end' />
                        </Button>
                    );
                },
            },
            {
                dataIndex: 'delete',
                key:       'delete',
                width:     '5%',
                render:    (text, rowProp) => (
                    <DeleteProcessButton
                        disabled={
                            this.props.disabled ||
                            rowProp.disabled ||
                            rowProp.status > 0
                        }
                        deleteRow={ this.deleteRow }
                        rowProp={ rowProp }
                    />
                ),
            },
        ];
    }

    async addNewDiagnostic(data) {
        let id = this.templatesTitles.find(elem => elem.title == data).id;
        await addNewDiagnosticTemplate(this.state.orderId, id);
        await this.getCurrentDiagnostic();
    }

    async deleteDiagnostic(data) {
        let id = this.templatesTitles.find(elem => elem.title == data).id;
        await deleteDiagnosticTemplate(this.state.orderId, id);
        await this.getCurrentDiagnostic();
    }

    onPlanChange(event) {
        let tmp = [];
        for (let i = 0; i < this.groupsTitles.length; i++) {
            if (this.groupsTitles[ i ].parentId == event) {
                tmp.push({
                    title: this.groupsTitles[ i ].title,
                    id:    this.groupsTitles[ i ].id,
                });
            }
        }
        this.templateId = event;
        this.setState({
            groupsTitles: tmp,
        });
    }

    onStageChange(event) {
        let tmp = [];
        for (let i = 0; i < this.partsTitles.length; i++) {
            if (this.partsTitles[ i ].parentId == event) {
                tmp.push({
                    title: this.partsTitles[ i ].title,
                    id:    this.partsTitles[ i ].id,
                });
            }
        }
        this.groupId = event;
        this.setState({
            partsTitles: tmp,
        });
    }

    async onDetailChange(event) {
        await addNewDiagnosticRow(
            this.state.orderId,
            this.templateId,
            this.groupId,
            event,
        );
        await this.getCurrentDiagnostic();
    }

    getCurrentDiagnostic() {
        var that = this;
        let token = localStorage.getItem('_my.carbook.pro_token');
        let url = API_URL;
        let params = `/orders/diagnostics?orderId=${this.state.orderId}`;
        url += params;
        fetch(url, {
            method:  'GET',
            headers: {
                Authorization: token,
            },
        })
            .then(function(response) {
                if (response.status !== 200) {
                    return Promise.reject(new Error(response.statusText));
                }

                return Promise.resolve(response);
            })
            .then(function(response) {
                return response.json();
            })
            .then(function(data) {
                that.state.orderDiagnostic = data.diagnosis;
                that.updateDataSource();
            })
            .catch(function(error) {
                console.log('error', error);
            });
    }

    getTemplatesList() {
        for (let i = 0; i < this.templatesData.diagnosticTemplatesCount; i++) {
            this.templatesTitles.push({
                title: this.templatesData.diagnosticTemplates[ i ]
                    .diagnosticTemplateTitle,
                id: this.templatesData.diagnosticTemplates[ i ]
                    .diagnosticTemplateId,
            });
            let groupsCount = this.templatesData.diagnosticTemplates[ i ]
                .groupsCount;
            for (let j = 0; j < groupsCount; j++) {
                let diagnostic = this.templatesData.diagnosticTemplates[ i ]
                    .groups[ j ];
                let id = diagnostic.groupId;
                let title = diagnostic.groupTitle;

                if (
                    this.planFilterOptions.findIndex(
                        elem => elem.title == title,
                    ) == -1
                ) {
                    this.planFilterOptions.push({
                        id:       id,
                        title:    title,
                        parentId: this.templatesData.diagnosticTemplates[ i ]
                            .diagnosticTemplateId,
                        parent: this.templatesData.diagnosticTemplates[ i ]
                            .diagnosticTemplateTitle,
                    });
                }

                this.groupsTitles.push({
                    id:       id,
                    title:    title,
                    parentId: this.templatesData.diagnosticTemplates[ i ]
                        .diagnosticTemplateId,
                    parent: this.templatesData.diagnosticTemplates[ i ]
                        .diagnosticTemplateTitle,
                });

                for (let k = 0; k < diagnostic.partsCount; k++) {
                    let part = diagnostic.parts[ k ];
                    let id = part.partId;
                    let title = part.partTitle;
                    this.partsTitles.push({
                        id:       id,
                        title:    title,
                        parentId: diagnostic.groupId,
                        parent:   diagnostic.groupTitle,
                    });
                }
            }
        }
        /*this.setState({
            groupsTitles: this.groupsTitles,
            partsTitles: this.partsTitles,
        });*/
    }

    async deleteRow(index) {
        let photo_index = this.photoKeys.findIndex(
            elem =>
                elem.partId == this.state.dataSource[ index ].partId &&
                elem.groupId == this.state.dataSource[ index ].groupId,
        );
        this.photoKeys.splice(photo_index, 1);
        await deleteDiagnosticProcess(
            this.props.orderId,
            this.state.dataSource[ index ].diagnosticTemplateId,
            this.state.dataSource[ index ].groupId,
            this.state.dataSource[ index ].partId,
            this.state.dataSource[ index ].templateIndex,
        );
        this.setState({
            selectedRows:                [],
            possibleRows:                [],
            checkedAll:                  false,
            headerCheckboxIndeterminate: false,
        });
        await this.getCurrentDiagnostic();
    }

    onCheckAll() {
        if (!this.state.checkedAll) {
            this.setState({
                checkedAll:                  true,
                selectedRows:                this.state.possibleRows,
                headerCheckboxIndeterminate: false,
            });
        } else {
            this.setState({
                checkedAll:                  false,
                selectedRows:                [],
                headerCheckboxIndeterminate: false,
            });
        }
        this.getCurrentDiagnostic();
    }

    async editSelectedRowsStatus(status) {
        for (let i = 0; i < this.state.selectedRows.length; i++) {
            let key = this.state.dataSource.findIndex(
                (element, index, array) => {
                    return element.key == this.state.selectedRows[ i ];
                },
            );
            if (key != -1) {
                await sendDiagnosticAnswer(
                    this.props.orderId,
                    this.state.dataSource[ key ].diagnosticTemplateId,
                    this.state.dataSource[ key ].groupId,
                    this.state.dataSource[ key ].partId,
                    this.state.dataSource[ key ].templateIndex,
                    status,
                    this.state.dataSource[ key ].commentary,
                );
            }
        }
        this.setState({
            selectedRows:                [],
            possibleRows:                [],
            checkedAll:                  false,
            headerCheckboxIndeterminate: false,
        });
        await this.getCurrentDiagnostic();
    }

    async deleteSelectedRows() {
        for (let i = 0; i < this.state.selectedRows.length; i++) {
            let key = this.state.dataSource.findIndex(
                elem => elem.key == this.state.selectedRows[ i ],
            );
            if (key != -1) {
                await deleteDiagnosticProcess(
                    this.props.orderId,
                    this.state.dataSource[ key ].diagnosticTemplateId,
                    this.state.dataSource[ key ].groupId,
                    this.state.dataSource[ key ].partId,
                    this.state.dataSource[ key ].templateIndex,
                );
            }
        }
        this.setState({
            selectedRows:                [],
            possibleRows:                [],
            checkedAll:                  false,
            headerCheckboxIndeterminate: false,
        });
        await this.getCurrentDiagnostic();
    }

    onChangeCheckbox(key) {
        const data = this.state.selectedRows;
        if (event.target.checked) {
            this.state.selectedRows.push(key);
        } else {
            let index = data.indexOf(key);
            this.state.selectedRows = data.filter((_, i) => i !== index);
        }
        let allchecked = this.state.selectedRows.length == this.state.rowsCount,
            indeterminate =
                this.state.selectedRows.length < this.state.rowsCount &&
                this.state.selectedRows.length > 0;
        this.setState({
            headerCheckboxIndeterminate: indeterminate,
            checkedAll:                  allchecked,
        });
        this.getCurrentDiagnostic();
    }

    setRowsColor() {
        let color, status;
        var rows = document.querySelectorAll(
            `.${Styles.diagnosticTable} tbody tr`,
        );
        for (
            let i = 0;
            i < rows.length && i < this.state.dataSource.length;
            i++
        ) {
            status = this.state.dataSource[ i ].status;
            color = '';
            if (status == 1) {
                color = 'rgb(200,225,180)';
            } else if (status == 2) {
                color = 'rgb(255,240,180)';
            } else if (status == 3) {
                color = 'rgb(250,175,175)';
            }
            rows[ i ].style.backgroundColor = color;
        }
    }

    filterDataSource(dataSource) {
        let data = dataSource;
        const {
            filterPlan,
            filterStage,
            filterStatus,
            filterCommentary,
            filterPhoto,
        } = this.state;
        if (filterPlan != null) { data = data.filter((data, i) => data.plan == filterPlan); }
        if (filterStage != null) { data = data.filter((data, i) => data.stage == filterStage); }
        if (filterStatus == 'OK') { data = data.filter((data, i) => data.status == 1); }
        if (filterStatus == 'BAD') { data = data.filter((data, i) => data.status == 2); }
        if (filterStatus == 'CRITICAL') { data = data.filter((data, i) => data.status == 3); }
        if (filterStatus == 'BAD&CRITICAL') {
            data = data.filter(
                (data, i) => data.status == 2 || data.status == 3,
            );
        }
        if (filterStatus == 'OPEN') { data = data.filter((data, i) => data.status == 0); }
        if (filterCommentary != null) { data = data.filter((data, i) => data.commentary.comment != null); }

        return data;
    }

    updateDataSource() {
        const disabled = this.props.disabled;
        this.ok = 0;
        this.bad = 0;
        this.critical = 0;
        this.open = 0;
        this.withCommentary = 0;
        this.withPhoto = 0;
        this.state.possibleRows = [];
        const { orderDiagnostic, orderId } = this.state;
        const dataSource = [];

        const diagnosticTemplatesCount = _.pick(orderDiagnostic, [ 'diagnosticTemplatesCount' ]).diagnosticTemplatesCount;
        const diagnosticTemplates = _.pick(orderDiagnostic, [ 'diagnosticTemplates' ]).diagnosticTemplates;
        let key = 1;
        for (let i = 0; i < diagnosticTemplatesCount; i++) {
            let groupsCount = _.pick(diagnosticTemplates[ i ], [ 'groupsCount' ])
                .groupsCount;
            let diagnosticTemplateTitle = _.pick(diagnosticTemplates[ i ], [ 'diagnosticTemplateTitle' ]).diagnosticTemplateTitle;
            let diagnosticTemplateId = _.pick(diagnosticTemplates[ i ], [ 'diagnosticTemplateId' ]).diagnosticTemplateId;
            let groups = _.pick(diagnosticTemplates[ i ], [ 'groups' ]).groups;
            for (let j = 0; j < groupsCount; j++) {
                let groupTitle = _.pick(groups[ j ], [ 'groupTitle' ]).groupTitle;
                let groupId = _.pick(groups[ j ], [ 'groupId' ]).groupId;
                let partsCount = _.pick(groups[ j ], [ 'partsCount' ]).partsCount;
                let parts = _.pick(groups[ j ], [ 'parts' ]).parts;
                for (let k = 0; k < partsCount; k++) {
                    let index = _.pick(parts[ k ], [ 'index' ]).index;
                    let partTitle = _.pick(parts[ k ], [ 'partTitle' ]).partTitle;
                    let actionTitle = _.pick(parts[ k ], [ 'actionTitle' ])
                        .actionTitle;
                    let partId = _.pick(parts[ k ], [ 'partId' ]).partId;
                    let answer = _.pick(parts[ k ], [ 'answer' ]).answer;
                    let calcDone = _.pick(parts[ k ], [ 'calcDone' ]).calcDone;
                    let comment = _.pick(parts[ k ], [ 'comment' ]).comment;
                    if (comment == null) {
                        comment = {
                            comment:   undefined,
                            positions: [],
                            problems:  [],
                            mm:        0,
                            percent:   0,
                            deg:       0,
                        };
                    }
                    let photo = this.photoKeys.find(
                        data =>
                            data.partId == partId && data.groupId == groupId,
                    );
                    photo = photo ? photo.photo : null;
                    dataSource.push({
                        templateIndex:        index,
                        key:                  key,
                        partId:               partId,
                        plan:                 diagnosticTemplateTitle,
                        stage:                groupTitle,
                        detail:               partTitle,
                        actionTitle:          actionTitle,
                        status:               answer,
                        commentary:           comment,
                        orderId:              orderId,
                        diagnosticTemplateId: diagnosticTemplateId,
                        groupId:              groupId,
                        photo:                photo,
                        disabled:             calcDone,
                    });
                    if (!calcDone) { this.state.possibleRows.push(key); }
                    key++;
                    if (answer == 0) { this.open++; }
                    if (answer == 1) { this.ok++; }
                    if (answer == 2) { this.bad++; }
                    if (answer == 3) { this.critical++; }
                }
            }
        }
        const filtredData = this.filterDataSource(dataSource);

        if (filtredData.length < dataSource.length) {
            const {
                filterPlan,
                filterStage,
                filterCommentary,
                filterPhoto,
            } = this.state;
            if (filterPlan || filterStage || filterCommentary || filterPhoto) {
                this.ok = 0;
                this.bad = 0;
                this.critical = 0;
                this.open = 0;
            }
            filtredData.map(data => {
                if (
                    filterPlan ||
                    filterStage ||
                    filterCommentary ||
                    filterPhoto
                ) {
                    if (data.status == 0) { this.open++; }
                    if (data.status == 1) { this.ok++; }
                    if (data.status == 2) { this.bad++; }
                    if (data.status == 3) { this.critical++; }
                }
                if (data.commentary.comment) { this.withCommentary++; }
            });
            /*filtredData.push({
                key: key,
                partId: "",
                plan: "",
                detail: "",
                actionTitle: "",
                stage: "",
                status: "",
                commentary: "",
                orderId: orderId,
                diagnosticTemplateId: "",
                groupId: "",
                photo: null,
                allTemplatesData: orderDiagnostic,
            },);*/
            this.state.possibleRows.push(key - 1);
            this.setState({
                dataSource: filtredData,
                rowsCount:  filtredData.length,
            });
        } else {
            dataSource.map(data => {
                if (data.commentary.comment) { this.withCommentary++; }
            });
            if (!disabled) {
                dataSource.push({
                    key:                  key,
                    partId:               '',
                    plan:                 '',
                    detail:               '',
                    actionTitle:          '',
                    stage:                '',
                    status:               '',
                    commentary:           '',
                    orderId:              orderId,
                    diagnosticTemplateId: '',
                    groupId:              '',
                    photo:                null,
                    allTemplatesData:     orderDiagnostic,
                });
            }
            this.state.possibleRows.push(key);

            this.setState({
                dataSource: dataSource,
                rowsCount:  key,
            });
        }
        //this.setRowsColor();
        this.setState({
            update: true,
        })
    }

    setPhoto(photo, groupId, partId) {
        const index = this.photoKeys.findIndex(
            data => data.partId == partId && data.groupId == groupId,
        );
        if (index > -1) {
            this.photoKeys[ index ].photo = photo;
        } else {
            this.photoKeys.push({
                partId:  partId,
                groupId: groupId,
                photo:   photo,
            });
        }
        this.updateDataSource();
    }

    componentWillMount() {
        var that = this;
        let token = localStorage.getItem('_my.carbook.pro_token');
        let url = API_URL;
        let params = '/diagnostics';
        url += params;

        fetch(url, {
            method:  'GET',
            headers: {
                Authorization: token,
            },
        })
            .then(function(response) {
                if (response.status !== 200) {
                    return Promise.reject(new Error(response.statusText));
                }

                return Promise.resolve(response);
            })
            .then(function(response) {
                return response.json();
            })
            .then(function(data) {
                that.templatesData = data;
                that.getTemplatesList();
                that.forceUpdate();
            })
            .catch(function(error) {
                console.log('error', error);
            });
    }

    componentDidMount() {
        if (!this.props.forbidden) {
            this._isMounted = true;
            this.getCurrentDiagnostic();
            //this.setRowsColor();
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    render() {
        const disabled = this.props.disabled;
        const columns = this.columns;
        return (
            <Catcher>
                <DiagnosticTableHeader
                    defaultEmployeeId={ this.props.defaultEmployeeId }
                    user={ this.props.user }
                    tecdocId={ this.props.tecdocId }
                    disabled={ disabled }
                    orderId={ this.props.orderId }
                    getCurrentDiagnostic={ this.getCurrentDiagnostic }
                    templatesTitles={ this.templatesTitles }
                    rowsCount={ this.state.rowsCount }
                    selectedRows={ this.state.selectedRows }
                    indeterminate={ this.state.headerCheckboxIndeterminate }
                    checkedAll={ this.state.checkedAll }
                    onCheckAll={ this.onCheckAll }
                    addNewDiagnostic={ this.addNewDiagnostic }
                    deleteDiagnostic={ this.deleteDiagnostic }
                    editSelectedRowsStatus={ this.editSelectedRowsStatus }
                    deleteSelectedRows={ this.deleteSelectedRows }
                    dataSource={ this.state.dataSource }
                    orderServices={ this.props.orderServices }
                    orderDetails={ this.props.orderDetails }
                    updateTabs={ this.props.updateTabs }
                    reloadOrderPageComponents={
                        this.props.reloadOrderPageComponents
                    }
                    labors={ this.props.labors }
                    details={ this.props.details }
                    action={ this.props.action }
                />
                <Table
                    loading={false}
                    className={
                        !disabled
                            ? Styles.diagnosticTable
                            : Styles.diagnosticTableDisabled
                    }
                    rowClassName={ (elem, i) => {
                        return `${Styles[`tableRowStatus${elem.status}`]} ${elem.disabled && Styles.diagnosticTableDisabled}`
                    } }
                    dataSource={ this.state.dataSource }
                    columns={ columns }
                    locale={ {
                        emptyText: <FormattedMessage id='no_data' />,
                    } }
                    pagination={ false }
                    scroll={ { y: 540 } }
                />
            </Catcher>
        );
    }
}

export default DiagnosticTable;

@injectIntl
class DiagnosticTableHeader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            indeterminate: props.indeterminate,
            checked:       props.checkedAll,
            selectValue:   undefined,
            dataSource:    props.dataSource,
        };
    }

    handleClickCheckbox() {
        this.setState({
            checked: !this.state.checked,
        });
    }

    handleClickStatusButtons(status) {
        {
            this.props.editSelectedRowsStatus(status);
        }
    }

    handleClickDeleteButton() {
        {
            this.props.deleteSelectedRows();
        }
    }

    updateState() {
        this.state.checked = this.props.checkedAll;
        this.state.indeterminate = this.props.indeterminate;
        this.state.dataSource = this.props.dataSource;
    }

    componentWillUpdate() {
        this.updateState();
    }

    render() {
        const { Option } = Select;
        const { disabled } = this.props;

        return (
            <div className={ Styles.diagnosticTableHeader }>
                <div style={ { width: '5%', padding: '5px 15px' } }>
                    <Checkbox
                        disabled={ disabled }
                        checked={ this.state.checked }
                        indeterminate={ this.state.indeterminate }
                        onChange={ this.props.onCheckAll }
                        onClick={ () => this.handleClickCheckbox() }
                    />
                </div>
                <div style={ { width: '15%' } }>
                    <Select
                        disabled={ disabled }
                        allowClear
                        value={ this.state.selectValue }
                        showSearch
                        placeholder={
                            <FormattedMessage id='order_form_table.diagnostic.plan' />
                        }
                        onChange={ () => {
                            this.setState({
                                selectValue: event.target.innerText,
                            });
                        } }
                    >
                        { this.props.templatesTitles.map((template, i) => (
                            <Option key={ i + 1 } value={ template.id }>
                                { template.title }
                            </Option>
                        )) }
                    </Select>
                </div>
                <div style={ { width: '15%' } }>
                    <Button
                        disabled={ disabled }
                        onClick={ () => {
                            this.props.addNewDiagnostic(this.state.selectValue);
                            this.setState({ selectValue: undefined });
                        } }
                    >
                        <FormattedMessage id='+' />
                    </Button>
                    <Button
                        disabled={ disabled }
                        onClick={ () => {
                            this.props.deleteDiagnostic(this.state.selectValue);
                            this.setState({ selectValue: undefined });
                        } }
                    >
                        <FormattedMessage id='-' />
                    </Button>
                </div>
                <div style={ { width: '35%' } }>
                    <ConfirmDiagnosticModal
                        defaultEmployeeId={ this.props.defaultEmployeeId }
                        user={ this.props.user }
                        tecdocId={ this.props.tecdocId }
                        disabled={ disabled }
                        orderId={ this.props.orderId }
                        isMobile={ false }
                        dataSource={ this.state.dataSource.slice(0) }
                        orderServices={ this.props.orderServices }
                        orderDetails={ this.props.orderDetails }
                        getCurrentDiagnostic={ this.props.getCurrentDiagnostic }
                        updateTabs={ this.props.updateTabs }
                        reloadOrderPageComponents={
                            this.props.reloadOrderPageComponents
                        }
                        labors={ this.props.labors }
                        details={ this.props.details }
                        action={ this.props.action }
                    />
                </div>
                <div style={ { width: '10%' } }>
                    <Button
                        disabled={ disabled }
                        type='primary'
                        onClick={ () => {
                            this.handleClickStatusButtons(0);
                        } }
                        style={ { width: '80%', padding: 0 } }
                    >
                        <FormattedMessage id='order_form_table.diagnostic.status.edit' />
                    </Button>
                </div>
                <div
                    className={ Styles.diagnostic_status_button_wrap }
                    style={ { width: '15%' } }
                >
                    <Button
                        disabled={ disabled }
                        className={ Styles.diagnostic_status_button }
                        onClick={ () => {
                            this.handleClickStatusButtons(1);
                        } }
                        style={ { background: 'var(--green)' } }
                        title={ this.props.intl.formatMessage({
                            id: 'order_form_table.diagnostic.ok_title',
                        }) }
                    >
                        <FormattedMessage id='order_form_table.diagnostic.status.ok' />
                    </Button>
                    <Button
                        disabled={ disabled }
                        className={ Styles.diagnostic_status_button }
                        onClick={ () => {
                            this.handleClickStatusButtons(2);
                        } }
                        style={ { background: 'rgb(255, 255, 0)' } }
                        title={ this.props.intl.formatMessage({
                            id: 'order_form_table.diagnostic.replace_title',
                        }) }
                    >
                        <FormattedMessage id='order_form_table.diagnostic.status.bad' />
                    </Button>
                    <Button
                        disabled={ disabled }
                        className={ Styles.diagnostic_status_button }
                        type='danger'
                        onClick={ () => {
                            this.handleClickStatusButtons(3);
                        } }
                        style={ {
                            background: 'rgb(255, 126, 126)',
                            color:      'rgba(0, 0, 0, 0.65)',
                        } }
                        title={ this.props.intl.formatMessage({
                            id: 'order_form_table.diagnostic.critical_title',
                        }) }
                    >
                        <FormattedMessage id='order_form_table.diagnostic.status.critical' />
                    </Button>
                </div>
                <div
                    className={ Styles.delete_diagnostic_button_wrap }
                    style={ { width: '5%' } }
                >
                    <Icon
                        type='delete'
                        className={
                            !disabled
                                ? Styles.delete_diagnostic_button
                                : Styles.delete_diagnostic_button_disabled
                        }
                        onClick={ () => {
                            this.handleClickDeleteButton();
                        } }
                    />
                </div>
            </div>
        );
    }
}

@injectIntl
class DiagnosticStatusButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            status: props.status,
        };
    }
    setColor() {
        let color = '';
        if (this.state.status == 1) {
            color = 'rgb(200,225,180)';
        } else if (this.state.status == 2) {
            color = 'rgb(255,240,180)';
        } else if (this.state.status == 3) {
            color = 'rgb(250,175,175)';
        }

        ReactDOM.findDOMNode(
            this,
        ).parentNode.parentNode.style.backgroundColor = color;
    }

    componentDidMount() {
        {
            this.setColor();
        }
    }

    componentDidUpdate() {
        {
            this.setColor();
        }
    }

    updateState() {
        this.state.status = this.props.status;
    }

    componentWillUpdate() {
        this.updateState();
    }

    handleClick = async status => {
        const { rowProp } = this.props;
        await sendDiagnosticAnswer(
            rowProp.orderId,
            rowProp.diagnosticTemplateId,
            rowProp.groupId,
            rowProp.partId,
            rowProp.templateIndex,
            status,
            rowProp.commentary,
        );
        await this.props.getCurrentDiagnostic();
    };
    render() {
        const { status } = this.state;
        const { disabled, rowProp } = this.props;

        if (!rowProp.partId) {
            return (
                <div className={ Styles.diagnostic_status_button_wrap }>
                    <Button
                        disabled
                        className={ Styles.diagnostic_status_button_edit }
                        type='primary'
                    >
                        <FormattedMessage id='order_form_table.diagnostic.status.edit' />
                    </Button>
                </div>
            );
        }

        return status > 0 ? (
            <div className={ Styles.diagnostic_status_button_wrap }>
                <Button
                    disabled={ disabled }
                    className={ Styles.diagnostic_status_button_edit }
                    type='primary'
                    onClick={ () => this.handleClick(0) }
                >
                    <FormattedMessage id='order_form_table.diagnostic.status.edit' />
                </Button>
            </div>
        ) : (
            <div className={ Styles.diagnostic_status_button_wrap }>
                <Button
                    disabled={ disabled }
                    className={ Styles.diagnostic_status_button }
                    onClick={ () => this.handleClick(1) }
                    style={ { background: 'var(--green)' } }
                    title={ this.props.intl.formatMessage({
                        id: 'order_form_table.diagnostic.ok_title',
                    }) }
                >
                    <FormattedMessage id='order_form_table.diagnostic.status.ok' />
                </Button>
                <Button
                    disabled={ disabled }
                    className={ Styles.diagnostic_status_button }
                    onClick={ () => this.handleClick(2) }
                    style={ { background: 'rgb(255, 255, 0)' } }
                    title={ this.props.intl.formatMessage({
                        id: 'order_form_table.diagnostic.replace_title',
                    }) }
                >
                    <FormattedMessage id='order_form_table.diagnostic.status.bad' />
                </Button>
                <Button
                    disabled={ disabled }
                    className={ Styles.diagnostic_status_button }
                    type='danger'
                    onClick={ () => this.handleClick(3) }
                    style={ {
                        background: 'rgb(255, 126, 126)',
                        color:      'rgba(0, 0, 0, 0.65)',
                    } }
                    title={ this.props.intl.formatMessage({
                        id: 'order_form_table.diagnostic.critical_title',
                    }) }
                >
                    <FormattedMessage id='order_form_table.diagnostic.status.critical' />
                </Button>
            </div>
        );
    }
}

@injectIntl
class CommentaryButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading:                false,
            visible:                false,
            currentCommentaryProps: {
                name:      props.rowProp.detail,
                positions: [],
                problems:  [],
                params:    {
                    mm:      0,
                    percent: 0,
                    deg:     0,
                },
            },
            currentCommentary: undefined,
        };
        this.commentaryInput = React.createRef();
        this.positions = [
            'front_axle',
            'ahead',
            'overhead',
            'rear_axle',
            'behind',
            'down_below',
            'Right_wheel',
            'on_right',
            'outside',
            'left_wheel',
            'left',
            'inside',
            'lever_arm',
            'at_both_sides',
            'centered',
        ];
        this.problems = [];
        this.params = [{ name: 'mm', symbol: 'mm' }, { name: 'percent', symbol: '%' }, { name: 'deg', symbol: '°' }];
        this._isMounted = false;
    }

    showModal = async () => {
        const { commentary, rowProp } = this.props;
        await getPartProblems(rowProp.partId, data => {
            this.problems = data.map(elem => {
                return {
                    label: elem.description,
                    value: elem.code,
                };
            });
        });
        await this.setState({
            currentCommentary:      commentary.comment,
            currentCommentaryProps: {
                name:      rowProp.detail,
                positions: commentary.positions || [],
                problems:  commentary.problems || [],
                params:    {
                    mm:      commentary.mm || 0,
                    percent: commentary.percent || 0,
                    deg:     commentary.deg || 0,
                },
            },
            visible: true,
        });
        if (this.commentaryInput.current != undefined) {
            this.commentaryInput.current.focus();
        }
    };

    handleOk = async () => {
        const { currentCommentary, currentCommentaryProps } = this.state;
        this.setState({
            loading: true,
        });
        const { rowProp } = this.props;
        await sendDiagnosticAnswer(
            rowProp.orderId,
            rowProp.diagnosticTemplateId,
            rowProp.groupId,
            rowProp.partId,
            rowProp.templateIndex,
            rowProp.status,
            {
                comment:   currentCommentary,
                positions: currentCommentaryProps.positions,
                problems:  currentCommentaryProps.problems,
                mm:        currentCommentaryProps.params.mm,
                percent:   currentCommentaryProps.params.percent,
                deg:       currentCommentaryProps.params.deg,
            },
        );
        await this.props.getCurrentDiagnostic();
        setTimeout(() => {
            this.setState({ loading: false, visible: false });
        }, 500);
    };

    handleCancel = () => {
        this.setState({
            visible:           false,
            currentCommentary: null,
        });
    };

    renderHeader = () => {
        const { currentCommentaryProps } = this.state;
        const { problems } = this;

        return (
            <div>
                <p>{ this.props.rowProp.detail }</p>
                <p
                    style={ {
                        fontSize:   '16px',
                        fontStyle:  'italic',
                        fontWeight: 'normal',
                    } }
                >
                    { //this.props.rowProp.actionTitle
                        currentCommentaryProps.problems.map((data, index) => {
                            const punctuation =
                            index == currentCommentaryProps.problems.length - 1
                                ? ''
                                : ',';
                            const problemLable = problems.find(
                                problem => problem.value == data,
                            );

                            return ` ${
                                problemLable
                                    ? problemLable.label.toLowerCase()
                                    : null
                            }${punctuation}`;
                        }) }
                </p>
            </div>
        );
    };

    getCommentary() {
        const { currentCommentaryProps } = this.state;
        const { problems, params } = this;
        const paramsValue = Object.entries(currentCommentaryProps.params).map(
            (pair, key) => {
                if (pair[ 1 ] !== 0) { return ` ${pair[ 1 ]}${params[ key ].symbol}`; }
            },
        );
        const isParamsSet = paramsValue.some(param => !_.isNil(param));
        var currentCommentary = this.props.rowProp.detail;

        if (
            currentCommentaryProps.positions.length ||
            currentCommentaryProps.problems.length ||
            isParamsSet
        ) {
            currentCommentary += ' -';
            if (currentCommentaryProps.positions.length) {
                currentCommentary +=
                    currentCommentaryProps.positions.map(
                        data =>
                            ` ${this.props.intl
                                .formatMessage({ id: data })
                                .toLowerCase()}`,
                    ) + ';';
            }
            if (currentCommentaryProps.problems.length) {
                currentCommentary +=
                    currentCommentaryProps.problems.map(data => {
                        return ` ${problems
                            .find(problem => problem.value == data)
                            .label.toLowerCase()}`;
                    }) + ';';
            }
            if (isParamsSet) {
                currentCommentary +=
                    paramsValue.filter(param => !_.isNil(param)) + ';';
            }
        }
        this.setState({
            currentCommentary: currentCommentary,
        });
    }

    setCommentaryPosition(position) {
        const { currentCommentaryProps } = this.state;
        const positionIndex = currentCommentaryProps.positions.indexOf(
            position,
        );
        if (positionIndex == -1) {
            currentCommentaryProps.positions.push(position);
        } else {
            currentCommentaryProps.positions = currentCommentaryProps.positions.filter(
                (value, index) => index != positionIndex,
            );
        }
        this.getCommentary();
    }

    setCommentaryProblems(value) {
        const { currentCommentaryProps } = this.state;
        const problemIndex = currentCommentaryProps.problems.indexOf(value);
        if (problemIndex == -1) {
            currentCommentaryProps.problems.push(value);
        } else {
            currentCommentaryProps.problems = currentCommentaryProps.problems.filter(
                (value, index) => index != problemIndex,
            );
        }
        this.getCommentary();
    }

    setCommetaryParams(param, value) {
        const { currentCommentaryProps } = this.state;
        currentCommentaryProps.params[ param ] = value;
        this.getCommentary();
    }

    async componentDidMount() {
        this._isMounted = true;
        const { currentCommentaryProps } = this.state;
        const { commentary, rowProp } = this.props;
        if (!this.problems.length && this.props.rowProp.partId) {
            if (this._isMounted) {
                this.setState({
                    currentCommentaryProps: {
                        name:      rowProp.detail,
                        positions: commentary.positions || [],
                        problems:  commentary.problems || [],
                        params:    {
                            mm:      commentary.mm || 0,
                            percent: commentary.percent || 0,
                            deg:     commentary.deg || 0,
                        },
                    },
                });
            }
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    render() {
        const { TextArea } = Input;
        const {
            visible,
            loading,
            currentCommentaryProps,
            currentCommentary,
        } = this.state;
        const { disabled, commentary } = this.props;
        const { positions, problems, params } = this;

        const defaultProblems = commentary.problems ? commentary.problems : [];

        return (
            <div>
                { commentary.comment ? (
                    <Button
                        className={ Styles.commentaryButton }
                        onClick={ this.showModal }
                        title={ this.props.intl.formatMessage({
                            id: 'commentary.edit',
                        }) }
                    >
                        <Icon
                            className={ Styles.commentaryButtonIcon }
                            style={ { color: 'rgba(0, 0, 0, 0.65)' } }
                            type='form'
                        />
                    </Button>
                ) : (
                    <Button
                        disabled={ disabled }
                        type='primary'
                        onClick={ this.showModal }
                        title={ this.props.intl.formatMessage({
                            id: 'commentary.add',
                        }) }
                    >
                        <Icon type='message' />
                    </Button>
                ) }
                <Modal
                    visible={ visible }
                    title={ this.renderHeader() }
                    onOk={ this.handleOk }
                    onCancel={ this.handleCancel }
                    footer={
                        disabled
                            ? null
                            : [
                                <Button
                                    key='back'
                                    onClick={ this.handleCancel }
                                >
                                    { <FormattedMessage id='cancel' /> }
                                </Button>,
                                <Button
                                    key='submit'
                                    type='primary'
                                    loading={ loading }
                                    onClick={ this.handleOk }
                                >
                                    { <FormattedMessage id='save' /> }
                                </Button>,
                            ]
                    }
                >
                    <>
                        <div className={ Styles.commentaryVehicleSchemeWrap }>
                            <p className={ Styles.commentarySectionHeader }>
                                <FormattedMessage id='commentary_modal.where' />
                                ?
                            </p>
                            <div className={ Styles.blockButtonsWrap }>
                                { positions.map((position, key) => {
                                    const disabledClass =
                                        disabled &&
                                        currentCommentaryProps.positions.findIndex(
                                            elem => position == elem,
                                        ) > -1
                                            ? Styles.disabledCommentaryProp
                                            : '';

                                    return (
                                        <Button
                                            key={ key }
                                            type={
                                                currentCommentaryProps.positions.findIndex(
                                                    elem => position == elem,
                                                ) > -1
                                                    ? 'normal'
                                                    : 'primary'
                                            }
                                            className={ `${Styles.commentaryBlockButton} ${disabledClass}` }
                                            onClick={ () => {
                                                this.setCommentaryPosition(
                                                    position,
                                                );
                                            } }
                                            disabled={ disabled }
                                        >
                                            <FormattedMessage id={ position } />
                                        </Button>
                                    );
                                }) }
                            </div>
                        </div>
                        <div className={ Styles.commentaryVehicleSchemeWrap }>
                            <p className={ Styles.commentarySectionHeader }>
                                <FormattedMessage id='commentary_modal.what' />?
                            </p>
                            <div className={ Styles.blockButtonsWrap }>
                                { problems.map((problem, key) => {
                                    const disabledClass =
                                        disabled &&
                                        currentCommentaryProps.problems.findIndex(
                                            elem => problem.value == elem,
                                        ) > -1
                                            ? Styles.disabledCommentaryProp
                                            : '';

                                    return (
                                        <Button
                                            disabled={ disabled }
                                            key={ key }
                                            type={
                                                currentCommentaryProps.problems.findIndex(
                                                    elem =>
                                                        problem.value == elem,
                                                ) > -1
                                                    ? 'normal'
                                                    : 'primary'
                                            }
                                            className={ `${Styles.commentaryBlockButton} ${disabledClass}` }
                                            onClick={ () => {
                                                this.setCommentaryProblems(
                                                    problem.value,
                                                );
                                            } }
                                        >
                                            <span>
                                                { problem.label[ 0 ].toUpperCase() +
                                                    problem.label
                                                        .toLowerCase()
                                                        .slice(1) }
                                            </span>
                                        </Button>
                                    );
                                }) }
                            </div>
                        </div>
                        <div className={ Styles.commentaryVehicleSchemeWrap }>
                            <p className={ Styles.commentarySectionHeader }>
                                <FormattedMessage id='commentary_modal.parameters' />
                            </p>
                            <div className={ Styles.blockButtonsWrap }>
                                { params.map((param, key) => {
                                    return (
                                        <InputNumber
                                            disabled={ disabled }
                                            key={ key }
                                            className={ `${
                                                Styles.commentaryBlockButton
                                            } ${
                                                disabled
                                                    ? Styles.disabledCommentaryProp
                                                    : ''
                                            }` }
                                            value={
                                                currentCommentaryProps.params[
                                                    param.name
                                                ]
                                            }
                                            formatter={ value =>
                                                `${value} ${param.symbol}`
                                            }
                                            parser={ value =>
                                                value.replace(
                                                    ` ${param.symbol}`,
                                                    '',
                                                )
                                            }
                                            onChange={ value => {
                                                this.setCommetaryParams(
                                                    param.name,
                                                    value,
                                                );
                                            } }
                                        />
                                    );
                                }) }
                            </div>
                        </div>
                        <div>
                            <p className={ Styles.commentarySectionHeader }>
                                <FormattedMessage id='order_form_table.diagnostic.commentary' />
                            </p>
                            <TextArea
                                disabled={ disabled }
                                className={
                                    disabled
                                        ? Styles.disabledCommentaryProp
                                        : ''
                                }
                                value={ currentCommentary }
                                placeholder={ `${this.props.intl.formatMessage({
                                    id: 'comment',
                                })}...` }
                                autoFocus
                                onChange={ () => {
                                    this.setState({
                                        currentCommentary: event.target.value,
                                    });
                                } }
                                style={ {
                                    width:     '100%',
                                    minHeight: '150px',
                                    resize:    'none',
                                } }
                                ref={ this.commentaryInput }
                            />
                        </div>
                    </>
                </Modal>
            </div>
        );
    }
}

class PhotoButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            visible: false,
            photo:   props.photo,
            upload:  null,
        };
    }

    componentDidMount() {
        //this.getPhoto();
    }

    getPhoto() {
        const { rowProp } = this.props;
        var that = this;
        let token = localStorage.getItem('_my.carbook.pro_token');
        let url = API_URL;
        let params = `/orders/diagnostics/part?orderId=${rowProp.orderId}&templateId=${rowProp.diagnosticTemplateId}&groupId=${rowProp.groupId}&partId=${rowProp.partId}`;
        url += params;

        fetch(url, {
            method:  'GET',
            headers: {
                Authorization: token,
            },
        })
            .then(function(response) {
                if (response.status !== 200) {
                    return Promise.reject(new Error(response.statusText));
                }

                return Promise.resolve(response);
            })
            .then(function(response) {
                return response.json();
            })
            .then(function(data) {
                that.props.setPhoto(
                    data.photos,
                    rowProp.groupId,
                    rowProp.partId,
                );
            })
            .catch(function(error) {
                console.log('error', error);
            });
    }

    showModal = () => {
        this.setState({
            visible: true,
        });
    };

    handleOk = async () => {
        this.setState({ loading: true });
        const { rowProp } = this.props;
        await sendDiagnosticAnswer(
            rowProp.orderId,
            rowProp.diagnosticTemplateId,
            rowProp.groupId,
            rowProp.partId,
            rowProp.status,
            rowProp.commentary,
            this.state.upload,
        );
        await this.setState({ loading: false, visible: false });
        await this.getPhoto();
        await this.props.getCurrentDiagnostic();
    };

    handleCancel = () => {
        this.setState({
            visible: false,
        });
    };

    render() {
        /*this.state.photo = this.props.photo;
        const { visible, loading, photo } = this.state;
        const { disabled, rowProp } = this.props;
        if(!rowProp.partId) {
            return (
                <Button
                    disabled
                    type="primary"
                    onClick={this.showModal}
                >
                    <Icon type="message" />
                </Button>
            )
        }
        if(photo === null) {
            if(this.props.rowProp.partId) {
                this.getPhoto();
            }*/
        return (
            <div>
                <Button type='primary' disabled>
                    <Icon type={ 'camera' } />
                </Button>
            </div>
        );
        /*}
        var fileList = [];
        if(photo.length > 0) {
            photo.map((data, index)=>{
                fileList.push({
                    uid: index*-1,
                    name: index+1+".img",
                    status: 'done',
                    url: data,
                    thumbUrl: data,
                });
            });
        }
        return (
            <div>
                <Button
                    disabled={disabled}
                    type={photo.length==0?"primary":""}
                    onClick={this.showModal}
                >
                    <Icon type={photo.length==0?"camera":"file-image"} />
                </Button>
                <Modal
                    visible={visible}
                    title={<FormattedMessage id='order_form_table.diagnostic.photo' />}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    footer={[
                        <Button key="back" onClick={this.handleCancel}>
                            {<FormattedMessage id='cancel' />}
                        </Button>,
                        <Button key="submit" type="primary" loading={loading} onClick={this.handleOk}>
                            {<FormattedMessage id='save' />}
                        </Button>,
                    ]}
                    >
                    <Upload 
                        listType='picture'
                        defaultFileList={[...fileList]}
                        beforeUpload={file => {
                            const reader = new FileReader();
                            reader.onload = e => {
                                this.state.upload = e.target.result;
                            };
                            reader.readAsDataURL(file);
                            return false;
                        }}
                    >
                        <Button>
                            <Icon type="upload" />
                            <FormattedMessage id='upload' />
                        </Button>
                    </Upload>
                </Modal>
            </div>
        );*/
    }
}

@injectIntl
class DeleteProcessButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            deleted: false,
        };
    }

    handleClick = () => {
        const { rowProp } = this.props;
        if (rowProp.partId) {
            deleteDiagnosticProcess(
                rowProp.orderId,
                rowProp.diagnosticTemplateId,
                rowProp.groupId,
                rowProp.partId,
                rowProp.templateIndex,
            );
            this.props.deleteRow(this.props.rowProp.key - 1);
            this.setState({ deleted: true });
        }
    };

    render() {
        const { disabled, rowProp } = this.props;

        return (
            <div
                className={ Styles.delete_diagnostic_button_wrap }
                style={ { width: '5%' } }
            >
                <Popconfirm
                    disabled={ disabled }
                    type='warning'
                    title={
                        <FormattedMessage id='add_order_form.delete_confirm' />
                    }
                    onConfirm={ this.handleClick }
                >
                    <Icon
                        type='delete'
                        className={
                            !disabled
                                ? Styles.delete_diagnostic_button
                                : Styles.delete_diagnostic_button_disabled
                        }
                    />
                </Popconfirm>
            </div>
        );
    }
}
