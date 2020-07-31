// vendor
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Button, Modal, Icon, Select, Input, InputNumber, Spin, Table, TreeSelect, Checkbox } from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';
// proj
import {
    API_URL,
    confirmDiagnostic,
    createAgreement,
    lockDiagnostic,
} from 'core/forms/orderDiagnosticForm/saga';
import { images } from 'utils';
import { DetailStorageModal, DetailSupplierModal } from 'modals'
// own
import Styles from './styles.m.css';
const { TreeNode } = TreeSelect;
const Option = Select.Option;
const spinIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

@injectIntl
class FavouriteDetailsModal extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            dataSource: [],
            fetched: false,
        }

        this.storeGroups = [];
        this.treeData = [];
        this.brandOptions = [];

        this.setCode = this.setCode.bind(this);
        this.setSupplier = this.setSupplier.bind(this);
        this.setComment = this.setComment.bind(this);

        this.columns = [
            {
                title:  <FormattedMessage id="order_form_table.store_group" />,
                key:       'storeGroupId',
                dataIndex: 'storeGroupId',
                width:     '12%',
                render: (data, elem)=>{
                    return (
                        <TreeSelect
                            disabled
                            className={Styles.groupsTreeSelect}
                            showSearch
                            placeholder={this.props.intl.formatMessage({id: 'order_form_table.store_group'})}
                            style={{maxWidth: 160}}
                            value={data}
                            dropdownStyle={{ maxHeight: 400, overflow: 'auto', zIndex: "9999" }}
                            treeData={this.treeData}
                            filterTreeNode={(input, node) => {
                                return (
                                    node.props.title.toLowerCase().indexOf(input.toLowerCase()) >= 0 || 
                                    String(node.props.value).indexOf(input.toLowerCase()) >= 0
                                )
                            }}
                            onSelect={(value, option)=>{
                                this.state.dataSource[elem.key].storeGroupId = value;
                                this.state.dataSource[elem.key].detailName = option.props.name;
                                this.setState({
                                    update: true
                                })
                            }}
                        />
                    )
                }
                
            },
            {
                title:  <FormattedMessage id="order_form_table.detail_name" />,
                key:       'detailName',
                dataIndex: 'detailName',
                width:     '20%',
                render: (data, elem)=>{
                    return (
                        <Input
                            disabled={elem.storeGroupId == null}
                            placeholder={this.props.intl.formatMessage({id: 'order_form_table.detail_name'})}
                            style={{minWidth: 150}}
                            value={data}
                            onChange={(event)=>{
                                this.state.dataSource[elem.key].detailName = event.target.value;
                                this.setState({
                                    update: true
                                })
                            }}
                        />
                    )
                }
            },
            {
                title:  <FormattedMessage id="comment" />,
                key:       'comment',
                dataIndex: 'comment',
                width:     '5%',
                render: (data, elem)=>{
                    return (
                        <CommentaryButton
                            disabled={elem.storeGroupId == null}
                            commentary={
                                data || 
                                {
                                    comment: undefined,
                                    positions: [],
                                }
                            }
                            detail={elem.detailName}
                            setComment={this.setComment}
                            tableKey={elem.key}
                        />
                    )
                }
            },
            {
                title:  <FormattedMessage id="order_form_table.brand" />,
                key:       'brandId',
                dataIndex: 'brandId',
                width:     '10%',
                render: (data, elem)=>{
                    if(elem.brandName && !(elem.brandId)) {
                        const defaultBrand = this.props.brands.find((brand)=>brand.brandName==elem.brandName);
                        if(defaultBrand) {
                            this.state.dataSource[elem.key].brandId = defaultBrand.brandId;
                            this.setState({
                                update: true
                            })
                        }
                    }
                    return (
                        <Select
                            showSearch
                            disabled={elem.storeGroupId == null}
                            placeholder={this.props.intl.formatMessage({id: 'order_form_table.brand'})}
                            value={data ? data : undefined}
                            style={{maxWidth: 180, minWidth: 100}}
                            dropdownStyle={{ maxHeight: 400, overflow: 'auto', zIndex: "9999", minWidth: 220 }}
                            filterOption={(input, option) => {
                                return (
                                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0 || 
                                    String(option.props.value).indexOf(input.toLowerCase()) >= 0
                                )
                            }}
                            onSelect={(value, option)=>{
                                this.state.dataSource[elem.key].detailCode = undefined;
                                this.state.dataSource[elem.key].supplierName = undefined;
                                this.state.dataSource[elem.key].supplierBrandId = undefined;
                                this.state.dataSource[elem.key].supplierId = undefined;
                                this.state.dataSource[elem.key].store = null;
                                this.state.dataSource[elem.key].purchasePrice = 0;
                                this.state.dataSource[elem.key].price = 1;
                                this.state.dataSource[elem.key].count = 1;
                                this.state.dataSource[elem.key].sum = undefined;
                                this.state.dataSource[elem.key].brandId = value;
                                this.state.dataSource[elem.key].brandName = option.props.children;
                                this.setState({
                                    update: true
                                })
                            }}
                        >
                            {this.brandOptions}
                        </Select>
                    )
                }
            },
            {
                title:  <FormattedMessage id="order_form_table.detail_code" />,
                key:       'detailCode',
                dataIndex: 'detailCode',
                width:     '15%',
                render: (data, elem)=>{
                    return (
                        <div style={{display: "flex"}}>
                            <Input
                                style={{minWidth: 80, color: 'black'}}
                                placeholder={this.props.intl.formatMessage({id: 'order_form_table.detail_code'})}
                                value={data}
                                onChange={(event)=>{
                                    this.state.dataSource[elem.key].detailCode = event.target.value;
                                    this.setState({
                                        update: true
                                    })
                                }}
                            />
                            <DetailStorageModal
                                user={this.props.user}
                                tableKey={elem.key}
                                onSelect={this.setCode}
                                disabled={elem.storeGroupId == null}
                                tecdocId={this.props.tecdocId}
                                storeGroupId={this.state.dataSource[elem.key].storeGroupId}
                                setSupplier={this.setSupplier}
                                brandFilter={elem.brandName}
                                supplierId={elem.supplierId}
                                codeSearch={false}
                                codeFilter={elem.detailCode}
                                brandId={elem.brandId}
                            />
                        </div>
                    )
                }
            },
            {
                title:  <FormattedMessage id="order_form_table.supplier" />,
                key:       'supplier',
                dataIndex: 'supplierName',
                width:     '15%',
                render: (data, elem)=>{
                    return (
                        <div style={{display: "flex"}}>
                            <Input
                                style={{maxWidth: 180, color: 'black'}}
                                disabled
                                placeholder={this.props.intl.formatMessage({id: 'order_form_table.supplier'})}
                                value={data}
                            />
                            <DetailSupplierModal
                                user={this.props.user}
                                tableKey={elem.key}
                                disabled={elem.storeGroupId == null || !(elem.detailCode) || !(elem.brandName)}
                                onSelect={this.setSupplier}
                                storeGroupId={elem.storeGroupId}
                                brandId={elem.brandId}
                                detailCode={elem.detailCode}
                            />
                        </div>
                    )
                }
            },
            {
                title:  <div title={this.props.intl.formatMessage({id: 'order_form_table.AI_title'})}>
                            <FormattedMessage id="order_form_table.AI" />
                        </div>,
                key:       'AI',
                width:     '3%',
                render: (elem)=>{
                    let color = 'brown',
                        title = 'Поставщик не выбран!';
                    if(elem.store){
                        title=  `Сегодня: ${elem.store[0]} шт.\n` +
                                `Завтра: ${elem.store[1]} шт.\n` +
                                `Послезавтра: ${elem.store[2]} шт.\n` +
                                `Позже: ${elem.store[3]} шт.`;
                        if(elem.store[0] != '0') {
                            color = 'rgb(81, 205, 102)';
                        }
                        else if(elem.store[1] != 0) {
                            color = 'yellow';
                        }
                        else if(elem.store[2] != 0) {
                            color = 'orange';
                        }
                        else if(elem.store[3] != 0) {
                            color = 'red';
                        }
                    }
                    else {
                        color = 'grey';
                        
                    }
                    
                    return (
                        <div
                            style={{borderRadius: '50%', width: 18, height: 18, backgroundColor: color}}
                            title={title}
                        ></div>
                    )
                }
            },
            {
                title: <FormattedMessage id="order_form_table.purchasePrice" />,
                key:       'purchasePrice',
                dataIndex: 'purchasePrice',
                width:     '3%',
                render: (data, elem)=>{
                    return (
                        <InputNumber
                            disabled={elem.storeGroupId == null}
                            className={Styles.detailNumberInput}
                            value={Math.round(data*10)/10 || 0}
                            min={0}
                            formatter={ value =>
                                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
                            }
                            parser={ value =>
                                `${value}`.replace(/\$\s?|(\s)/g, '')
                            }
                            onChange={(value)=>{
                                this.state.dataSource[elem.key].purchasePrice = value;
                                this.setState({
                                    update: true
                                })
                            }}
                        />
                    )
                }
            },
            {
                title:  <FormattedMessage id="order_form_table.price" />,
                key:       'price',
                dataIndex: 'price',
                width:     '3%',
                render: (data, elem)=>{
                    return (
                        <InputNumber
                            disabled={elem.storeGroupId == null}
                            className={Styles.detailNumberInput}
                            value={Math.round(data*10)/10 || 1}
                            min={1}
                            formatter={ value =>
                                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
                            }
                            parser={ value =>
                                `${value}`.replace(/\$\s?|(\s)/g, '')
                            }
                            onChange={(value)=>{
                                this.state.dataSource[elem.key].price = value;
                                this.state.dataSource[elem.key].sum = value * this.state.dataSource[elem.key].count;
                                this.setState({
                                    update: true
                                })
                            }}
                        />
                    )
                }
            },
            {
                title:  <FormattedMessage id="order_form_table.count" />,
                key:       'count',
                dataIndex: 'count',
                width:     '3%',
                render: (data, elem)=>{
                    return (
                        <InputNumber
                            disabled={elem.storeGroupId == null}
                            className={Styles.detailNumberInput}
                            value={Math.round(data*10)/10 || 1}
                            min={0.1}
                            formatter={ value =>
                                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
                            }
                            parser={ value =>
                                `${value}`.replace(/\$\s?|(\s)/g, '')
                            }
                            onChange={(value)=>{
                                this.state.dataSource[elem.key].count = value;
                                this.state.dataSource[elem.key].sum = value * this.state.dataSource[elem.key].price;
                                this.setState({
                                    update: true
                                })
                            }}
                        />
                    )
                }
            },
            {
                title:  <FormattedMessage id="order_form_table.sum" />,
                key:       'sum',
                width:     '5%',
                render: (elem)=>{
                    const sum = (elem.price || 1) * (elem.count || 1);
                    return (
                        <InputNumber
                            disabled
                            className={Styles.detailNumberInput}
                            value={sum ? Math.round(sum*10)/10 : 1}
                            style={{color: "black"}}
                            formatter={ value =>
                                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
                            }
                            parser={ value =>
                                `${value}`.replace(/\$\s?|(\s)/g, '')
                            }
                        />
                    )
                }
            },
            {
                key:       'select',
                width:     '3%',
                render: (elem)=>{
                    return (
                        <Button
                            type='primary'
                            onClick={()=>{
                                this.handleOk(elem.key);
                            }}
                        >
                            <FormattedMessage id='select'/>
                        </Button>
                    )
                }
            },
        ];
    }

    handleOk = (index) => {
        var data = {
            insertMode: true,
            details: [],
            services: [],
        }
        data.details.push({
            storeGroupId: this.state.dataSource[index].storeGroupId,
            name: this.state.dataSource[index].detailName,
            productCode: this.state.dataSource[index].detailCode,
            supplierId: this.state.dataSource[index].supplierId,
            supplierBrandId: this.state.dataSource[index].supplierBrandId,
            brandName: this.state.dataSource[index].brandName,
            purchasePrice: this.state.dataSource[index].purchasePrice || 0,
            count: this.state.dataSource[index].count ? this.state.dataSource[index].count : 1,
            price: this.state.dataSource[index].price || 1,
            comment: this.state.dataSource[index].comment,
        })
        this.addDetailsAndLabors(data);
        this.setState({
            visible: false,
            fetched: false,
        })
    };
    
    handleCancel = () => {
        this.setState({
            visible: false,
            fetched: false,
        })
    };


    setCode(code, brand, storeId, key) {
        let tmp = this.brandOptions.find((elem)=>elem.props.children==brand);
        if(!tmp) {
            this.brandOptions.push(
                <Option key={this.brandOptions.length} value={this.brandOptions.length+1} >
                    {brand}
                </Option>
            )
        }
        const brandValue = tmp ? tmp.props.value : this.brandOptions.length;
        this.state.dataSource[key].detailCode = code;
        this.state.dataSource[key].brandId = brandValue;
        this.state.dataSource[key].brandName = brand;
        this.state.dataSource[key].storeId = storeId;
        this.setState({
            update: true
        })
    }

    setComment(comment, positions, index) {
        this.state.dataSource[index].comment = {
            comment: comment,
            positions: positions,
        };
        this.state.dataSource[index].detailName = comment || this.state.dataSource[index].detailName;
        this.setState({
            update: true
        })
    }

    setSupplier(supplierId, supplierName, supplierBrandId, purchasePrice, price, store, key) {
        this.state.dataSource[key].supplierId = supplierId;
        this.state.dataSource[key].supplierName = supplierName;
        this.state.dataSource[key].supplierBrandId = supplierBrandId;
        this.state.dataSource[key].purchasePrice = purchasePrice;
        this.state.dataSource[key].price = price;
        this.state.dataSource[key].store = store;
        this.setState({
            update: true
        })
    }

    async addDetailsAndLabors(data) {
        let token = localStorage.getItem('_my.carbook.pro_token');
        let url = API_URL;
        let params = `/orders/${this.props.orderId}`;
        url += params;
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
                this.props.updateDataSource();
            }
            else {
                console.log("BAD", result);
            }
        } catch (error) {
            console.error('ERROR:', error);
        }
    }

    fetchData() {
        if(!(this.props.tecdocId) || this.state.fetched) return;
        var that = this;
        let token = localStorage.getItem('_my.carbook.pro_token');
        let url = API_URL;
        let params = `/orders/frequent/details?modificationId=${this.props.tecdocId}`;
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
            data.details.map((elem, i)=>{
                elem.key = i;
                elem.detailName = elem.storeGroup.name;
                elem.detailCode = elem.partNumber;
                if(elem.pricelist && elem.pricelist.length) {
                    elem.store = elem.pricelist[0].store;
                    elem.purchasePrice = elem.pricelist[0].purchasePrice;
                    elem.markup = elem.pricelist[0].markup ? elem.pricelist[0].markup : 1.4;
                    elem.supplierName = elem.pricelist[0].businessSupplierName;
                    elem.supplierId = elem.pricelist[0].businessSupplierId;
                    elem.supplierBrandId = elem.pricelist[0].supplierBrandId;
                    elem.price = elem.purchasePrice * elem.markup;
                    elem.sum = elem.price;
                }
                else {
                    elem.supplierName = undefined;
                    elem.supplierId = undefined;
                }
            });
            that.setState({
                dataSource: data.details,
                fetched: true,
            })
        })
        .catch(function (error) {
            console.log('error', error)
            that.setState({
                fetched: true,
            })
        });

        that = this;
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
                title: `${parentGroup.name} (#${parentGroup.id})`,
                name: parentGroup.name,
                value: parentGroup.id,
                className: Styles.groupTreeOption,
                key: `${i}`,
                children: [],
            })
            for(let j = 0; j < parentGroup.childGroups.length; j++) {
                const childGroup = parentGroup.childGroups[j];
                treeData[i].children.push({
                    title: `${childGroup.name} (#${childGroup.id})`,
                    name: childGroup.name,
                    value: childGroup.id,
                    className: Styles.groupTreeOption,
                    key: `${i}-${j}`,
                    children: [],
                })
                for(let k = 0; k < childGroup.childGroups.length; k++) {
                    const lastNode = childGroup.childGroups[k];
                    treeData[i].children[j].children.push({
                        title: `${lastNode.name} (#${lastNode.id})`,
                        name: lastNode.name,
                        value: lastNode.id,
                        className: Styles.groupTreeOption,
                        key: `${i}-${j}-${k}`,
                        children: [],
                    })
                    for(let l = 0; l < lastNode.childGroups.length; l++) {
                        const elem = lastNode.childGroups[l];
                        treeData[i].children[j].children[k].children.push({
                            title: `${elem.name} (#${elem.id})`,
                            name: elem.name,
                            value: elem.id,
                            className: Styles.groupTreeOption,
                            key: `${i}-${j}-${k}-${l}`,
                        })
                    }
                }
            }
        }
        this.treeData = treeData;
    }

    getOptions() {
        this.brandOptions = this.props.brands.map((elem, index)=>(
            <Option key={index} value={elem.brandId} supplier_id={elem.supplierId}>
                {elem.brandName}
            </Option>
        ));
    };

    componentWillUpdate(_, nextState) {
        if(this.state.visible==false && nextState.visible==true) {
            this.fetchData();
        }
    }

    render() {
        const { visible } = this.state;
        return (
            <>
                <Button
                    type="primary"
                    disabled={this.props.disabled}
                    onClick={()=>{
                        this.setState({
                            visible: true,
                        })
                    }}
                    title={this.props.intl.formatMessage({id: "details_table.favorite_details"})}
                >
                    <Icon 
                        type="star"
                        theme="filled"
                        style={{fontSize: 18}}
                    />
                </Button>
                <Modal
                    width="95%"
                    visible={visible}
                    title={null}
                    onCancel={this.handleCancel}
                    onOk={this.handleOk}
                    footer={null}
                >
                    <div className={Styles.tableWrap} style={{overflowX: 'scroll'}}>
                        <div className={Styles.modalSectionTitle}>
                            <div style={{display: 'block'}}>Узел/деталь</div>
                        </div>
                        {this.state.fetched ? 
                            <Table
                                dataSource={this.state.dataSource}
                                columns={this.columns}
                                pagination={false}
                            />
                            :
                            <Spin indicator={spinIcon} />
                        }
                    </div>
                </Modal>
            </>
        )
    }
}
export default FavouriteDetailsModal;

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
        this.props.setComment(currentCommentary, currentCommentaryProps.positions, this.props.tableKey);
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
        console.log(commentary)

        return (
            <div>
                {commentary.comment ? (
                    <Button
                        className={Styles.commentaryButton}
                        onClick={this.showModal}
                        title={this.props.intl.formatMessage({id: "commentary.edit"})}
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
                        title={this.props.intl.formatMessage({id: "commentary.add"})}
                    >
                        <Icon type="message" />
                    </Button>
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