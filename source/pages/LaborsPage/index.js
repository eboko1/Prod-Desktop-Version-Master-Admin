// vendor
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import {
    Table,
    Button,
    Icon,
    Checkbox,
    Select,
    Input,
    InputNumber,
    notification,
    message,
    Switch,
    TreeSelect,
    Pagination,
    Popconfirm,
} from 'antd';

// proj
import { Layout, Spinner } from 'commons';
import { permissions, isForbidden, fetchAPI } from 'utils';
import { Barcode } from 'components';

// own
import Styles from './styles.m.css';
const { Option } = Select;

const mapStateToProps = state => {
    return {
        user: state.auth,
    };
};

@injectIntl
@connect(
    mapStateToProps,
    void 0,
)
export default class LaborsPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            labors: [],
            masterLabors: [],
            storeGroups: [],
            filterCode: null,
            filterCrossId: null,
            filterId: null,
            filterDetail: null,
            filterDefaultName: null,
            filterName: null,
            currentPage: 1,
            selectedRows: [],
            selectedRowKeys: [],
        }
        this.treeData = [];
        this.columns = [
            {
                title:  ()=>{
                    return (
                        <div>
                            <FormattedMessage id="order_form_table.labors_code" />
                            <Input
                                allowClear
                                placeholder={this.props.intl.formatMessage({id: 'order_form_table.labors_code'})}
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
                key:       'laborCode',
                dataIndex: 'laborCode',
                render: (data, row)=>{
                    return (
                        <div style={{display: 'flex'}}>
                            <Barcode
                                value={row.barcode}
                                enableScanIcon
                                iconStyle={{
                                    margin: "0 8px 0 0",
                                    fornSize: 18,
                                    verticalAlign: "sub",
                                }}
                                prefix={'LBS'}
                                table={'LABORS'}
                                referenceId={row.laborId}
                                onConfirm={(code, pref, fullCode)=>{
                                    row.barcode = fullCode;
                                    this.setState({});
                                }}
                            />
                            {data}
                        </div>  
                    )
                }
            },
            {
                title:  ()=>{
                    return (
                        <div>
                            <p>ID</p>
                            <Input
                                allowClear
                                placeholder="ID"
                                value={this.state.filterId}
                                onChange={(event)=>{
                                    this.setState({
                                        filterId: event.target.value
                                    })
                                }}
                            />
                        </div>
                    )
                },
                dataIndex: 'masterLaborId',
                key:       'masterLaborId',
                render: (data, elem)=>{
                    const key = elem.key;
                    return !elem.new ? (
                        <p>{data}</p>
                    ) : (
                        <Select
                            disabled={isForbidden(this.props.user, permissions.ACCESS_CATALOGUE_LABORS_CRUD)}
                            showSearch
                            placeholder="ID"
                            style={{minWidth: "100px"}}
                            filterOption={(input, option) => (
                                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0 || 
                                String(option.props.value).indexOf(input.toLowerCase()) >= 0
                            )}
                            value={this.state.labors[key].masterLaborId ? this.state.labors[key].masterLaborId : undefined}
                            onChange={(value, option)=>{
                                this.state.labors[key].masterLaborId = value;
                                this.state.labors[key].name = option.props.children;
                                this.state.labors[key].laborCode = `${value}-${elem.storeGroupId ? elem.storeGroupId : '0000000'}`;
                                this.state.labors[key].customName = option.props.children + " " + this.state.labors[key].detailTitle;
                                this.setState({
                                    update: true
                                })
                            }}
                        >
                            {this.state.masterLabors.map((elem, index)=>(
                                <Option key={index} value={elem.masterLaborId}>
                                    {elem.defaultMasterLaborName}
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
                            <FormattedMessage id="order_form_table.external_id" />
                            <Input
                                allowClear
                                placeholder={this.props.intl.formatMessage({id: 'order_form_table.external_id'})}
                                value={this.state.filterCrossId}
                                onChange={(event)=>{
                                    this.setState({
                                        filterCrossId: event.target.value
                                    })
                                }}
                            />
                        </div>
                    )
                },
                key:       'crossId',
                dataIndex: 'crossId',
                render: (data, elem)=>{
                    const key = elem.key;
                    return (
                        <Input
                            placeholder={this.props.intl.formatMessage({id: 'order_form_table.external_id'})}
                            value={data}
                            onChange={(event)=>{
                                elem.changed = true;
                                elem.crossId = event.target.value;
                                this.setState({
                                    update: true,
                                });
                            }}
                            style={{color: 'var(--text)'}}
                        />
                    )
                }
            },
            {
                title:  ()=>{
                    return (
                        <div>
                            <FormattedMessage id="order_form_table.detail_code" />
                            <Input
                                allowClear
                                placeholder={this.props.intl.formatMessage({id: 'order_form_table.detail_code'})}
                                value={this.state.filterDetail}
                                onChange={(event)=>{
                                    this.setState({
                                        filterDetail: event.target.value
                                    })
                                }}
                            />
                        </div>
                    )
                },
                dataIndex: 'storeGroupId',
                key:       'storeGroupId',
                render: (data, elem)=>{
                    const key = elem.key;
                    return !elem.new ? (
                        <p>{data}</p>
                    ) : (
                        <TreeSelect
                            disabled={isForbidden(this.props.user, permissions.ACCESS_CATALOGUE_LABORS_CRUD)}
                            showSearch
                            style={{ minWidth: '130px' }}
                            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                            treeData={this.treeData}
                            placeholder={this.props.intl.formatMessage({id: 'order_form_table.detail_code'})}
                            value={this.state.labors[key].storeGroupId ? this.state.labors[key].storeGroupId : undefined}
                            filterTreeNode={(input, node) => (
                                node.props.title.toLowerCase().indexOf(input.toLowerCase()) >= 0 || 
                                String(node.props.value).indexOf(input.toLowerCase()) >= 0
                            )}
                            onSelect={(value, option)=>{
                                this.state.labors[key].storeGroupId = value;
                                this.state.labors[key].laborCode = `${elem.masterLaborId ? elem.masterLaborId : "0000"}-${value}`;
                                this.state.labors[key].detailTitle = option.props.title;
                                this.state.labors[key].customName = this.state.labors[key].name + " " + option.props.title;
                                this.setState({
                                    update: true
                                })
                            }}
                        />
                    )
                }
            },
            {
                title:  ()=>{
                    return (
                        <div>
                            <FormattedMessage id="order_form_table.service_type" />
                            <Input
                                allowClear
                                placeholder={this.props.intl.formatMessage({id: 'order_form_table.service_type'})}
                                value={this.state.filterDefaultName}
                                onChange={(event)=>{
                                    this.setState({
                                        filterDefaultName: event.target.value
                                    })
                                }}
                            />
                        </div>
                    )
                },
                dataIndex: 'name',
                key:       'name',
            },
            {
                title:  ()=>{
                    return (
                        <div>
                            <FormattedMessage id="order_form_table.detail_name" />
                            <Input
                                allowClear
                                placeholder={this.props.intl.formatMessage({id: 'order_form_table.detail_name'})}
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
                key:       'customName',
                render: (elem)=>{
                    const key = elem.key;
                    return (
                        <Input
                            disabled={isForbidden(this.props.user, permissions.ACCESS_CATALOGUE_LABORS_CRUD)}
                            ref={(input) => { this.nameInput = input; }} 
                            placeholder={this.props.intl.formatMessage({id: 'order_form_table.detail_name'})}
                            value={elem.customName?elem.customName:null}
                            onChange={(event)=>{
                                elem.changed = true;
                                elem.customName = event.target.value;
                                this.setState({
                                    update: true,
                                });
                            }}
                            style={{color: 'var(--text)'}}
                        />
                    )
                }
            },
            {
                title:  ()=>{
                    return (
                        <div>
                            <p><FormattedMessage id="supplier.show" /></p>
                            <p>
                                <Checkbox
                                    onChange={(event)=>{
                                        this.state.selectedRows.map((elem)=>{
                                            elem.changed = true;
                                            elem.disabled = !event.target.checked;
                                        })
                                        this.setState({});
                                    }}
                                />
                            </p>    
                        </div>
                    )
                },
                key:       'disabled',
                dataIndex: 'disabled',
                render: (data, elem)=>{
                    return (
                        <Checkbox
                            checked={!data}
                            onChange={(event)=>{
                                elem.disabled = !event.target.checked;
                                elem.changed = true;
                                this.setState({});
                            }}
                        />
                    )
                }
            },
            {
                title:  ()=>{
                    return (
                        <div>
                            <p><FormattedMessage id="order_form_table.fixed" /></p>
                            <p>
                                <Switch
                                    onClick={(value)=>{
                                        this.state.selectedRows.map((elem)=>{
                                            elem.changed = true;
                                            elem.fixed = value;
                                        })
                                        this.setState({});
                                    }}
                                />
                            </p>    
                        </div>
                    )
                },
                dataIndex: 'fixed',
                key:       'fixed',
                render: (fixed, elem)=>{
                    const key = elem.key;
                    return (
                        <Switch
                            disabled={isForbidden(this.props.user, permissions.ACCESS_CATALOGUE_LABORS_CRUD)}
                            checked={fixed}
                            onClick={(value)=>{
                                elem.changed = true; 
                                elem.fixed = value;
                                this.setState({});
                            }}
                        />
                    )
                }
            },
            {
                title:  ()=>{
                    return (
                        <div>
                            <p><FormattedMessage id="hours" /></p>
                            <p>
                                <InputNumber
                                    min={0.1}
                                    step={0.2}
                                    defaultValue={1}
                                    onChange={(value)=>{
                                        this.state.selectedRows.map((elem)=>{
                                            elem.changed = true;
                                            elem.normHours = value;
                                        })
                                        this.setState({});
                                    }}
                                    style={{color: 'var(--text)'}}
                                />
                            </p>    
                        </div>
                    )
                },
                dataIndex: 'normHours',
                key:       'normHours',
                render: (data, elem)=>{
                    const key = elem.key;
                    return (
                        <InputNumber
                            min={0.1}
                            step={0.2}
                            value={data || 1}
                            disabled={elem.fixed || isForbidden(this.props.user, permissions.ACCESS_CATALOGUE_LABORS_CRUD)}
                            onChange={(value)=>{
                                elem.changed = true;
                                elem.normHours = value;
                                this.setState({});
                            }}
                            style={{color: 'var(--text)'}}
                        />
                    )
                }
            },
            {
                title:  ()=>{
                    return (
                        <div>
                            <p><FormattedMessage id="order_form_table.price" /></p>
                            <p>
                                <InputNumber
                                    min={1}
                                    defaultValue={1}
                                    onChange={(value)=>{
                                        this.state.selectedRows.map((elem)=>{
                                            elem.changed = true;
                                            elem.price = value;
                                        })
                                        this.setState({});
                                    }}
                                    style={{color: 'var(--text)'}}
                                />
                            </p>    
                        </div>
                    )
                },
                dataIndex: 'price',
                key:       'price',
                render: (data, elem)=>{
                    const key = elem.key;
                    return (
                        <InputNumber
                            min={1}
                            value={data || 1}
                            disabled={!elem.fixed || isForbidden(this.props.user, permissions.ACCESS_CATALOGUE_LABORS_CRUD)}
                            onChange={(value)=>{
                                elem.changed = true;
                                elem.price = value;
                                this.setState({});
                            }}
                            style={{color: 'var(--text)'}}
                        />
                    )
                }
            },
            {
                title:  ()=>{
                    return (
                        <div>
                            <Popconfirm
                                title={
                                    <FormattedMessage id='add_order_form.delete_confirm' />
                                }
                                onConfirm={ () => {
                                    this.state.selectedRows.map((elem)=>{
                                        if(elem.laborBusinessId)
                                            elem.deleted = true;
                                    })
                                    this.setState({});
                                } }
                            >
                                <Button
                                    //type='primary'
                                    style={{
                                        padding: '0px 8px'
                                    }}
                                >
                                    <Icon
                                        type='undo'
                                    />
                                    <span style={{marginLeft: 4}}>|</span>
                                    <Icon
                                        style={{
                                            color: 'red',
                                            marginLeft: 4
                                        }}
                                        type='delete'
                                    />
                                </Button>
                            </Popconfirm>
                        </div>
                    )
                },
                key: 'delete',
                render: (row)=>{
                    const buttonType = row.masterLaborId >= 9000 ? 'danger' : 'primary';
                    const iconType = row.masterLaborId >= 9000 ? 'delete' : 'undo';
                    return Boolean(row.laborBusinessId) ? (
                        <Popconfirm
                            title={
                                <FormattedMessage id='add_order_form.delete_confirm' />
                            }
                            onConfirm={ () => {
                                row.deleted = true;
                                this.setState({});
                            } }
                        >
                            <Button
                                title={
                                    row.masterLaborId >= 9000
                                    ? this.props.intl.formatMessage({id:'delete'})
                                    : this.props.intl.formatMessage({id:'update'})
                                }
                                type={buttonType}
                                style={{
                                    width: '100%'
                                }}
                            >
                                <Icon type={iconType}/>
                            </Button>
                        </Popconfirm>
                    ) : (
                        <Button
                            type={buttonType}
                            disabled
                            style={{
                                width: '100%'
                            }}
                        >
                            <Icon type={iconType}/>
                        </Button>
                    )
                }
            }
        ]
    }

    async updatePrice () {
        let token = localStorage.getItem('_my.carbook.pro_token');
        let url = __API_URL__;
        let params = `/labors/recalc_prices`;
        url += params;

        await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': token,
            },
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
            message.success('Цена обновлена');
        })
        .catch(function (error) {
            message.error('Цена не задана!');
        });

        await this.fetchLabors();
    }

    async saveLabors() {
        var labors = [], newLabors = [], deletedLabors = [];
        this.state.labors.map((elem)=>{
            if(elem.deleted) {
                deletedLabors.push(elem.laborId);
            }
            else if(elem.changed && !elem.new) {
                labors.push({
                    masterLaborId: elem.masterLaborId,
                    storeGroupId: elem.storeGroupId,
                    disabled: Boolean(elem.disabled),
                    crossId: elem.crossId || null,
                });
                if(elem.laborId) labors[labors.length-1].laborId = elem.laborId;
                if(elem.customName) labors[labors.length-1].customName = elem.customName;
                if(elem.fixed) {
                    labors[labors.length-1].fixed = true;
                    labors[labors.length-1].price = elem.price || 1;
                }
                else {
                    labors[labors.length-1].fixed = false;
                    labors[labors.length-1].normHours = elem.normHours || 1;
                }
            }
            else if(elem.new && elem.masterLaborId && elem.storeGroupId) {
                newLabors.push({
                    masterLaborId: elem.masterLaborId,
                    storeGroupId: elem.storeGroupId,
                    disabled: Boolean(elem.disabled),
                    crossId: elem.crossId || null,
                });
                //if(elem.laborId) newLabors[newLabors.length-1].laborId = elem.laborId;
                if(elem.customName) newLabors[newLabors.length-1].customName = elem.customName;
                if(elem.fixed) {
                    newLabors[newLabors.length-1].fixed = true;
                    newLabors[newLabors.length-1].price = elem.price || 1;
                }
                else {
                    newLabors[newLabors.length-1].fixed = false;
                    newLabors[newLabors.length-1].normHours = elem.normHours || 1;
                }
            }
        });

        if(newLabors.length) {
            await fetchAPI('POST', 'labors', null, newLabors);
        } 
        if(deletedLabors.length) {
            await fetchAPI('DELETE', `labors?laborIds=[${deletedLabors}]`);
        }
        if(labors.length) {
            await fetchAPI('PUT', 'labors', null, labors);
        }
        this.fetchLabors();
    }

    fetchLabors = async () => {
        await this.setState({
            loading: true,
            selectedRowKeys: [],
        })

        const response = await fetchAPI('GET', 'labors', {all: true});
        response.labors.sort((a, b) => a.masterLaborId < b.masterLaborId ? -1 : (a.masterLaborId > b.masterLaborId ? 1 : 0));
        response.labors.map((elem, index)=>{
            elem.key = index;
            elem.laborCode = `${elem.masterLaborId}-${elem.storeGroupId}`;
            elem.price = elem.laborPrice.price;
            elem.fixed = elem.laborPrice.fixed;
            elem.normHours = elem.laborPrice.normHours;
        })
        this.setState({
            labors: response.labors,
            currentPage: this.props.location.state && this.props.location.state.showForm ? Math.ceil(response.labors.length / 10) : 1,
        });

        if(this.props.location.state && this.props.location.state.showForm) {
            this.nameInput.focus();
        }

        this.setState({
            loading: false,
        })
    }

    fetchData = async () => {
        const masterLabors = await fetchAPI('GET', 'labors/master');
        this.setState({
            masterLabors: masterLabors.masterLabors,
        });

        const storeGroups = await fetchAPI('GET', 'store_groups');
        this.setState({
            storeGroups,
        });
        this.buildStoreGroupsTree();

        this.fetchLabors();
    }

    buildStoreGroupsTree() {
        var treeData = [];
        for(let i = 0; i < this.state.storeGroups.length; i++) {
            const parentGroup = this.state.storeGroups[i];
            treeData.push({
                title: `${parentGroup.name} (#${parentGroup.id})`,
                value: parentGroup.id,
                key: `${i}`,
                children: [],
            })
            for(let j = 0; j < parentGroup.childGroups.length; j++) {
                const childGroup = parentGroup.childGroups[j];
                treeData[i].children.push({
                    title: `${childGroup.name} (#${childGroup.id})`,
                    value: childGroup.id,
                    key: `${i}-${j}`,
                    children: [],
                })
                for(let k = 0; k < childGroup.childGroups.length; k++) {
                    const lastNode = childGroup.childGroups[k];
                    treeData[i].children[j].children.push({
                        title: `${lastNode.name} (#${lastNode.id})`,
                        value: lastNode.id,
                        key: `${i}-${j}-${k}`,
                        children: [],
                    })
                    for(let l = 0; l < lastNode.childGroups.length; l++) {
                        const elem = lastNode.childGroups[l];
                        treeData[i].children[j].children[k].children.push({
                            title: `${elem.name} (#${elem.id})`,
                            value: elem.id,
                            key: `${i}-${j}-${k}-${l}`,
                        })
                    }
                }
            }
        }
        this.treeData = treeData;
    }

    componentDidMount() {
        const { location } = this.props;
        if(location.state && location.state.laborId) {
            this.setState({
                filterCode: location.state.laborId,
            })
        }
        this.fetchData();
    }

    render() {
        const { loading, labors, filterCode, filterCrossId, filterId, filterDetail, filterDefaultName, filterName, currentPage, selectedRowKeys } = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: (selectedRowKeys, selectedRows) => {
                this.setState({
                    selectedRowKeys,
                    selectedRows,
                })
            },
        };

        if(
            !isForbidden(this.props.user, permissions.ACCESS_CATALOGUE_LABORS_CRUD) && 
            labors.length && 
            (labors[labors.length-1].name != "" || labors[labors.length-1].masterLaborId != "")
        ) {
            labors.push({
                key: labors.length,
                laborCode: "0000-0000000",
                masterLaborId: "",
                storeGroupId: "",
                detailTitle: "",
                name: "",
                customName: "",
                fixed: false,
                normHours: 1,
                price: null,
                new: true,
            })
        }
        const columns = this.columns;
        var dataSource = [...labors];
        dataSource = dataSource.filter((elem)=>!elem.deleted);
        if(filterCode) dataSource = dataSource.filter((data, i) => data.laborCode.replace('-', '').includes(filterCode));
        if(filterCrossId) dataSource = dataSource.filter((data, i) => String(data.crossId).includes(filterCrossId));
        if(filterId) dataSource = dataSource.filter((data, i) => String(data.masterLaborId).includes(String(filterId)));
        if(filterDetail) dataSource = dataSource.filter((data, i) => String(data.storeGroupId).includes(String(filterDetail)));
        if(filterDefaultName) dataSource = dataSource.filter((data, i) => data.name.toLowerCase().includes(filterDefaultName.toLowerCase()));
        if(filterName) dataSource = dataSource.filter((data, i) => data.customName.toLowerCase().includes(filterName.toLowerCase()));

        return (
            <Layout
                title={
                    <FormattedMessage id='navigation.labors_page' />
                }
                controls={
                    <>
                        <Button
                            disabled={isForbidden(this.props.user, permissions.ACCESS_CATALOGUE_LABORS_CRUD)}
                            style={{marginRight: 10}}
                            onClick={ () =>
                                this.updatePrice()
                            }
                        >
                            <FormattedMessage id='update_price' /> 
                        </Button>
                        <Button
                            disabled={isForbidden(this.props.user, permissions.ACCESS_CATALOGUE_LABORS_CRUD)}
                            type='primary'
                            onClick={ () =>
                                this.saveLabors()
                            }
                        >
                            <FormattedMessage id='save' /> 
                        </Button>
                    </>
                }
            >
                <Table
                    loading={loading}
                    dataSource={dataSource}
                    rowSelection={rowSelection}
                    columns={columns}
                    locale={{
                        emptyText: <FormattedMessage id='no_data' />,
                    }}
                    pagination={
                        {
                            pageSize: 10,
                            hideOnSinglePage: true,
                            current: currentPage,
                            onChange: page => {
                                this.setState({
                                    currentPage: page,
                                })
                            }
                        }
                    }
                />
            </Layout>
        );
    }
}
