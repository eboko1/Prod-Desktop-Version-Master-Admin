// vendor
import React, { Component } from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Form, Button, Input, Select, Modal, Icon, Upload } from 'antd';
import { v4 } from 'uuid';
import _ from 'lodash';
import moment from 'moment';
import {API_URL,
    addNewDiagnosticTemplate,
    getDiagnosticsTemplates,
    addNewDiagnosticRow,
    sendDiagnosticAnswer,
    deleteDiagnosticProcess,
    deleteDiagnosticTemplate} from 'core/forms/orderDiagnosticForm/saga';

// proj
// import { onChangeMobileRecordForm } from 'core/forms/mobileRecordForm/duck';
import {
    onChangeOrderForm,
} from 'core/forms/orderForm/duck';

import {
    DecoratedInput,
    DecoratedSelect,
    DecoratedTextArea,
    DecoratedDatePicker,
    DecoratedTimePicker,
    DecoratedSlider,
} from 'forms/DecoratedFields';

import { ConfirmDiagnosticModal } from 'modals'

import { withReduxForm } from 'utils';
import { permissions, isForbidden } from "utils";

import Styles from './styles.m.css';

const FormItem = Form.Item;
const Option = Select.Option;

const formItemLayout = {
    labelCol: {
        xl:  { span: 24 },
        xxl: { span: 4 },
    },
    wrapperCol: {
        xl:  { span: 24 },
        xxl: { span: 20 },
    },
    colon: false,
};

@injectIntl
@withReduxForm({
    name:            'orderForm',
    debouncedFields: [ 'comment', 'recommendation', 'vehicleCondition', 'businessComment' ],
    actions:         {
        change: onChangeOrderForm,
    },
})
export class MobileRecordForm extends Component {

