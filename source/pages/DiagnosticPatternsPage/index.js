// vendor
import React, { Component } from "react";
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import {
    Table,
    Button,
    Icon,
    Checkbox,
    Select,
    Input,
    InputNumber,
    AutoComplete,
    Switch,
    Modal
} from 'antd';

// proj
import { Layout, Spinner } from 'commons';
import { DiagnosticPatternsContainer } from 'containers';
import {
    API_URL
} from 'core/forms/orderDiagnosticForm/saga';

// own
import Styles from './styles.m.css';

@injectIntl
@withRouter

class DiagnosticPatternsPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            currentKey: null,
            diagnosticParts: [],
            masterDiagnosticParts: [],
            filterPlan: null,
            filterGroup: null,
            filterName: null,
            filterCode: null,
        };
        this.columns = [
            {
                title:     '#',
                dataIndex: 'key',
                key:       'key',
                width:     '5%',
                render:    (key)=>(key+1),
            },
            {
                title:  ()=>{
                    return (
                        <div>
                            <FormattedMessage id="diagnostic-page.plan" />
                            <Input
                                allowClear
                                style={{minWidth: "100px"}}
                                placeholder={this.props.intl.formatMessage({id: 'diagnostic-page.plan'})}
                                value={this.state.filterPlan}
                                onChange={(event)=>{
                                    this.setState({
                                        filterPlan: event.target.value,
                                    });
                                }}
                            />
                        </div>
                    )
                },
                dataIndex: 'diagnosticTemplateTitle',
                key:       'diagnosticTemplateTitle',
                width:     '25%',
                render: (data, elem)=>{
                    const key = elem.key;
                    return (
                        <Input
                            style={{minWidth: "100px"}}
                            placeholder={this.props.intl.formatMessage({id: 'diagnostic-page.plan'})}
                            value={data}
                            onChange={(event)=>{
                                this.state.diagnosticParts[key].diagnosticTemplateTitle = event.target.value;
                                this.setState({
                                    update: true,
                                });
                            }}
                        />
                    )
                }
            },
            {
                title:  ()=>{
                    return (
                        <div>
                            <FormattedMessage id="diagnostic-page.group" />
                            <Input
                                allowClear
                                style={{minWidth: "100px"}}
                                placeholder={this.props.intl.formatMessage({id: 'diagnostic-page.group'})}
                                value={this.state.filterGroup}
                                onChange={(event)=>{
                                    this.setState({
                                        filterGroup: event.target.value,
                                    });
                                }}
                            />
                        </div>
                    )
                },
                dataIndex: 'groupTitle',
                key:       'groupTitle',
                width:     '25%',
                render: (data, elem)=>{
                    const key = elem.key;
                    return (
                        <Input
                            style={{minWidth: "100px"}}
                            value={data}
                            placeholder={this.props.intl.formatMessage({id: 'diagnostic-page.group'})}
                            onChange={(event)=>{
                                this.state.diagnosticParts[key].groupTitle = event.target.value;
                                this.setState({
                                    update: true,
                                });
                            }}
                        />
                    )
                }
            },
            {
                title:  ()=>{
                    return (
                        <div>
                            <FormattedMessage id="diagnostic-page.code" />
                            <Input
                                allowClear
                                placeholder={this.props.intl.formatMessage({id: 'diagnostic-page.code'})}
                                value={this.state.filterCode}
                                onChange={(event)=>{
                                    this.setState({
                                        filterCode: event.target.value
                                    })
                                }}
                            />
                        </div>
                    )
                },
                dataIndex: 'partId',
                key:       'partId',
                width:     '10%',
                render: (data, elem)=>{
                    const key = elem.key
                    return(
                        <Button
                            type='primary'
                            onClick={()=>{
                                this.setState({
                                    currentKey: key,
                                    visible: true,
                                })
                            }}
                        >
                            {data ? data : <FormattedMessage id="select" />}
                        </Button>
                    )
                },
            },
            {
                title:  ()=>{
                    return (
                        <div>
                            <FormattedMessage id="diagnostic-page.name" />
                            <Input
                                allowClear
                                placeholder={this.props.intl.formatMessage({id: 'diagnostic-page.name'})}
                                value={this.state.filterName}
                                onChange={(event)=>{
                                    this.setState({
                                        filterName: event.target.value
                                    })
                                }}
                            />
                        </div>
                    )
                },
                dataIndex: 'partTitle',
                key:       'partTitle',
                width:     '30%',
                render: (data)=>{
                    return(
                        <span>{data ? data : <FormattedMessage id="long_dash" />}</span>
                    )
                },
            },
            {
                key:       'delete',
                width:     '5%',
                render: (elem)=>{
                    const key = elem.key
                    return(
                        <Icon
                            type='delete'
                            onClick={()=>{
                                this.state.diagnosticParts[key].deleted = true;
                                this.setState({
                                    update: true,
                                })
                            }}
                        />
                    )
                },
            },
        ]

        this.modalColumns = [
            {
                title:     'ID',
                key:       'partId',
                dataIndex: 'partId',
                width:     '20%',
            },
            {
                title:     <FormattedMessage id="diagnostic-page.name" />,
                key:       'partTitle',
                dataIndex: 'partTitle',
                width:     '40%',
            },
            {
                title:     <FormattedMessage id="diagnostic-page.action" />,
                key:       'actionTitle',
                dataIndex: 'actionTitle',
                width:     '30%',
            },
            {
                key:       'save',
                render: (elem)=>{
                    const key = this.state.currentKey;
                    return(
                        <Button
                            type='primary'
                            onClick={()=>{
                                this.state.diagnosticParts[key].partId = elem.partId;
                                this.state.diagnosticParts[key].partTitle = elem.partTitle;
                                this.setState({
                                    visible: false
                                })
                            }}
                        >
                            <Icon
                                type='check'
                            />
                        </Button>
                    )
                },
            },
        ]
    }

    handleCancel() {
        this.setState({
            visible: false,
        })
    }

    handleOk() {
        this.setState({
            visible: false,
        })
    }

    saveDiagnostic() {
        var resultData = [];
        this.state.diagnosticParts.map((part)=>{
            if(part.diagnosticTemplateTitle && part.groupTitle && part.partId) {
                let templateIndex = resultData.findIndex((elem)=>elem.diagnosticTemplateTitle==part.diagnosticTemplateTitle);
                if(templateIndex == -1) {
                    resultData.push({
                        diagnosticTemplateId: part.diagnosticTemplateId,
                        diagnosticTemplateTitle: part.diagnosticTemplateTitle,
                        groups: [],
                    })
                }
            }
        })
        this.state.diagnosticParts.map((part)=>{
            if(part.diagnosticTemplateTitle && part.groupTitle && part.partId) {
                let templateIndex = resultData.findIndex((elem)=>elem.diagnosticTemplateTitle==part.diagnosticTemplateTitle);
                let groupIndex = resultData[templateIndex].groups.findIndex((elem)=>elem.groupTitle==part.groupTitle);
                if(groupIndex == -1) {
                    resultData[templateIndex].groups.push({
                        groupId: part.groupId,
                        groupTitle: part.groupTitle,
                        partIds: [],
                    })
                }
            }
        })
        this.state.diagnosticParts.map((part)=>{
                if(part.diagnosticTemplateTitle && part.groupTitle && part.partId) {
                let templateIndex = resultData.findIndex((elem)=>elem.diagnosticTemplateTitle==part.diagnosticTemplateTitle);
                let groupIndex = resultData[templateIndex].groups.findIndex((elem)=>elem.groupTitle==part.groupTitle);
                if(!part.deleted) resultData[templateIndex].groups[groupIndex].partIds.push(part.partId);
            }
        })

        let token = localStorage.getItem('_my.carbook.pro_token');
        let url = API_URL;
        let params = `/diagnostics`;
        url += params;
        fetch(url, {
            method: 'PUT',
            headers: {
                'Authorization': token,
            },
            body: JSON.stringify(resultData),
        })
        .then(function (response) {
            if (response.status !== 200) {
            return Promise.reject(new Error(response.statusText))
            }
            return Promise.resolve(response)
        })
        .then(function (response) {
            return response.json()
        })
        .then(function (data) {
            window.location.reload();
        })
        .catch(function (error) {
            console.log('error', error)
        });
    }

    importDefaultDiagnostics() {
        const title = this.props.intl.formatMessage({id: 'agreement.confirm_title'});
        const content = this.props.intl.formatMessage({id: 'agreement.confirm_content'});
        const { confirm } = Modal;
        confirm({
            title: title,
            content: content,
            onOk: async ()=>{
                let token = localStorage.getItem('_my.carbook.pro_token');
                let url = API_URL;
                let params = `/diagnostics/standard`;
                url += params;
            
                await fetch(url, {
                        method: 'COPY',
                        headers: {
                            'Authorization': token,
                        }
                    });
                await window.location.reload();
            },
            onCancel: ()=>{console.log('Canceled')},
        });
    }

    componentWillMount() {
        var that = this;
        let token = localStorage.getItem('_my.carbook.pro_token');
        let url = API_URL;
        let params = `/diagnostics?keepFlat=true`;
        url += params;
    
        fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': token,
            }
        })
        .then(function (response) {
            if (response.status !== 200) {
            return Promise.reject(new Error(response.statusText))
            }
            return Promise.resolve(response)
        })
        .then(function (response) {
            return response.json()
        })
        .then(function (data) {
            data.diagnosticParts.map((elem, index)=>elem.key=index);
            that.setState({
                diagnosticParts: data.diagnosticParts,
            });
        })
        .catch(function (error) {
            console.log('error', error)
        })

        params = `/diagnostics/master?keepFlat=true`;
        url = API_URL + params;
    
        fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': token,
            }
        })
        .then(function (response) {
            if (response.status !== 200) {
            return Promise.reject(new Error(response.statusText))
            }
            return Promise.resolve(response)
        })
        .then(function (response) {
            return response.json()
        })
        .then(function (data) {
            data.diagnosticParts.map((elem, index)=>elem.key=index);
            that.setState({
                masterDiagnosticParts: data.diagnosticParts,
            });
        })
        .catch(function (error) {
            console.log('error', error)
        })
    }

    render() {
        const { diagnosticParts, masterDiagnosticParts, filterPlan, filterGroup, filterCode, filterName } = this.state;
        if(diagnosticParts.length && 
            (diagnosticParts[diagnosticParts.length-1].diagnosticTemplateTitle != "" || diagnosticParts[diagnosticParts.length-1].groupTitle != "")) {
                diagnosticParts.push({
                key: diagnosticParts.length,
                diagnosticTemplateTitle: "",
                groupTitle: "",
                partTitle: "",
                partId: null,
            })
        }

        const columns = this.columns;
        const modalColumns = this.modalColumns;

        var dataSource = [...diagnosticParts];
        var modalDataSource = [...masterDiagnosticParts];

        dataSource = dataSource.filter((data, i) => !data.deleted);
        if(filterPlan) dataSource = dataSource.filter((data, i) => data.diagnosticTemplateTitle.toLowerCase().includes(filterPlan.toLowerCase()));
        if(filterGroup) dataSource = dataSource.filter((data, i) => data.groupTitle.toLowerCase().includes(filterGroup.toLowerCase()));
        if(filterName) dataSource = dataSource.filter((data, i) => data.partTitle.toLowerCase().includes(filterName.toLowerCase()));
        if(filterCode) dataSource = dataSource.filter((data, i) => String(data.partId).includes(filterCode));
        return (
            <Layout
                title={ <FormattedMessage id='diagnostic-page.title' /> }
                controls={
                    <>
                        <Button
                            style={{marginRight: 10}}
                            onClick={ () =>
                                this.importDefaultDiagnostics()
                            }
                        >
                            <FormattedMessage id='diagnostic-page.import_default' />
                        </Button>
                        <Button
                            type='primary'
                            onClick={ () =>
                                this.saveDiagnostic()
                            }
                        >
                            <FormattedMessage id='save' />
                        </Button>
                    </>
                }
            >
                <Table
                    dataSource={dataSource}
                    columns={columns}
                    locale={{
                        emptyText: <FormattedMessage id='no_data' />,
                    }}
                    //pagination={false}
                    scroll={{ y: 680 }}
                />
                <Modal
                    title={<FormattedMessage id='diagnostic-page.change_code' />}
                    width="80%"
                    footer={null}
                    visible={this.state.visible}
                    onCancel={()=>{this.handleCancel()}}
                >
                    <Table
                        dataSource={modalDataSource}
                        columns={modalColumns}
                        locale={{
                            emptyText: <FormattedMessage id='no_data' />,
                        }}
                        pagination={false}
                        scroll={{ y: 520 }}
                    />
                </Modal>
            </Layout>
        );
    }
}

export default DiagnosticPatternsPage;