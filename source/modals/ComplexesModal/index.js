import React, { Component } from 'react';
import { Button, Modal, Icon, Input, Checkbox, InputNumber, Spin, TreeSelect, Select, Tabs } from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';
// proj
import { permissions, isForbidden, images } from "utils";
// own
import Styles from './styles.m.css';
const { Option } = Select;
const TabPane = Tabs.TabPane;
const spinIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

@injectIntl
export default class ComplexesModal extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            dataSource: [],
            selectedComplex: undefined,
            laborsDataSource: [],
            detailsDataSource: [],
        };

        this.complexTree = [];
    }

    buildComplexTree(dataSource) {
        var treeData = [];
        for (let i = 0; i < dataSource.length; i++) {
            const parentGroup = dataSource[ i ];
            treeData.push({
                title:      parentGroup.name,
                value:      parentGroup.id,
                key:        `${i}`,
                selectable: false,
                children:   [],
            });
            for (let j = 0; j < parentGroup.childs.length; j++) {
                const childGroup = parentGroup.childs[ j ];
                treeData[ i ].children.push({
                    title:      childGroup.name,
                    value:      childGroup.id,
                    key:        `${i}-${j}`,
                    labors:     childGroup.labors,
                    details:    childGroup.storeGroups,
                });
            }
        }
        this.complexTree = treeData;
    }

    fetchData() {
        var that = this;
        let token = localStorage.getItem('_my.carbook.pro_token');
        let url = __API_URL__ + `/complexes?hide=false`;
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
            that.buildComplexTree(data);
            that.setState({
                fetched: true,
                dataSource: data,
            });
        })
        .catch(function (error) {
            console.log('error', error);
            that.setState({
                fetched: true,
            });
        });
    }

    async addDetailsAndLabors(data) {
        let token = localStorage.getItem('_my.carbook.pro_token');
        let url = __API_URL__ + `/orders/${this.props.orderId}`;
        try {
            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            const result = await response.json();
            if(result.success) {
                this.props.reloadOrderForm(void 0, 'all');
            }
            else {
                console.log("BAD", result);
            }
        } catch (error) {
            console.error('ERROR:', error);
        }
    }

    handleCancel = () => {
        this.setState({
            visible: false,
            dataSource: [],
            selectedComplex: undefined,
            laborsDataSource: [],
            detailsDataSource: [],
        })
    }

    handleOk = () => {
        const { laborsDataSource, detailsDataSource } = this.state;
        this.setState({ visible: false });
        var data = {
            services: [],
            details: [],
            insertMode: true,
        }
        if(this.props.tecdocId) {
            data.modificationId = this.props.tecdocId;
        }
        laborsDataSource.map((element)=>{
            if(element.checked && element.id) {
                data.services.push({
                    serviceName:
                        element.commentary && element.commentary.positions.length ?
                        element.name + ' - ' + element.commentary.positions.map((data)=>` ${this.props.intl.formatMessage({id: data}).toLowerCase()}`) :
                        element.name,
                    serviceId: element.id,
                    count: Number(element.normHours || 1) * Number(this.props.laborTimeMultiplier  || 1),
                    servicePrice: element.price ? Number(element.price) : 0,
                    comment: element.commentary,
                })
            }
        });
        detailsDataSource.map((element)=>{
            if(element.checked && element.id) {
                data.details.push({
                    name:
                        element.commentary &&  element.commentary.positions.length ?
                        element.name + ' - ' + element.commentary.positions.map((data)=>` ${this.props.intl.formatMessage({id: data}).toLowerCase()}`) :
                        element.name,
                    storeGroupId: element.id,
                    count: element.count || 1,
                    comment: element.commentary,
                })
            }
        });
        this.addDetailsAndLabors(data);
        this.handleCancel();
    };

    componentDidUpdate() {
        if(!this.state.fetched && this.state.visible) {
            this.fetchData();
        } 
    }

    renderLaborsBlock(tabMode) {
        const { laborsDataSource } = this.state;
        const { labors } = this.props;
        return (
            <div className={Styles.laborsList} style={tabMode && {width: '100%'}}>
                <div className={Styles.listTitle}>
                    <FormattedMessage id='add_order_form.services' />
                </div>
                {laborsDataSource.map((elem, key)=>{
                    return (
                        <div key={key} className={Styles.listRow}>
                            <div>
                                {key+1}
                            </div>
                            <div>
                                <Checkbox
                                    checked={elem.checked}
                                    onChange={({target})=>{
                                        elem.checked = target.checked;
                                        this.setState({});
                                    }}
                                />
                            </div>
                            <div className={Styles.nameField}>
                                <Input
                                    disabled
                                    style={{color: 'var(--text)'}}
                                    value={elem.name}
                                />
                            </div>
                            <div>
                                <InputNumber
                                    value={elem.count}
                                    style={{color: 'var(--text)'}}
                                    step={0.1}
                                    min={0.1}
                                    onChange={(value)=>{
                                        elem.count = value;
                                        this.setState({});
                                    }}
                                />
                            </div>
                            <div>
                                <CommentaryButton
                                    disabled={!elem.name}
                                    commentary={elem.commentary}
                                    detail={elem.name}
                                    setComment={(comment, positions)=>{
                                        elem.commentary = {
                                            comment: comment,
                                            positions: positions,
                                        };
                                        this.setState({});
                                    }}
                                />
                            </div>
                            <div>
                                <Icon
                                    type="delete"
                                    className={Styles.deleteIcon}
                                    onClick={()=>{
                                        this.setState({
                                            laborsDataSource: laborsDataSource.filter((labor, index)=>index!=key)
                                        })
                                    }}
                                />
                            </div>
                        </div>
                    )
                })}
                <div className={Styles.listRow}>
                    <div>
                        {laborsDataSource.length+1}
                    </div>
                    <div>
                        <Checkbox checked disabled/>
                    </div>
                    <div className={Styles.nameField}>
                        <Select
                            showSearch
                            value={undefined}
                            dropdownStyle={ {
                                        maxHeight: 400,
                                        overflow:  'auto',
                                        zIndex:    '9999',
                                        minWidth:  220,
                                    } }
                            onSelect={(value, {props})=>{
                                laborsDataSource.push({
                                    id: value,
                                    name: props.name,
                                    count: Number(props.hours || 1) *  Number(this.props.laborTimeMultiplier || 1),
                                    normHours: props.hours,
                                    price: props.price,
                                    checked: true,
                                    commentary: {
                                        comment: undefined,
                                        positions: [],
                                    }
                                });
                                this.setState({});
                            }}
                        >
                            {labors.map(({laborId, name, price, normHours}, key)=>(
                                <Option
                                    key={key}
                                    value={laborId}
                                    price={price}
                                    hours={normHours}
                                    name={name}
                                >
                                    {name}
                                </Option>
                            ))}
                        </Select>
                    </div>
                    <div>
                        <InputNumber
                            value={1}
                            style={{color: 'var(--text)'}}
                            disabled
                            step={0.1}
                        />
                    </div>
                    <div>
                        <CommentaryButton
                            disabled
                            commentary={{
                                comment: undefined,
                                positions: [],
                            }}
                            
                        />
                    </div>
                    <div>
                        <Icon
                            className={Styles.disabledIcon}
                            type="delete"
                        />
                    </div>
                </div>
            </div>
        )
    }

    renderDetailsBlock(tabMode) {
        const { detailsDataSource } = this.state;
        const { detailsTreeData } = this.props;
        return (
            <div className={Styles.detailsList} style={tabMode && {width: '100%'}}>
                <div className={Styles.listTitle}>
                    <FormattedMessage id='add_order_form.details' />
                </div>
                {detailsDataSource.map((elem, key)=>{
                    return (
                        <div key={key} className={Styles.listRow}>
                            <div>
                                {key+1}
                            </div>
                            <div>
                                <Checkbox
                                    checked={elem.checked}
                                    onChange={({target})=>{
                                        elem.checked = target.checked;
                                        this.setState({});
                                    }}
                                />
                            </div>
                            <div className={Styles.nameField}>
                                <Input
                                    disabled
                                    style={{color: 'var(--text)'}}
                                    value={elem.name}
                                />
                            </div>
                            <div>
                                <InputNumber
                                    value={elem.count}
                                    style={{color: 'var(--text)'}}
                                    min={0.1}
                                    onChange={(value)=>{
                                        elem.count = value;
                                        this.setState({});
                                    }}
                                />
                            </div>
                            <div>
                                <CommentaryButton
                                    disabled={!elem.name}
                                    commentary={elem.commentary}
                                    detail={elem.name}
                                    setComment={(comment, positions)=>{
                                        elem.commentary = {
                                            comment: comment,
                                            positions: positions,
                                        };
                                        this.setState({});
                                    }}
                                />
                            </div>
                            <div>
                                <Icon
                                    type="delete"
                                    className={Styles.deleteIcon}
                                    onClick={()=>{
                                        this.setState({
                                            detailsDataSource: detailsDataSource.filter((labor, index)=>index!=key)
                                        })
                                    }}
                                />
                            </div>
                        </div>
                    )
                })}
                <div className={Styles.listRow}>
                    <div>
                        {detailsDataSource.length+1}
                    </div>
                    <div>
                        <Checkbox checked disabled/>
                    </div>
                    <div className={Styles.nameField}>
                        <TreeSelect
                            showSearch
                            //placeholder={this.props.intl.formatMessage({id: 'services_table.store_group'})}
                            value={undefined}
                            dropdownStyle={{ maxHeight: 400, overflow: 'auto', zIndex: "9999" }}
                            treeData={detailsTreeData}
                            filterTreeNode={(input, node) => {
                                return (
                                    node.props.title.toLowerCase().indexOf(input.toLowerCase()) >= 0 || 
                                    String(node.props.value).indexOf(input.toLowerCase()) >= 0
                                )
                            }}
                            onSelect={(value, title, {node})=>{
                                detailsDataSource.push({
                                    id: value,
                                    name: node.props.name,
                                    count: 1,
                                    checked: true,
                                    commentary: {
                                        comment: undefined,
                                        positions: [],
                                    }
                                });
                                this.setState({});
                            }}
                        />
                    </div>
                    <div>
                        <InputNumber
                            value={1}
                            style={{color: 'var(--text)'}}
                            disabled
                        />
                    </div>
                    <div>
                        <CommentaryButton
                            disabled
                            commentary={{
                                comment: undefined,
                                positions: [],
                            }}
                            
                        />
                    </div>
                    <div>
                        <Icon
                            className={Styles.disabledIcon}
                            type="delete"
                        />
                    </div>
                </div>
            </div>
        )
    }

    render() { 
        const { disabled, isMobile } = this.props;
        const { dataSource, selectedComplex, laborsDataSource, detailsDataSource } = this.state;

        return (
            <>
                <Button
                    type={'primary'}
                    disabled={disabled}
                    style={{verticalAlign: 'bottom'}}
                    onClick={()=>{
                        this.setState({visible: true})
                    }}
                >
                    <div
                        style={ {
                            width:           18,
                            height:          18,
                            backgroundColor: disabled ? 'black' : 'white',
                            mask:       `url(${images.complexesIcon}) no-repeat center / contain`,
                            WebkitMask: `url(${images.complexesIcon}) no-repeat center / contain`,
                            transform:  'scale(-1, 1)',
                        } }
                    ></div>
                </Button>
                <Modal
                    width={isMobile ? '95%' : '75%'}
                    visible={this.state.visible}
                    title={<FormattedMessage id='services_table.complexes'/>}
                    onCancel={this.handleCancel}
                    onOk={this.handleOk}
                    maskClosable={false}
                >
                    {this.state.fetched ? 
                        <div>
                            <div className={Styles.complexSelect}>
                                <TreeSelect
                                    allowClear
                                    showSearch
                                    placeholder={this.props.intl.formatMessage({id: 'services_table.store_group'})}
                                    value={selectedComplex}
                                    dropdownStyle={{ overflow: 'auto', zIndex: "9999", maxHeight: 500 }}
                                    treeData={this.complexTree}
                                    filterTreeNode={(input, node) => {
                                        return (
                                            node.props.title.toLowerCase().indexOf(input.toLowerCase()) >= 0 || 
                                            String(node.props.value).indexOf(input.toLowerCase()) >= 0
                                        )
                                    }}
                                    onChange={(value, label, {triggerNode})=>{
                                        const labors = triggerNode.props.labors.map((elem)=>{
                                            elem.checked = true;
                                            elem.id = elem.laborId,
                                            elem.count = Number(elem.normHours || 1) *  Number(this.props.laborTimeMultiplier || 1);
                                            elem.commentary = {
                                                comment: undefined,
                                                positions: [],
                                            };
                                            return elem;
                                        });
                                        const details = triggerNode.props.details.map((elem)=>{
                                            elem.checked = true;
                                            elem.count = 1;
                                            elem.commentary = {
                                                comment: undefined,
                                                positions: [],
                                            };
                                            return elem;
                                        })
                                        this.setState({
                                            selectedComplex: value,
                                            laborsDataSource: labors,
                                            detailsDataSource: details,
                                        })
                                    }}
                                />
                            </div>
                            {!isMobile ?
                                <div className={Styles.listsWrapper}>
                                    {this.renderLaborsBlock()}
                                    {this.renderDetailsBlock()}
                                </div> :
                                <Tabs
                                    type="card"
                                >
                                    <TabPane
                                        forceRender
                                        tab={this.props.intl.formatMessage({
                                            id: "add_order_form.services",
                                            defaultMessage: "Services",
                                        })}
                                        key="services"
                                    >
                                        {this.renderLaborsBlock(true)}
                                    </TabPane>
                                    <TabPane
                                        forceRender
                                        tab={this.props.intl.formatMessage({
                                            id: "add_order_form.details",
                                            defaultMessage: "Details",
                                        })}
                                        key="details"
                                    >
                                        {this.renderDetailsBlock(true)}
                                    </TabPane>
                                </Tabs>
                            }
                        </div>
                        :
                        <Spin indicator={spinIcon} />
                    }
                </Modal>
            </>
    )}
}