    render() {
        const {
            selectedClient,
            stations,
            onStatusChange,
            orderDiagnostic,
            order: { status },
        } = this.props;
        const { getFieldDecorator, getFieldsValue } = this.props.form;
        const { formatMessage } = this.props.intl;

        const isDurationDisabled = _.every(
            getFieldsValue([ 'stationLoads[0].beginDate', 'stationLoads[0].beginTime', 'stationLoads[0].station' ]),
        );
        return (
            <Form layout='horizontal'>
                <div style={{display: 'none'}}>
                    <DecoratedInput
                        field="stationLoads[0].status"
                        hiddeninput='hiddeninput'
                        formItem
                        initialValue={
                            'TO_DO'
                        }
                        getFieldDecorator={getFieldDecorator}
                    />
                </div>
                <div className={ Styles.mobileRecordFormFooter }>
                    { status !== 'cancel' &&
                        status !== 'approve' && (
                        <Button
                            className={ Styles.mobileRecordSubmitBtn }
                            type='primary'
                            onClick={ () => onStatusChange('approve') }
                        >
                            <FormattedMessage id='add_order_form.save_appointment' />
                        </Button>
                    ) }
                    { status !== 'cancel' && (
                        <Button
                            className={ Styles.mobileRecordSubmitBtn }
                            onClick={ () => onStatusChange('cancel') }
                        >
                            <FormattedMessage id='close' />
                        </Button>
                    ) }
                </div>
                <FormItem
                    label={ <FormattedMessage id='add_order_form.name' /> }
                    { ...formItemLayout }
                >
                    <Input
                        placeholder={ formatMessage({
                            id:             'add_order_form.select_name',
                            defaultMessage: 'Select client',
                        }) }
                        disabled
                        value={
                            selectedClient.name || selectedClient.surname
                                ? (selectedClient.surname
                                    ? selectedClient.surname + ' '
                                    : '') + `${selectedClient.name}`
                                : void 0
                        }
                    />
                </FormItem>
                <DecoratedSelect
                    label={ <FormattedMessage id='add_order_form.phone' /> }
                    field='clientPhone'
                    initialValue={this.props.order.clientPhone}
                    formItem
                    formItemLayout={ formItemLayout }
                    hasFeedback
                    className={ Styles.clientCol }
                    colon={ false }
                    rules={ [
                        {
                            required: true,
                            message:  formatMessage({
                                id: 'required_field',
                            }),
                        },
                    ] }
                    getFieldDecorator={ getFieldDecorator }
                    placeholder={ formatMessage({
                        id: 'add_order_form.select_client_phone',
                    }) }
                >
                    { selectedClient.phones.filter(Boolean).map(phone => (
                        <Option value={ phone } key={ v4() }>
                            { phone }
                        </Option>
                    )) }
                </DecoratedSelect>
                <DecoratedSelect
                    field='clientVehicle'
                    initialValue={this.props.order.clientVehicleId}
                    formItem
                    hasFeedback
                    label={ <FormattedMessage id='add_order_form.car' /> }
                    formItemLayout={ formItemLayout }
                    colon={ false }
                    className={ Styles.clientCol }
                    getFieldDecorator={ getFieldDecorator }
                    rules={ [
                        {
                            required: true,
                            message:  formatMessage({
                                id: 'required_field',
                            }),
                        },
                    ] }
                    placeholder={ formatMessage({
                        id: 'add_order_form.select_client_vehicle',
                    }) }
                    optionDisabled='enabled'
                >
                    { selectedClient.vehicles.map(vehicle => (
                        <Option value={ vehicle.id } key={ v4() }>
                            { `${vehicle.make} ${
                                vehicle.model
                            } ${vehicle.number || vehicle.vin || ''}` }
                        </Option>
                    )) }
                </DecoratedSelect>
                <hr />
                <DecoratedSelect
                    field='manager'
                    initialValue={this.props.order.managerId}
                    formItem
                    getFieldDecorator={ getFieldDecorator }
                    rules={ [
                        {
                            required: true,
                            message:  formatMessage({
                                id: 'required_field',
                            }),
                        },
                    ] }
                    label={ <FormattedMessage id='add_order_form.manager' /> }
                    hasFeedback
                    colon={ false }
                    className={ Styles.datePanelItem }
                    placeholder={ formatMessage({
                        id: 'add_order_form.select_manager',
                    }) }
                >
                    { this.props.managers.map(manager => (
                        <Option
                            disabled={ manager.disabled }
                            value={ manager.id }
                            key={ v4() }
                        >
                            { `${manager.managerName} ${manager.managerSurname}` }
                        </Option>
                    )) }
                </DecoratedSelect>
                <hr />
                <div style={ { fontSize: '18px', marginBottom: '10px' } }>
                    <FormattedMessage id='add_order_form.appointment_details' />
                </div>
                <DecoratedSelect
                    field='stationLoads[0].station'
                    initialValue={this.props.order.stationNum}
                    rules={ [
                        {
                            required: true,
                            message:  formatMessage({
                                id: 'required_field',
                            }),
                        },
                    ] }
                    formItem
                    label={ <FormattedMessage id='add_order_form.station' /> }
                    colon={ false }
                    hasFeedback
                    className={ Styles.datePanelItem }
                    getFieldDecorator={ getFieldDecorator }
                    placeholder={
                        <FormattedMessage id='add_order_form.select_station' />
                    }
                    options={ stations }
                    optionValue='num'
                    optionLabel='name'
                />
                <DecoratedDatePicker
                    formItem
                    initialValue={moment(this.props.order.beginDatetime).toISOString()}
                    field='stationLoads[0].beginDate'
                    hasFeedback
                    label={ <FormattedMessage id='date' /> }
                    className={ Styles.datePanelItem }
                    getFieldDecorator={ getFieldDecorator }
                    formatMessage={ formatMessage }
                    allowClear={ false }
                    { ...formItemLayout }
                />
                <DecoratedTimePicker
                    field='stationLoads[0].beginTime'
                    initialValue={moment(this.props.order.deliveryDatetime).toISOString()}
                    formItem
                    hasFeedback
                    inputReadOnly
                    allowClear={ false }
                    disabled={
                        !this.props.form.getFieldValue('stationLoads[0].beginDate') ||
                        !this.props.form.getFieldValue('stationLoads[0].station')
                    }
                    disabledHours={ () => {
                        const availableHours = _.get(this.props.availableHours, '0', []);

                        return _.difference(
                            Array(24)
                                .fill(1)
                                .map((value, index) => index),
                            availableHours.map(availableHour =>
                                Number(moment(availableHour).format('HH'))),
                        );
                    } }
                    disabledMinutes={ hour => {
                        const availableHours = _.get(this.props.availableHours, '0', []);

                        const availableMinutes = availableHours
                            .map(availableHour => moment(availableHour))
                            .filter(
                                availableHour =>
                                    Number(availableHour.format('HH')) === hour,
                            )
                            .map(availableHour =>
                                Number(availableHour.format('mm')));

                        return _.difference([ 0, 30 ], availableMinutes);
                    } }
                    // disabledSeconds={ disabledSeconds }
                    label={ <FormattedMessage id='time' /> }
                    formatMessage={ formatMessage }
                    className={ Styles.datePanelItem }
                    getFieldDecorator={ getFieldDecorator }
                    minuteStep={ 30 }
                />

                <DecoratedSlider
                    formItem
                    label={ <FormattedMessage id='add_order_form.duration' /> }
                    field='stationLoads[0].duration'
                    initialValue={this.props.order.duration}
                    getFieldDecorator={ getFieldDecorator }
                    disabled={ !isDurationDisabled }
                    min={ 0 }
                    step={ 0.5 }
                    max={ 8 }
                    { ...formItemLayout }
                />
                <DecoratedTextArea
                    formItem
                    initialValue={this.props.order.comment}
                    label={
                        <FormattedMessage id='add_order_form.client_comments' />
                    }
                    getFieldDecorator={ getFieldDecorator }
                    field='comment'
                    rules={ [
                        {
                            max:     2000,
                            message: formatMessage({
                                id: 'field_should_be_below_2000_chars',
                            }),
                        },
                    ] }
                    placeholder={ formatMessage({
                        id:             'add_order_form.client_comments',
                        defaultMessage: 'Client_comments',
                    }) }
                    autosize={ { minRows: 2, maxRows: 6 } }
                />
                { !isForbidden(this.props.user, permissions.ACCESS_ORDER_DIAGNOSTICS) ? 
                <MobileDiagnostic
                    user={this.props.user}
                    orderId={this.props.orderId}
                    orderDiagnostic={this.props.orderDiagnostic}
                    vehicle={this.props.selectedClient.vehicles[0]}
                />
                : <></>}
            </Form>
        );
    }
}

