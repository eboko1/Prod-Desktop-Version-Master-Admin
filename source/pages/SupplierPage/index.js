// vendor
import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage, injectIntl } from "react-intl";
import { Tabs, Input, InputNumber, Button, notification } from "antd";
import { permissions, isForbidden } from "utils";

// proj
import { Layout, Catcher, Spinner } from 'commons';
import { RequisiteSettingContainer } from "containers";
import { deleteSupplierRequisite, postSupplierRequisite, updateSupplierRequisite } from "core/requisiteSettings/saga";

// own
import Styles from "./styles.m.css";
const { TabPane } = Tabs;

const mapStateToProps = state => ({
    user: state.auth,
});
@injectIntl
@connect(mapStateToProps)
export default class SupplierPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            requisitesModalVisible: false,
            requisiteData: undefined,
            requisitesDataSource: [],
            generalInfo: {},
            loading: true,
        };

        this.setRequisitesDataSource = this.setRequisitesDataSource.bind(this);
        this.updateRequisitesDataSource = this.updateRequisitesDataSource.bind(this);
        this.hideRequisitesModal = this.hideRequisitesModal.bind(this);
    }

    showRequisitesModal = (requisiteData = undefined) => {
        this.setState({
            requisitesModalVisible: true,
            requisiteData: requisiteData,
        })
    }

    hideRequisitesModal() {
        this.setState({
            requisitesModalVisible: false,
            requisiteData: undefined,
        })
        this.fetchData();
    }

    setRequisitesDataSource(data) {
        data.map((elem, i)=>{
            elem.key=i;
        });
        this.setState({
            requisitesDataSource: data,
        })
    }

    async updateRequisitesDataSource() {
        await this.setState({
            loading: true,
        })
        await this.fetchData();
        await this.setState({
            modalVisible: false,
            requisiteData: undefined,
        })
        await this.forceUpdate();
    }

    fetchData() {
        var that = this;
        let token = localStorage.getItem('_my.carbook.pro_token');
        let url = __API_URL__ + `/business_suppliers/${this.props.id}`;
        fetch(url, {
            method: 'GET',
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
            console.log(data);
            data.requisites.map((elem, key)=>{
                elem.key = key;
            });
            that.setState({
                generalInfo: data,
                requisitesDataSource: data.requisites,
                requisiteData: undefined,
                loading: false,
            })
        })
        .catch(function (error) {
            console.log('error', error);
        });
    }

    updateSupplier() {
        var re = /\S+@\S+\.\S+/;
        const { generalInfo } = this.state;
        const { intl: {formatMessage} } = this.props;
        const data = {
            name: generalInfo.name,
            contactName: generalInfo.contactName,
            phones: generalInfo.phones || [],
            emails: generalInfo.emails || [],
            paymentRespite: generalInfo.paymentRespite || 0,
        }
        if(generalInfo.emails && generalInfo.emails.length && !re.test(generalInfo.emails[0])) {
            notification.error({
                message: formatMessage({id: 'supplier.error.email'}),
            });
            return;
        }
        var that = this;
        let token = localStorage.getItem('_my.carbook.pro_token');
        let url = __API_URL__ + `/business_suppliers/${this.props.id}`;
        fetch(url, {
            method: 'PUT',
            headers: {
                'Authorization': token,
            },
            body: JSON.stringify(data),
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
            console.log('error', error);
        });
    }

    componentDidMount() {
        this.fetchData();
    }

    render() {
        const { user, location, id } = this.props;
        const { generalInfo, requisitesModalVisible, requisiteData, requisitesDataSource, loading } = this.state;
        return (
            <Layout
                title={<FormattedMessage id="order_form_table.supplier" />}
            >
                <Catcher>
                    <Tabs
                        defaultActiveKey= {location.state && location.state.tab || 'general'}
                        tabPosition='right'
                        type='card'
                    >
                        <TabPane
                            tab={
                                <FormattedMessage
                                    id={"client_container.general_info"}
                                />
                            }
                            key="general"
                        >
                            <div className={Styles.generalInfo}>
                                <div className={Styles.generalInfoItem}>
                                    <FormattedMessage id='client_requisites_container.name'/>
                                    <Input
                                        value={generalInfo.name}
                                        onChange={(event)=>{
                                            const { value } = event.target;
                                            generalInfo.name = value;
                                            this.setState({});
                                        }}
                                    />
                                </div>
                                <div className={Styles.generalInfoItem}>
                                    <FormattedMessage id='supplier.contact'/>
                                    <Input
                                        value={generalInfo.contactName}
                                        onChange={(event)=>{
                                            const { value } = event.target;
                                            generalInfo.contactName = value;
                                            this.setState({});
                                        }}
                                    />
                                </div>
                                <div className={Styles.generalInfoItem}>
                                    <FormattedMessage id='supplier.phone'/>
                                    <InputNumber
                                        style={{display: 'block', width: '100%'}}
                                        value={generalInfo.phones && Number(generalInfo.phones[0]) || null}
                                        onChange={(value)=>{
                                            generalInfo.phones = [String(value)];
                                            this.setState({});
                                        }}
                                    />
                                </div>
                                <div className={Styles.generalInfoItem}>
                                    <spin>E-mail</spin>
                                    <Input
                                        value={generalInfo.emails && generalInfo.emails[0]}
                                        onChange={(event)=>{
                                            const { value } = event.target;
                                            generalInfo.emails = [value];
                                            this.setState({});
                                        }}
                                    />
                                </div>
                                <div className={Styles.generalInfoItem}>
                                    <FormattedMessage id='supplier.paymentRespite'/>
                                    <InputNumber
                                        style={{
                                            margin: '0 0 0 8px'
                                        }}
                                        min={0}
                                        value={generalInfo.paymentRespite || 0}
                                        onChange={(value)=>{
                                            generalInfo.paymentRespite = value;
                                            this.setState({});
                                        }}
                                    /> <FormattedMessage id='universal_filters_form.days' />
                                </div>
                                <div className={Styles.generalInfoItem} style={{display: 'flex', justifyContent: 'flex-end'}}>
                                    <Button
                                        type='primary'
                                        onClick={()=>{
                                            this.updateSupplier();
                                        }}
                                    >
                                        <FormattedMessage id='save'/>
                                    </Button>
                                </div>
                            </div>
                        </TabPane>
                        <TabPane
                            tab={
                                <FormattedMessage
                                    id={"client_container.requisites"}
                                />
                            }
                            key="requisites"
                        >
                            <div style={{display: 'flex', justifyContent: 'flex-end'}}>
                                <Button
                                    type='primary'
                                    onClick={()=>{
                                        this.showRequisitesModal();
                                    }}
                                >
                                    <FormattedMessage id='add'/>
                                </Button>
                            </div>
                            <RequisiteSettingContainer
                                loading={loading}
                                modalVisible={requisitesModalVisible}
                                showModal={this.showRequisitesModal}
                                hideModal={this.hideRequisitesModal}
                                requisiteData={requisiteData}
                                dataSource={requisitesDataSource}
                                
                                updateDataSource={this.updateRequisitesDataSource}
                                deleteRequisite={deleteSupplierRequisite}
                                postRequisite={postSupplierRequisite}
                                updateRequisite={updateSupplierRequisite}
                                id={id}
                            />
                        </TabPane>
                        <TabPane
                            tab={
                                <FormattedMessage id={"supplier.orders"} />
                            }
                            key="orders"
                            disabled
                        >

                        </TabPane>
                        <TabPane
                            tab={
                                <FormattedMessage
                                    id={"supplier.supply"}
                                />
                            }
                            key="supply"
                            disabled
                        >

                        </TabPane>
                        
                        <TabPane
                            tab={<FormattedMessage id={ 'supplier.debt'}/>}
                            key='debt'
                            disabled
                        >
                            
                        </TabPane>
                    </Tabs>
                </Catcher>
            </Layout>
        );
    }
}
