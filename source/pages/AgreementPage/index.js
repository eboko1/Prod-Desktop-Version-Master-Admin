// vendor
import React, { Component } from "react";
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Switch, Button, Icon, Input} from 'antd';

// proj
import {Layout, Spinner, MobileView, ResponsiveView, StyledButton} from 'commons';
import {
    API_URL,
    getAgreementData,
    confirmAgreement,
} from 'core/agreement/saga';

// own
import Styles from './styles.m.css';
import { update } from "ramda";

class AgreementPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: undefined,
            servicesList: [],
            detailsList: [],
        }
        this.servicesTotal = 0;
        this.detailsTotal = 0;
        this.updateData = this.updateData.bind(this);
        this.onSwitchService = this.onSwitchService.bind(this);
        this.onSwitchDetail = this.onSwitchDetail.bind(this);
    }

    updateData(data) {
        this.state.servicesList = data.labors.map((elem)=>{
            elem.checked = true;
            return elem;
        });
        this.state.detailsList = data.details.map((elem)=>{
            elem.checked = true;
            return elem;
        });
        this.setState({
            dataSource: data,
        });
    }

    onSwitchService(index, value) {
        this.state.servicesList[index].checked = value;
        this.setState({
            update: true,
        });
    }

    onSwitchDetail(index, value) {
        this.state.detailsList[index].checked = value;
        this.setState({
            update: true,
        });
    }

    componentDidMount() {
        // http://localhost:3000/agreement?sessionId=0d64ab71-f4f2-4aec-8ebf-aec6e706bf4b&lang=ru
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        this.sessionId = urlParams.get('sessionId');
        this.lang = urlParams.get('lang');
        getAgreementData(this.sessionId, this.lang, this.updateData);
    }

    render() {
        const { TextArea } = Input;
        const { dataSource } = this.state;
        this.servicesTotal = 0;
        this.detailsTotal = 0;
        if(dataSource == undefined) {
            return (
                <Spinner spin={true}/>
            )
        }
        const vehicleNumber = dataSource.vehicleNumber;
        const vehicleModel = "BMW X7";
        const vehicleYear = "2016 p.";
        const servicesElements = this.state.servicesList.map((data, index)=>{
            if(data.checked) {
                this.servicesTotal += data.sum;
            }
            return (
                <ServiceElement
                    key={index}
                    num={index+1}
                    data={data}
                    checked={data.checked}
                    onSwitchService={this.onSwitchService}
                />
            )
        });
        const detailsElements = this.state.detailsList.map((data, index)=>{
            if(data.checked) {
                this.detailsTotal += data.sum;
            }
            return (
                <DetailElement
                    key={index}
                    num={index+1}
                    data={data}
                    checked={data.checked}
                    onSwitchDetail={this.onSwitchDetail}
                />
            )
        });
        return (
            <div className={Styles.agreementPage}>
                <div className={Styles.vehicleInfoWrap}>
                    <div className={`${Styles.vehicleInfo} ${Styles.vehicleModel}`}>{vehicleModel}</div>
                    <div className={`${Styles.vehicleInfo} ${Styles.vehicleYear}`}>{vehicleYear}</div>
                    <div className={`${Styles.vehicleInfo} ${Styles.vehicleNumber}`}>{vehicleNumber}</div>
                </div>
                <div className={`${Styles.agreementHeader}`}>
                    <div className={`${Styles.columnHeader} ${Styles.rowKey}`}>
                        <span>#</span>
                    </div>
                    <div className={`${Styles.columnHeader} ${Styles.rowName}`}>
                        <span><FormattedMessage id="name"/></span>
                    </div>
                    <div className={`${Styles.columnHeader} ${Styles.rowComment}`}>
                        <span><FormattedMessage id="description"/></span>
                    </div>
                    <div className={`${Styles.columnHeader} ${Styles.rowPrice}`}>
                        <span><FormattedMessage id="price"/></span>
                    </div>
                    <div className={`${Styles.columnHeader} ${Styles.rowCount}`}>
                        <span><FormattedMessage id="count"/></span>
                    </div>
                    <div className={`${Styles.columnHeader} ${Styles.rowSum}`}>
                        <span><FormattedMessage id="sum"/></span>
                    </div>
                    <div className={`${Styles.columnHeader} ${Styles.rowSwitch}`}>
                        <span><FormattedMessage id="action"/></span>
                    </div>
                </div>
                <div className={Styles.servicesWrap}>
                    <div className={Styles.sectionHeader}>
                        <FormattedMessage id='add_order_form.services'/>
                    </div>
                    {servicesElements}
                    <div className={Styles.totalWrap}>
                        <FormattedMessage id='add_order_form.services'/>:
                        <span className={Styles.totalSum}>{this.servicesTotal} <FormattedMessage id='cur'/></span>
                    </div>
                </div>
                <div className={Styles.detailsWrap}>
                    <div className={Styles.sectionHeader}>
                        <FormattedMessage id="add_order_form.details"/>
                    </div>
                    {detailsElements}
                    <div className={Styles.totalWrap}>
                        <FormattedMessage id="add_order_form.details"/>:
                        <span className={Styles.totalSum}>{this.detailsTotal} <FormattedMessage id='cur'/></span>
                    </div>
                </div>
                <div>
                    <TextArea
                        className={Styles.commentaryTextArea}
                        placeholder={<FormattedMessage id='comment'/>}
                        rows={5}
                    />
                </div>
                <div className={`${Styles.agreementTotalSum} ${Styles.totalWrap}`}>
                    <span>Итог:</span>
                    <span className={Styles.totalSum}>{this.servicesTotal + this.detailsTotal} <FormattedMessage id='cur'/></span>
                </div>
                <Button
                    type="primary"
                    onClick={()=>{
                        confirmAgreement(this.sessionId, {
                            disableLaborIds: [],
                            disableDetailIds: [],
                            comment: "lol",
                        });
                    }}
                >
                    <FormattedMessage id='save'/>
                </Button>
            </div>
        );
    }
}