class MobileDiagnostic extends Component {
    _isMounted = false;

    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            orderId: props.orderId,
            orderDiagnostic: props.orderDiagnostic,
            dataSource: [],
        }
        this.getCurrentDiagnostic = this.getCurrentDiagnostic.bind(this);
    }

    updateDataSource() {
        const { orderDiagnostic, orderId } = this.state;
        console.log("UpdateDataSource");
        const dataSource = [];

        const diagnosticTemplatesCount = _.pick(orderDiagnostic, [
            "diagnosticTemplatesCount",
        ]).diagnosticTemplatesCount;
        const diagnosticTemplates = _.pick(orderDiagnostic, [
            "diagnosticTemplates",
        ]).diagnosticTemplates;
        let key = 1;
        for(let i = 0; i < diagnosticTemplatesCount; i++) {
            let groupsCount = _.pick(diagnosticTemplates[i], [
                "groupsCount",
            ]).groupsCount;
            let diagnosticTemplateTitle = _.pick(diagnosticTemplates[i], [
                "diagnosticTemplateTitle",
            ]).diagnosticTemplateTitle;
            let diagnosticTemplateId = _.pick(diagnosticTemplates[i], [
                "diagnosticTemplateId",
            ]).diagnosticTemplateId;
            let groups = _.pick(diagnosticTemplates[i], [
                "groups",
            ]).groups;
            for(let j = 0; j < groupsCount; j++) {
                let groupTitle = _.pick(groups[j], [
                    "groupTitle",
                ]).groupTitle;
                let groupId = _.pick(groups[j], [
                    "groupId",
                ]).groupId;
                let partsCount = _.pick(groups[j], [
                    "partsCount",
                ]).partsCount;
                let parts = _.pick(groups[j], [
                    "parts",
                ]).parts;
                for(let k = 0; k < partsCount; k++) {
                    let partTitle = _.pick(parts[k], [
                        "partTitle",
                    ]).partTitle;
                    let actionTitle = _.pick(parts[k], [
                        "actionTitle",
                    ]).actionTitle;
                    let partId = _.pick(parts[k], [
                        "partId",
                    ]).partId;
                    let answer = _.pick(parts[k], [
                        "answer",
                    ]).answer;
                    let comment = _.pick(parts[k], [
                        "comment",
                    ]).comment;
                    let photo = _.pick(parts[k], [
                        "photo",
                    ]).photo;
                    dataSource.push({
                        key: key,
                        partId: partId,
                        plan: diagnosticTemplateTitle,
                        stage: groupTitle,
                        detail: partTitle,
                        actionTitle: actionTitle,
                        status: answer,
                        commentary: comment,
                        orderId: orderId,
                        diagnosticTemplateId: diagnosticTemplateId,
                        groupId: groupId,
                        photo: photo,
                    },);
                    key++;
                }
            }
        }
        /*dataSource.push({
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
            photo: "",
            allTemplatesData: orderDiagnostic,
        },);*/
        //this.state.dataSource = dataSource;
        //this.state.rowsCount = key;
        this.setState({
            dataSource: dataSource,
        });
        this.forceUpdate();
    }

    getCurrentDiagnostic() {
        var that = this;
        let token = localStorage.getItem('_my.carbook.pro_token');
        let url = API_URL;
        let params = `/orders/diagnostics?orderId=${this.state.orderId}`;
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
            that.state.orderDiagnostic = data.diagnosis;
            that.state.completed = data.diagnosis.completed;
            that.updateDataSource();
        })
        .catch(function (error) {
            console.log('error', error)
        });
    }

    getDiagnosticHeader() {
        const vehicle = this.props.vehicle;
        if(typeof vehicle != 'undefined') {
            return (
                <div className={Styles.diagnostic_header}>
                    <div className={Styles.diagnostic_vehicle_number}>{vehicle.number}</div>
                    <div className={Styles.diagnostic_vehicle_info}>{vehicle.make} {vehicle.model} {vehicle.modification}</div>
                    <ConfirmDiagnosticModal
                        user={this.props.user}
                        confirmed={this.state.completed}
                        orderId={this.props.orderId}
                        isMobile={true}
                        dataSource = {this.state.dataSource}
                        orderServices={this.props.orderServices}
                        orderDetails={this.props.orderDetails}
                        getCurrentDiagnostic={this.props.getCurrentDiagnostic}
                    />
                </div>
            )
        }
    }

    getDiagnosticElementsByTitle(title) {
        const dataSource = this.state.dataSource;

        return dataSource.map((data)=>{
            let color = "";
            if(data.status == 1) {
                color = "rgb(200,225,180)";
            }
            else if(data.status == 2) {
                color = "rgb(255,240,180)";
            }
            else if(data.status == 3) {
                color = "rgb(250,175,175)";
            }
            if(data.plan == title) {
                return  <div className={Styles.diagnostic} style={{backgroundColor: color}}>
                            <div className={Styles.diagnostic_key}>{data.key}</div>                           
                            <div className={Styles.diagnistic_info}>
                                <div className={Styles.diagnistic_info_up}>
                                    <div className={Styles.diagnostic_detail}>{data.detail}</div>
                                    <div>{data.actionTitle}</div> 
                                </div>                                
                                <div>                              
                                    <MobileDiagnosticStatusButton getCurrentDiagnostic={this.getCurrentDiagnostic} status={data.status} rowProp={data}/>
                                    <div className={Styles.diagnostic_buttons}>
                                        <CommentaryButton commentary={data.commentary} rowProp={data}/>
                                        <PhotoButton photo={data.photo} rowProp={data}/>
                                    </div>
                                </div>
                            </div>                       
                        </div>
            }
        })
    }

    getDiagnosticElements() {
        const dataSource = this.state.dataSource;
        let diagnosicTitles = [];
        for (let i = 0; i < dataSource.length; i++) {
            if(diagnosicTitles.indexOf(dataSource[i].plan) == -1) {
                diagnosicTitles.push(dataSource[i].plan);
            }
        }
        
        return diagnosicTitles.map((data)=>
            <div>
                <div className={Styles.diagnostic_title}>{data}</div>
                {this.getDiagnosticElementsByTitle(data)}
            </div>)
    }

    componentWillMount(){
        this.getCurrentDiagnostic();
    }

    componentDidMount() {
        this._isMounted = true;
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    showModal = () => {
        this.setState({
            visible: true,
        });
    };

    handleCancel = () => {
        this.setState({ visible: false });
    };

    render() {
        const vehicle = this.props.vehicle;
        const { visible, dataSource } = this.state;
        return (
            <div>
                <Button onClick={this.showModal} type="primary" style={{ width: "100%"}}>
                    <FormattedMessage id='order-page.diagnostic'/>
                </Button>
                <Modal
                    visible={visible}
                    title={<FormattedMessage id='order-page.diagnostic' />}
                    onCancel={this.handleCancel}
                    footer={[]}
                >
                    {this.getDiagnosticHeader()}
                    {this.getDiagnosticElements()}
                </Modal>
            </div>
        )
    }
}

