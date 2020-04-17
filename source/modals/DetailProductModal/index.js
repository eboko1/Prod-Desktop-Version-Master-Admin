// vendor
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Button, Modal, Icon, Select, Input, InputNumber, AutoComplete, Table, TreeSelect } from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';
// proj
import {
    API_URL,
    confirmDiagnostic,
    createAgreement,
    lockDiagnostic,
} from 'core/forms/orderDiagnosticForm/saga';
import { images } from 'utils';
// own
import Styles from './styles.m.css';
const { TreeNode } = TreeSelect;
const Option = Select.Option;

@injectIntl
class DetailProductModal extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            mainTableSource: [
                {
                    key: 0,
                    storeGroup: undefined,
                    name: undefined,
                    comment: undefined,
                    brand: undefined,
                    code: undefined,
                    self: undefined,
                    price: undefined,
                    count: undefined,
                    sum: undefined,
                }
            ],
            relatedDetailsSource: [
                {
                    key: 0,
                    storeGroup: undefined,
                    name: undefined,
                    comment: undefined,
                    brand: undefined,
                    code: undefined,
                    self: undefined,
                    price: undefined,
                    count: undefined,
                    sum: undefined,
                },
                {
                    key: 1,
                    storeGroup: undefined,
                    name: undefined,
                    comment: undefined,
                    brand: undefined,
                    code: undefined,
                    self: undefined,
                    price: undefined,
                    count: undefined,
                    sum: undefined,
                },
                {
                    key: 2,
                    storeGroup: undefined,
                    name: undefined,
                    comment: undefined,
                    brand: undefined,
                    code: undefined,
                    self: undefined,
                    price: undefined,
                    count: undefined,
                    sum: undefined,
                },
            ],
            relatedServicesSource: [
                {
                    key: 0,
                    defaultName: undefined,
                    name: undefined,
                    comment: undefined,
                    employee: undefined,
                    hours: undefined,
                    self: undefined,
                    price: undefined,
                    count: undefined,
                    sum: undefined,
                }
            ]
        }
        this.labors = [];
        this.storeGroups = [];
        this.treeData = [];
        this.brandOptions = [];
        this.servicesOptions = [];

        this.mainTableColumns = [
            {
                title:  "GROUP",
                key:       'storeGroup',
                dataIndex: 'storeGroup',
                width:     '15%',
                render: ()=>{
                    return (
                        <TreeSelect
                            allowClear
                            showSearch
                            placeholder="GROUP"
                            style={{ width: '100%' }}
                            dropdownStyle={{ maxHeight: 400, overflow: 'auto', zIndex: "9999" }}
                            treeData={this.treeData}
                            filterTreeNode={(input, node) => (
                                node.props.title.toLowerCase().indexOf(input.toLowerCase()) >= 0 || 
                                String(node.props.value).indexOf(input.toLowerCase()) >= 0
                            )}
                            onSelect={(value, option)=>{
                                this.setState({
                                    update: true
                                })
                            }}
                        />
                    )
                }
                
            },
            {
                title:  "NAME",
                key:       'name',
                dataIndex: 'name',
                width:     '20%',
                render: ()=>{
                    return (
                        <Input
                            placeholder="NAME"
                        />
                    )
                }
            },
            {
                title:  "COMMENT",
                key:       'comment',
                dataIndex: 'comment',
                width:     '8%',
                render: ()=>{
                    const detail = {
                        name: "test",
                    }
                    const comment = {
                        comment: null,
                    }
                    return (
                        <CommentaryButton
                            commentary={comment}
                            detail={detail}
                        />
                    )
                }
            },
            {
                title:  "BRAND",
                key:       'brand',
                dataIndex: 'brand',
                width:     '15%',
                render: ()=>{
                    return (
                        <Select
                            allowClear
                            placeholder="BRAND"
                            style={{minWidth: 120}}
                            dropdownStyle={{ maxHeight: 400, overflow: 'auto', zIndex: "9999" }}
                        >
                            {this.brandOptions}
                        </Select>
                    )
                }
            },
            {
                title:  "CODE",
                key:       'code',
                dataIndex: 'code',
                width:     '13%',
                render: ()=>{
                    return (
                        <Input
                            placeholder="CODE"
                        />
                    )
                }
            },
            {
                title:  "SELF",
                key:       'self',
                dataIndex: 'self',
                width:     '6%',
                render: ()=>{
                    return (
                        <InputNumber
                            defaultValue={0}
                            min={0}
                        />
                    )
                }
            },
            {
                title:  "PRICE",
                key:       'price',
                dataIndex: 'price',
                width:     '6%',
                render: ()=>{
                    return (
                        <InputNumber
                            defaultValue={1}
                            min={1}
                        />
                    )
                }
            },
            {
                title:  "COUNT",
                key:       'count',
                dataIndex: 'count',
                width:     '6%',
                render: ()=>{
                    return (
                        <InputNumber
                            defaultValue={1}
                            min={1}
                        />
                    )
                }
            },
            {
                title:  "SUM",
                key:       'sum',
                dataIndex: 'sum',
                width:     '8%',
                render: (sum)=>{
                    return (
                        <InputNumber
                            disabled
                            value={sum ? sum : 1}
                        />
                    )
                }
            },
            {
                key:       'delete',
                width:     '3%',
                render: ()=>{
                    return (
                        <Icon
                            type="delete"
                        />
                    )
                }
            },
        ];
        this.relatedServicesColumns = [
            {
                title:  "SERVICE",
                key:       'defaultName',
                dataIndex: 'defaultName',
                width:     '15%',
                render: ()=>{
                    return (
                        <Select
                            allowClear
                            showSearch
                            placeholder="SERVICE"
                            style={{ width: '100%' }}
                            dropdownStyle={{ maxHeight: 400, overflow: 'auto', zIndex: "9999" }}
                            onSelect={(value, option)=>{
                                this.setState({
                                    update: true
                                })
                            }}
                        >
                            {this.servicesOptions}
                        </Select>
                    )
                }
                
            },
            {
                title:  "NAME",
                key:       'name',
                dataIndex: 'name',
                width:     '20%',
                render: ()=>{
                    return (
                        <Input
                            placeholder="NAME"
                        />
                    )
                }
            },
            {
                title:  "COMMENT",
                key:       'comment',
                dataIndex: 'comment',
                width:     '8%',
                render: ()=>{
                    const detail = {
                        name: "test",
                    }
                    const comment = {
                        comment: null,
                    }
                    return (
                        <CommentaryButton
                            commentary={comment}
                            detail={detail}
                        />
                    )
                }
            },
            {
                title:  "EMPLOYEE",
                key:       'employee',
                dataIndex: 'employee',
                width:     '15%',
                render: ()=>{
                    return (
                        <Select
                            allowClear
                            placeholder="EMPLOYEE"
                            style={{minWidth: 120}}
                            dropdownStyle={{ maxHeight: 400, overflow: 'auto', zIndex: "9999" }}
                        />
                    )
                }
            },
            {
                title:  "HOURS",
                key:       'hours',
                dataIndex: 'hours',
                width:     '13%',
                render: ()=>{
                    return (
                        <Input
                            placeholder="HOURS"
                        />
                    )
                }
            },
            {
                title:  "SELF",
                key:       'self',
                dataIndex: 'self',
                width:     '6%',
                render: ()=>{
                    return (
                        <InputNumber
                            defaultValue={0}
                            min={0}
                        />
                    )
                }
            },
            {
                title:  "PRICE",
                key:       'price',
                dataIndex: 'price',
                width:     '6%',
                render: ()=>{
                    return (
                        <InputNumber
                            defaultValue={1}
                            min={1}
                        />
                    )
                }
            },
            {
                title:  "COUNT",
                key:       'count',
                dataIndex: 'count',
                width:     '6%',
                render: ()=>{
                    return (
                        <InputNumber
                            defaultValue={1}
                            min={1}
                        />
                    )
                }
            },
            {
                title:  "SUM",
                key:       'sum',
                dataIndex: 'sum',
                width:     '8%',
                render: (sum)=>{
                    return (
                        <InputNumber
                            disabled
                            value={sum ? sum : 1}
                        />
                    )
                }
            },
            {
                key:       'delete',
                width:     '3%',
                render: ()=>{
                    return (
                        <Icon
                            type="delete"
                        />
                    )
                }
            },
        ]
    }

    handleOk = () => {
        this.props.hideModal();
    };
    
    handleCancel = () => {
        this.props.hideModal();
    };

    fetchData() {
        var that = this;
        let token = localStorage.getItem('_my.carbook.pro_token');
        let url = API_URL;
        let params = `/labors`;
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
            data.labors.map((elem, index)=>{
                elem.key = index;
                elem.laborCode = `${elem.masterLaborId}-${elem.productId}`;
            })
            that.labors = data.labors;
        })
        .catch(function (error) {
            console.log('error', error)
        });

        params = `/store_groups`;
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
            that.storeGroups = data;
            that.buildStoreGroupsTree();
            that.getOptions();
        })
        .catch(function (error) {
            console.log('error', error)
        });
    }

    buildStoreGroupsTree() {
        var treeData = [];
        for(let i = 0; i < this.storeGroups.length; i++) {
            const parentGroup = this.storeGroups[i];
            treeData.push({
                title: parentGroup.name,
                value: parentGroup.id,
                key: `${i}`,
                children: [],
            })
            for(let j = 0; j < parentGroup.childGroups.length; j++) {
                const childGroup = parentGroup.childGroups[j];
                treeData[i].children.push({
                    title: childGroup.name,
                    value: childGroup.id,
                    key: `${i}-${j}`,
                    children: [],
                })
                for(let k = 0; k < childGroup.childGroups.length; k++) {
                    const lastNode = childGroup.childGroups[k];
                    treeData[i].children[j].children.push({
                        title: lastNode.name,
                        value: lastNode.id,
                        key: `${i}-${j}-${k}`,
                    })
                }
            }
        }
        this.treeData = treeData;
    }

    getOptions() {
        this.brandOptions = this.props.brands.map((elem, index)=>(
            <Option key={index} value={elem.brandId}>
                {elem.brandName}
            </Option>
        ));

        this.servicesOptions = this.labors.map((elem, index)=>(
            <Option key={index} value={elem.laborId}>
                {elem.name ? elem.name : elem.defaultName}
            </Option>
        ));
    };

    componentWillMount() {
        this.fetchData();
    }

    componentDidMount() {

    }

    render() {
        const { visible } = this.props;
        return (
            <div>
                <Modal
                    width="85%"
                    visible={visible}
                    title="PRODUCT"
                    onCancel={this.handleCancel}
                    onOk={this.handleOk}
                >
                    <div className={Styles.tableWrap}>
                        <div className={Styles.modalSectionTitle}>
                            <span>Узел/деталь</span>
                        </div>
                        <Table
                            style={{width: "90%"}}
                            dataSource={this.state.mainTableSource}
                            columns={this.mainTableColumns}
                            pagination={false}
                        />
                    </div>
                    <div className={Styles.tableWrap}>
                        <div className={Styles.modalSectionTitle}>
                            <span>Сопутствующие товары</span>
                        </div>
                        <Table
                            style={{width: "90%"}}
                            dataSource={this.state.relatedDetailsSource}
                            columns={this.mainTableColumns}
                            pagination={false}
                        />
                    </div>
                    <div className={Styles.tableWrap}>
                        <div className={Styles.modalSectionTitle}>
                            <span>Сопутствующие работы</span>
                        </div>
                        <Table
                            style={{width: "90%"}}
                            dataSource={this.state.relatedServicesSource}
                            columns={this.relatedServicesColumns}
                            pagination={false}
                        />
                    </div>
                </Modal>
            </div>
        )
    }
}
export default DetailProductModal;

