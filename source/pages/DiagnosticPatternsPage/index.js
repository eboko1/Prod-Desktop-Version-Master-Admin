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
    Switch
} from 'antd';

// proj
import { Layout, Spinner } from 'commons';
import { DiagnosticPatternsContainer } from 'containers';
import {
    API_URL,
    addNewDiagnosticTemplate,
    getDiagnosticsTemplates,
    addNewDiagnosticRow,
    sendDiagnosticAnswer,
    deleteDiagnosticProcess,
    deleteDiagnosticTemplate,
    getPartProblems
} from 'core/forms/orderDiagnosticForm/saga';

// own
import Styles from './styles.m.css';
const { Option } = Select;

@injectIntl
@withRouter

class DiagnosticPatternsPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            diagnosticParts: [],
            filterPlan: null,
            filterGroup: null,
            filterName: null,
        };
        this.columns = [
            {
                dataIndex: 'key',
                key:       'key',
                width:     '5%',
                render:    (key)=>(key+1),
            },
            {
                title:  ()=>{
                    return (
                        <div>
                            <p>PLAN</p>
                            <Select
                                allowClear
                                style={{minWidth: "100px"}}
                                placeholder={"PLAN"}
                                value={this.state.filterPlan ? this.state.filterPlan : undefined}
                                onChange={(value)=>{
                                    this.setState({
                                        filterPlan: value,
                                    });
                                }}
                            >
                                {this.state.planOptions ?
                                    this.state.planOptions.map((elem, index)=>(
                                        <Option
                                            key={index}
                                            value={elem.id}
                                        >
                                            {elem.title}
                                        </Option>
                                    )) : null
                                }
                            </Select>
                        </div>
                    )
                },
                dataIndex: 'diagnosticTemplateId',
                key:       'diagnosticTemplateTitle',
                width:     '25%',
                render: (data, elem)=>{
                    const key = elem.key;
                    return (
                        <Select
                            style={{width: "100%"}}
                            value={data}
                            onChange={(value, option)=>{
                                this.state.diagnosticParts[key].changed = true;
                                this.state.diagnosticParts[key].diagnosticTemplateId = value;
                                this.state.diagnosticParts[key].diagnosticTemplateTitle = option.props.children;
                                this.setState({
                                    update: true,
                                });
                            }}
                        >
                            {this.state.planOptions.map((elem, index)=>(
                                <Option
                                    key={index}
                                    value={elem.id}
                                >
                                    {elem.title}
                                </Option>
                            ))}
                        </Select>
                    )
                }
            },
            {
                title:  ()=>{
                    return (
                        <div>
                            <p>GROUP</p>
                            <Select
                                allowClear
                                style={{minWidth: "100px"}}
                                placeholder={"GROUP"}
                                value={this.state.filterGroup ? this.state.filterGroup : undefined}
                                onChange={(value)=>{
                                    this.setState({
                                        filterGroup: value,
                                    });
                                }}
                            >
                                {this.state.groupOptions ?
                                    this.state.groupOptions.map((elem, index)=>(
                                        <Option
                                            key={index}
                                            value={elem.id}
                                        >
                                            {elem.title}
                                        </Option>
                                    )) : null
                                }
                            </Select>
                        </div>
                    )
                },
                dataIndex: 'groupId',
                key:       'groupTitle',
                width:     '25%',
                render: (data, elem)=>{
                    const key = elem.key;
                    return (
                        <Select
                            style={{width: "100%"}}
                            value={data}
                            onChange={(value, option)=>{
                                this.state.diagnosticParts[key].changed = true;
                                this.state.diagnosticParts[key].groupId = value;
                                this.state.diagnosticParts[key].groupTitle = option.props.children;
                                this.setState({
                                    update: true,
                                });
                            }}
                        >
                            {this.state.groupOptions.map((elem, index)=>(
                                <Option
                                    key={index}
                                    value={elem.id}
                                >
                                    {elem.title}
                                </Option>
                            ))}
                        </Select>
                    )
                }
            },
            {
                title:  ()=>{
                    return (
                        <div>
                            <p>CODE</p>
                        </div>
                    )
                },
                dataIndex: 'partId',
                key:       'partId',
                width:     '15%',
            },
            {
                title:  ()=>{
                    return (
                        <div>
                            <p>NAME</p>
                            <Input
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
                width:     '25%',
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
    }

    saveDiagnostic() {
        console.log(this.state.diagnosticParts);
        var resultData = [];
        this.state.diagnosticParts.map((part)=>{
            let templateIndex = resultData.findIndex((elem)=>elem.diagnosticTemplateId==part.diagnosticTemplateId);
            if(templateIndex == -1) {
                resultData.push({
                    diagnosticTemplateTitle: part.diagnosticTemplateTitle,
                    diagnosticTemplateId: part.diagnosticTemplateId,
                    groups: [],
                })
            }
        })
        this.state.diagnosticParts.map((part)=>{
            let templateIndex = resultData.findIndex((elem)=>elem.diagnosticTemplateId==part.diagnosticTemplateId);
            let groupIndex = resultData[templateIndex].groups.findIndex((elem)=>elem.groupId==part.groupId);
            if(groupIndex == -1) {
                resultData[templateIndex].groups.push({
                    groupTitle: part.groupTitle,
                    groupId: part.groupId,
                    partIds: [],
                })
            }
        })
        this.state.diagnosticParts.map((part)=>{
            let templateIndex = resultData.findIndex((elem)=>elem.diagnosticTemplateId==part.diagnosticTemplateId);
            let groupIndex = resultData[templateIndex].groups.findIndex((elem)=>elem.groupId==part.groupId);
            if(!part.deleted) resultData[templateIndex].groups[groupIndex].partIds.push(part.partId);
        })
        console.log(resultData);

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
            console.log(data);
            window.location.reload();
        })
        .catch(function (error) {
            console.log('error', error)
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
            var planOptions=[],
                groupOptions=[];
            data.diagnosticParts.map((elem, index)=>{
                elem.key = index;
                if(planOptions.findIndex((data)=>data.id==elem.diagnosticTemplateId) == -1) {
                    planOptions.push({
                        id: elem.diagnosticTemplateId,
                        title: elem.diagnosticTemplateTitle,
                    })
                }
                if(groupOptions.findIndex((data)=>data.id==elem.groupId) == -1) {
                    groupOptions.push({
                        id: elem.groupId,
                        title: elem.groupTitle,
                    })
                }
            });
            that.setState({
                diagnosticParts: data.diagnosticParts,
                planOptions: planOptions,
                groupOptions: groupOptions,
            });
        })
        .catch(function (error) {
            console.log('error', error)
        })
    }

    render() {
        const { diagnosticParts, filterPlan, filterGroup, filterName } = this.state;
        if(diagnosticParts.length && 
            (diagnosticParts[diagnosticParts.length-1].defaultName != null || diagnosticParts[diagnosticParts.length-1].laborId != null)) {
                diagnosticParts.push({
                key: diagnosticParts.length,
                laborCode: null,
                laborId: null,
                defaultName: null,
                name: null,
                fixed: false,
                normHours: null,
                price: null,
            })
        }
        const columns = this.columns;
        var dataSource = [...diagnosticParts];
        dataSource = dataSource.filter((data, i) => !data.deleted);
        if(filterPlan) dataSource = dataSource.filter((data, i) => data.diagnosticTemplateId==filterPlan);
        if(filterGroup) dataSource = dataSource.filter((data, i) => data.groupId==filterGroup);
        if(filterName) dataSource = dataSource.filter((data, i) => data.partTitle.includes(filterName));
        return (
            <Layout
                title={ <FormattedMessage id='diagnostic-page.title' /> }
                controls={
                    <Button
                        type='primary'
                        onClick={ () =>
                            this.saveDiagnostic()
                        }
                    >
                        <FormattedMessage id='save' />
                    </Button>
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
            </Layout>
        );
    }
}

export default DiagnosticPatternsPage;