class MobileDiagnosticStatusButton extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            status: props.status
        }
    }

    updateState() {
        this.state.status = this.props.status;
    }

    componentWillUpdate() {
        this.updateState();
    }

    handleClick = (status) => {
        const { rowProp } = this.props;
        sendDiagnosticAnswer(rowProp.orderId, rowProp.diagnosticTemplateId, rowProp.groupId, rowProp.partId, status);
        this.setState({status:status});
        setTimeout(this.props.getCurrentDiagnostic, 500);
    }
    render(){
        const status = this.state.status;
        return status > 0 ? (
            <div className={Styles.diagnostic_edit_button_wrap}>
                <Button className={Styles.diagnostic_status_button_edit} type="primary" onClick={()=>this.handleClick(0)}>
                    <FormattedMessage id='order_form_table.diagnostic.status.edit' />
                </Button>
            </div>
            ) : (
            <div className={Styles.diagnostic_status_button_wrap}>
                <Button className={Styles.diagnostic_status_button_ok} onClick={()=>this.handleClick(1)} style={{background:'rgb(81, 205, 102)'}}>
                    <FormattedMessage id='order_form_table.diagnostic.status.ok' />
                </Button>
                <Button className={Styles.diagnostic_status_button_bad} onClick={()=>this.handleClick(2)} style={{background:'rgb(255, 255, 0)'}}>
                    <FormattedMessage id='order_form_table.diagnostic.status.bad' />
                </Button>
                <Button className={Styles.diagnostic_status_button_critical} type="danger" onClick={()=>this.handleClick(3)} style={{background:'rgb(255, 126, 126)', color: 'black'}}>
                    <FormattedMessage id='order_form_table.diagnostic.status.critical' />
                </Button>
            </div>
        );
    }
}