@injectIntl
class CommentaryButton extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            visible: false,
            problems: undefined,
            currentCommentaryProps: {
                rcl: null,
                fcl: null,
                io: null,
                tb: null,
                side: [],
                front: [],
                back: [],
                problems: [],
                mm:null,
                percent: null,
                deg: null,
            },
            currentCommentary: null,
        }
        this.commentaryInput = React.createRef();
    }

    showModal = () => {
        this.setState({
            currentCommentary: this.props.commentary.comment?this.props.commentary.comment:this.state.currentCommentary,
            visible: true,
        });
        if(this.commentaryInput.current != undefined) {
            this.commentaryInput.current.focus();
        }
    };

    handleOk = () => {
        this.setState({
            loading: true,
        });
        console.log(this);
    };
    
    handleCancel = () => {
        this.setState({
            visible: false,
            loading: false,
            currentCommentary: null, 
        });
    };

    rendetHeader = () => {
        return (
            <div>
              <p>
                  {this.props.detail.name}
              </p>
            </div>
          );
    }

    setCurrentCommentaryProps(key, value) {
        const { detail } = this.props;
        if(key == "mm" || key == "percent" || key == "deg" || key == "problems") {
            if(this.state.currentCommentaryProps[key] == value) {
                this.state.currentCommentaryProps[key] = null;
            }
            else {
                this.state.currentCommentaryProps[key] = value;
            }
        }
        else {
            if(this.state.currentCommentaryProps[key].indexOf(value) != -1) {
                this.state.currentCommentaryProps[key] = [...this.state.currentCommentaryProps[key]].filter((data) => data != value);;
            }
            else {
                this.state.currentCommentaryProps[key].push(value);
            }
        }

        const { side, back, front, problems, mm, percent, deg } = this.state.currentCommentaryProps;
        var commentary = `${detail.name} - `;
        if(side.length) commentary += ` ${side.map((data)=>this.props.intl.formatMessage({id: data}))}. `;
        if(front.length) commentary += ` ${front.map((data)=>this.props.intl.formatMessage({id: data}))}. `;
        if(back.length) commentary += ` ${back.map((data)=>this.props.intl.formatMessage({id: data}))}. `;
        if(problems.length) commentary += ` ${problems.map((data)=>data)}. `;
        if(mm) commentary += ` ${mm}mm. `;
        if(percent) commentary += ` ${percent}%. `;
        if(deg) commentary += ` ${deg}°. `;


        this.setState({
            currentCommentary: commentary,
        });
    }

    componentDidMount() {
        this.state.currentCommentaryProps.mm = this.props.commentary.mm ? this.props.commentary.mm : 0;
        this.state.currentCommentaryProps.percent = this.props.commentary.percent ? this.props.commentary.percent : 0;
        this.state.currentCommentaryProps.deg = this.props.commentary.deg ? this.props.commentary.deg : 0;
    }

    componentDidUpdate() {
        
    }

    render() {
        const { TextArea } = Input;
        const { visible, loading, currentCommentaryProps, currentCommentary } = this.state;
        const { commentary } = this.props;
        const { disabled } = this.props;
        return (
            <div>
                {commentary.comment ? (
                    <Button
                        className={Styles.commentaryButton}
                        onClick={this.showModal}
                    >
                        <Icon
                            className={Styles.commentaryButtonIcon}
                            style={{color: "rgba(0, 0, 0, 0.65)"}}
                            type="form"/>
                    </Button>
                ) : (
                    <Button
                        disabled={disabled}
                        type="primary"
                        onClick={this.showModal}
                    >
                        <Icon type="message" />
                    </Button>
                )}
                <Modal
                    visible={visible}
                    title={this.rendetHeader()}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    footer={disabled?(
                        null
                        ):([
                            <Button key="back" onClick={this.handleCancel}>
                                {<FormattedMessage id='cancel' />}
                            </Button>,
                            <Button key="submit" type="primary" loading={loading} onClick={this.handleOk}>
                                {<FormattedMessage id='save' />}
                            </Button>,
                        ])
                    }
                >
                    {!disabled ? 
                    <div className={Styles.commentaryContentWrap}>
                        <div className={Styles.commentaryVehicleSchemeWrap}>
                            <div style={{
                                width: "360px",
                                height: "160px",
                                margin: "0 auto",
                                position: "relative",
                                backgroundImage: `url('${images.vehicleSchemeSide}')`,
                                backgroundSize: "contain",
                                backgroundPosition: "center",
                                backgroundRepeat: "no-repeat",
                            }}>
                                <Button
                                    type={currentCommentaryProps.side.indexOf("TOP") != -1 ? null : "primary"}
                                    style={{position: "absolute", top: "0%", left: "50%", transform: "translateX(-50%)"}}
                                    onClick={()=>{this.setCurrentCommentaryProps('side', 'TOP')}}
                                >
                                    <FormattedMessage id='TOP'/>
                                </Button>
                                <Button
                                    type={currentCommentaryProps.side.indexOf("REAR") != -1 ? null : "primary"}
                                    style={{position: "absolute", top: "50%", left: "0%", transform: "translateY(-50%)"}}
                                    onClick={()=>{this.setCurrentCommentaryProps('side', 'REAR')}}
                                >
                                    <FormattedMessage id='REAR'/>
                                </Button>
                                <Button
                                    type={currentCommentaryProps.side.indexOf("BOTTOM") != -1 ? null : "primary"}
                                    style={{position: "absolute", bottom: "0%", left: "50%", transform: "translateX(-50%)"}}
                                    onClick={()=>{this.setCurrentCommentaryProps('side', 'BOTTOM')}}
                                >
                                    <FormattedMessage id='BOTTOM'/>
                                </Button>
                                <Button
                                    type={currentCommentaryProps.side.indexOf("FRONT") != -1 ? null : "primary"}
                                    style={{position: "absolute", top: "50%", right: "0%", transform: "translateY(-50%)"}}
                                    onClick={()=>{this.setCurrentCommentaryProps('side', 'FRONT')}}
                                >
                                    <FormattedMessage id='FRONT'/>
                                </Button>
                                <Button
                                    type={currentCommentaryProps.side.indexOf("MIDDLE") != -1 ? null : "primary"}
                                    style={{position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)"}}
                                    onClick={()=>{this.setCurrentCommentaryProps('side', 'MIDDLE')}}
                                >
                                    <FormattedMessage id='MIDDLE'/>
                                </Button>
                            </div>
                            <div style={{display: "flex", justifyContent: "center"}}>
                                <div style={{
                                    width: "180px",
                                    height: "160px",
                                    position: "relative",
                                    backgroundImage: `url('${images.vehicleSchemeBack}')`,
                                    backgroundSize: "contain",
                                    backgroundPosition: "center",
                                    backgroundRepeat: "no-repeat",
                                }}>
                                    <Button
                                        type={currentCommentaryProps.back.indexOf("LEFT") != -1 ? null : "primary"}
                                        style={{position: "absolute", left: "0%", bottom: "0%"}}
                                        onClick={()=>{this.setCurrentCommentaryProps('back', 'LEFT')}}
                                    >
                                        <FormattedMessage id='LEFT'/>
                                    </Button>
                                    <Button
                                        type={currentCommentaryProps.back.indexOf("CENTER") != -1 ? null : "primary"}
                                        style={{position: "absolute", left: "50%", bottom: "50%", transform: "translate(-50%, 50%)"}}
                                        onClick={()=>{this.setCurrentCommentaryProps('back', 'CENTER')}}
                                    >
                                        <FormattedMessage id='CENTER'/>
                                    </Button>
                                    <Button
                                        type={currentCommentaryProps.back.indexOf("RIGHT") != -1 ? null : "primary"}
                                        style={{position: "absolute", right: "0%", bottom: "0%"}}
                                        onClick={()=>{this.setCurrentCommentaryProps('back', 'RIGHT')}}
                                    >
                                        <FormattedMessage id='RIGHT'/>
                                    </Button>
                                </div>
                                <div style={{
                                    width: "180px",
                                    height: "160px",
                                    position: "relative",
                                    backgroundImage: `url('${images.vehicleSchemeFront}')`,
                                    backgroundSize: "contain",
                                    backgroundPosition: "center",
                                    backgroundRepeat: "no-repeat",
                                }}>
                                    <Button
                                        type={currentCommentaryProps.front.indexOf("IN") != -1 ? null : "primary"}
                                        style={{position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)"}}
                                        onClick={()=>{this.setCurrentCommentaryProps('front', 'IN')}}
                                    >
                                        <FormattedMessage id='IN'/>
                                    </Button>
                                    <Button
                                        type={currentCommentaryProps.front.indexOf("OUT") != -1 ? null : "primary"}
                                        style={{position: "absolute", right: "0%", top: "50%", transform: "translateY(-50%)"}}
                                        onClick={()=>{this.setCurrentCommentaryProps('front', 'OUT')}}
                                    >
                                        <FormattedMessage id='OUT'/>
                                    </Button>
                                </div>
                            </div>
                        </div>
                        <div>
                            <p className={Styles.commentarySectionHeader}>Параметры:</p>
                            <div style={{display: "flex"}}>
                                <div className={Styles.commentaryParameter}>
                                    <InputNumber
                                        value={currentCommentaryProps.mm || 0}
                                        formatter={value => `${value} mm.`}
                                        parser={value => value.replace(' %', '')}
                                        onChange={(mm)=>{this.setCurrentCommentaryProps('mm', mm)}}
                                    />
                                </div>
                                <div className={Styles.commentaryParameter}>
                                    <InputNumber
                                        value={currentCommentaryProps.percent || 0}
                                        formatter={value => `${value} %`}
                                        parser={value => value.replace(' %', '')}
                                        onChange={(percent)=>{this.setCurrentCommentaryProps('percent', percent)}}
                                    /> 
                                </div>
                                <div className={Styles.commentaryParameter}>
                                    <InputNumber
                                        value={currentCommentaryProps.deg || 0}
                                        formatter={value => `${value} °`}
                                        parser={value => value.replace(' °', '')}
                                        onChange={(deg)=>{this.setCurrentCommentaryProps('deg', deg)}}
                                    />
                                </div>
                            </div>
                        </div>
                    </div> : null}
                    <div>
                        <p className={Styles.commentarySectionHeader}>
                            <FormattedMessage id='order_form_table.diagnostic.commentary' />:
                        </p>
                        <TextArea
                            disabled={disabled}
                            value={currentCommentary}
                            placeholder={`${this.props.intl.formatMessage({id: 'comment'})}...`}
                            autoFocus
                            onChange={()=>{
                                this.setState({
                                    currentCommentary: event.target.value,
                                });
                            }}
                            style={{width: '100%', minHeight: '150px', resize:'none'}}
                            ref={this.commentaryInput}
                        />
                    </div>
                </Modal>
            </div>
        );
    }
}