class ServiceElement extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            checked: props.checked,
            data: props.data,
        }
    }

    render() {
        const { data } = this.state;
        const { checked } = this.props
        return (
            <div className={`${Styles.serviceElement} ${ checked ? null: Styles.disabledRow}`}>
                <div className={Styles.rowKey}>
                    <span>{this.props.num}</span>
                </div>
                <div className={Styles.rowName}>
                    <span>{data.serviceName}</span>
                </div>
                <div className={Styles.rowComment}>
                    <span>{data.serviceName}</span>
                </div>
                <div className={Styles.rowPrice}>
                    <span>{data.price} <FormattedMessage id='cur'/></span>
                </div>
                <div className={Styles.rowCount}>
                    <span>{data.hours}</span>
                </div>
                <div className={Styles.rowSum}>
                    <span>{data.sum} <FormattedMessage id='cur'/></span>
                </div>
                <div className={Styles.rowSwitch}>
                    <Switch
                        checked={checked}
                        onClick={(value)=>{
                            this.props.onSwitchService(this.props.num-1, value);
                        }}
                    />
                </div>
            </div>
        )
    }
}

class DetailElement extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            checked: props.checked,
            data: props.data,
        }
    }

    render() {
        const { data } = this.state;
        const { checked } = this.props
        return (
            <div className={`${Styles.detailElement} ${ checked ? null: Styles.disabledRow}`}>
                <div className={Styles.rowKey}>
                    <span>{this.props.num}</span>
                </div>
                <div className={Styles.rowName}>
                    <span>{data.detailName}</span>
                </div>
                <div className={Styles.rowComment}>
                    <span>{data.detailName  }</span>
                </div>
                <div className={Styles.rowPrice}>
                    <span>{data.price} <FormattedMessage id='cur'/></span>
                </div>
                <div className={Styles.rowCount}>
                    <span>{data.count}</span>
                </div>
                <div className={Styles.rowSum}>
                    <span>{data.sum} <FormattedMessage id='cur'/></span>
                </div>
                <div className={Styles.rowSwitch}>
                    <Switch
                        checked={checked}
                        onClick={(value)=>{
                            this.props.onSwitchDetail(this.props.num-1, value);
                        }}
                    />
                </div>
            </div>
        )
    }
}

export default AgreementPage;