class CommentaryButton extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            visible: false,
            commentary: props.commentary,
        }
    }

    showModal = () => {
        this.setState({
            visible: true,
        });
    };

    handleOk = () => {
        this.setState({ loading: true });
        const { rowProp } = this.props;
        sendDiagnosticAnswer(rowProp.orderId, rowProp.diagnosticTemplateId, rowProp.groupId, rowProp.partId, rowProp.status, this.state.commentary);
        setTimeout(() => {
            this.setState({ loading: false, visible: false });
        }, 100);
    };
    
    handleCancel = () => {
        this.setState({ visible: false });
    };

    render() {
        const { visible, loading } = this.state;
        const commentary = this.state.commentary;
        return (
            <div className={Styles.diagnistic_commentary_button}>
                {commentary? (
                    <Button onClick={this.showModal}><Icon type="form" /></Button>
                ) : (
                    <Button type="primary" onClick={this.showModal}><Icon type="message" /></Button>
                )}
                <Modal
                    visible={visible}
                    title={<FormattedMessage id='order_form_table.diagnostic.commentary' />}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    footer={[
                        <Button key="back" onClick={this.handleCancel}>
                            {<FormattedMessage id='cancel' />}
                        </Button>,
                        <Button key="submit" type="primary" loading={loading} onClick={this.handleOk}>
                            {<FormattedMessage id='add' />}
                        </Button>,
                    ]}
                    >
                    <textarea onChange={()=>{this.state.commentary = event.target.value}} style={{width: '100%', minHeight: '150px', resize:'none'}}>{commentary}</textarea>
                </Modal>
            </div>
        );
    }
}


class PhotoButton extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            visible: false,
            photo: props.photo,
        }
    }

    showModal = () => {
        this.setState({
            visible: true,
        });
    };

    handleOk = () => {
        this.setState({ loading: true });
        const { rowProp } = this.props;
        sendDiagnosticAnswer(rowProp.orderId, rowProp.diagnosticTemplateId, rowProp.groupId, rowProp.partId, rowProp.status, rowProp.commentary, this.state.photo);
        setTimeout(() => {
            this.setState({ loading: false, visible: false });
        }, 100);
    };
    
    handleCancel = () => {
        this.setState({ visible: false });
    };

    render() {
        const { visible, loading } = this.state;
        const fileList = [
            /*{
              uid: '-1',
              name: 'image.png',
              status: 'done',
              url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
              thumbUrl: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
            },
            {
              uid: '-2',
              name: 'yyy.png',
              status: 'error',
            },*/
          ];
        const props = {
            action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
            listType: 'picture',
            defaultFileList: [...fileList],
          };
        const photo = this.state.photo;
        return (
            <div className={Styles.diagnistic_photo_button}>
                {photo? (
                    <Button onClick={this.showModal}><Icon type="file-image" /></Button>
                ) : (
                    <Button type="primary" onClick={this.showModal}><Icon type="camera" /></Button>
                )}
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
                            {<FormattedMessage id='add' />}
                        </Button>,
                    ]}
                    >
                    <Upload {...props}>
                        <Button>
                            <Icon type="upload" />
                            <FormattedMessage id='upload' />
                        </Button>
                    </Upload>
                </Modal>
            </div>
        );
    }
}