@injectIntl
class CommentaryButton extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            visible: false,
            currentCommentaryProps: {
                name: props.detail,
                positions : [],
            },
            currentCommentary: undefined,
        }
        this.commentaryInput = React.createRef();
        this.positions = [
            "front_axle",
            "ahead",
            "overhead",
            "rear_axle",
            "behind",
            "down_below",
            "Right_wheel",
            "on_right",
            "outside",
            "left_wheel",
            "left",
            "inside",
            "lever_arm",
            "at_both_sides",
            "centered",
        ];
        this._isMounted = false;
    }

    showModal = () => {
        this.setState({
            currentCommentary: this.props.commentary.comment ? this.props.commentary.comment : this.props.detail,
            visible: true,
            currentCommentaryProps: {
                positions: this.props.commentary.positions || [],
                problems: this.props.commentary.problems || [],
            }
        });
        if(this.commentaryInput.current != undefined) {
            this.commentaryInput.current.focus();
        }
    };

    handleOk = async () => {
        const {currentCommentary, currentCommentaryProps} = this.state;
        this.setState({
            loading: true,
        });
        this.props.setComment(currentCommentary, currentCommentaryProps.positions, this.props.tableKey, currentCommentaryProps.problems);
        setTimeout(() => {
            this.setState({ loading: false, visible: false });
        }, 500);
    };
    
    handleCancel = () => {
        this.setState({
            visible: false,
            currentCommentary: this.props.detail, 
            currentCommentaryProps: {
                name: this.props.detail,
                positions : [],
            },
        });
    };

    renderHeader = () => {
        return (
            <div>
              <p>
                  {this.props.detail}
              </p>
            </div>
          );
    }

    getCommentary() {
        const { currentCommentaryProps } = this.state;
        var currentCommentary = this.props.detail;

        if(currentCommentaryProps.positions.length) {
            currentCommentary += ' -'
            currentCommentary += currentCommentaryProps.positions.map((data)=>` ${this.props.intl.formatMessage({id: data}).toLowerCase()}`) + ';';
        }
        this.setState({
            currentCommentary: currentCommentary
        });
    }

    setCommentaryPosition(position) {
        const { currentCommentaryProps } = this.state;
        const positionIndex = currentCommentaryProps.positions.indexOf(position);
        if(positionIndex == -1) {
            currentCommentaryProps.positions.push(position);
        }
        else {
            currentCommentaryProps.positions = currentCommentaryProps.positions.filter((value, index)=>index != positionIndex);
        }
        this.getCommentary();
    }


    componentDidMount() {
        this._isMounted = true;
        const { commentary, detail } = this.props;
        if(this._isMounted) {
            this.setState({
                currentCommentaryProps: {
                    name: detail,
                    positions: commentary.positions || [],
                }
            })
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    render() {
        const { TextArea } = Input;
        const { visible, loading, currentCommentaryProps, currentCommentary } = this.state;
        const { disabled, commentary } = this.props;
        const { positions } = this;

        return (
            <div>
                {commentary.comment ? (
                        <Icon
                            onClick={this.showModal}
                            title={this.props.intl.formatMessage({id: "commentary.edit"})}
                            className={Styles.commentaryButtonIcon}
                            style={{color: "rgba(0, 0, 0, 0.65)"}}
                            type="form"
                        />
                ) : (
                        <Icon
                            style={disabled ? {color: "rgba(0, 0, 0, 0.25)", pointerEvents: "none"} : {}}
                            type="message"
                            onClick={()=>{
                                if(!disabled) this.showModal()
                            }}
                            title={this.props.intl.formatMessage({id: "commentary.add"})}
                        />
                )}
                <Modal
                    visible={visible}
                    title={this.renderHeader()}
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
                    maskClosable={false}
                >
                    <>
                    <div className={Styles.commentaryVehicleSchemeWrap}>
                        <p className={Styles.commentarySectionHeader}>
                            <FormattedMessage id='commentary_modal.where'/>?
                        </p>
                        <div className={Styles.blockButtonsWrap}>
                            {positions.map((position, key)=> {
                                return (
                                    <Button
                                        key={key}
                                        type={currentCommentaryProps.positions.findIndex((elem)=>position==elem) > -1 ? 'normal' : 'primary'}
                                        className={Styles.commentaryBlockButton}
                                        onClick={()=>{this.setCommentaryPosition(position)}}
                                    >
                                        <FormattedMessage id={position}/>
                                    </Button>
                                )
                            })}
                        </div>
                    </div>
                    <div>
                        <p className={Styles.commentarySectionHeader}>
                            <FormattedMessage id='order_form_table.diagnostic.commentary' />
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
                    </>
                </Modal>
            </div>
        );
    }
}