// vendor
import React, { Component } from "react";
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Switch, Button, Icon, Input, Modal, Result} from 'antd';

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
import { element } from "prop-types";

@injectIntl
class AgreementPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            confirmed: false,
            dataSource: undefined,
            servicesList: [],
            detailsList: [],
            commentary: null,
        }
        this.servicesTotal = 0;
        this.detailsTotal = 0;
        this.updateData = this.updateData.bind(this);
        this.onSwitchService = this.onSwitchService.bind(this);
        this.onSwitchDetail = this.onSwitchDetail.bind(this);
    }

    showConfirm() {
        const title = this.props.intl.formatMessage({id: 'agreement.confirm_title'});
        const content = this.props.intl.formatMessage({id: 'agreement.confirm_content'});
        const { confirm } = Modal;
        confirm({
          title: title,
          content: content,
          onOk: ()=>{this.handleOk()},
          onCancel: ()=>{console.log('Canceled')},
        });
      }

    handleOk() {
        var resultData = {
            disableLaborIds: [],
            disableDetailIds: [],
            comment: this.state.commentary,
        };

        this.state.servicesList.map((elem)=>{
            if(!elem.checked) {
                resultData.disableLaborIds.push(elem.serviceId);
            }
        });

        this.state.detailsList.map((elem)=>{
            if(!elem.checked) {
                resultData.disableDetailIds.push(elem.storeGroupId);
            }
        });
        confirmAgreement(this.sessionId, resultData);
        this.setState({
            confirmed: true,
        })
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
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        this.sessionId = urlParams.get('sessionId');
        this.lang = urlParams.get('lang');
        getAgreementData(this.sessionId, this.lang, this.updateData);
    }

    render() {
        const { TextArea } = Input;
        const isMobile = window.innerWidth < 1200;
        const { dataSource, confirmed } = this.state;
        this.servicesTotal = 0;
        this.detailsTotal = 0;
        if(confirmed) {
            return (
                <Result
                    status="success"
                    title="Successfully Purchased Cloud Server ECS!"
                    subTitle="Order number: 2017182818828182881 Cloud server configuration takes 1-5 minutes, please wait."
                    style={{margin: "auto"}}
                />
            )
        }
        if(dataSource == undefined) {
            return (
                <Result
                    status="warning"
                    title="There are some problems with your operation."
                    style={{margin: "auto"}}
                />
            )
        }
        const vehicleNumber = dataSource.vehicleNumber;
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
                    isMobile={isMobile}
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
                    isMobile={isMobile}
                />
            )
        });
        return isMobile ? (
            <div className={Styles.agreementPage}>
                <div className={Styles.agreementHeader}>
                    <div>{vehicleNumber}</div>
                    <div>{this.servicesTotal + this.detailsTotal} <FormattedMessage id='cur'/></div>
                    <div style={{height: "100%"}}>
                        <Button
                            style={{height: "100%"}}
                            type="primary"
                            onClick={()=>{this.showConfirm()}}
                        >
                            <FormattedMessage id='save'/>
                        </Button>
                    </div>
                </div>
                {servicesElements.length ?
                    <div className={Styles.servicesWrap}>
                        <div className={Styles.sectionHeader}>
                            <FormattedMessage id='add_order_form.services'/>
                            <span className={Styles.totalSum}>{this.servicesTotal} <FormattedMessage id='cur'/></span>
                        </div>
                        {servicesElements}
                    </div>
                : null}
                {detailsElements.length ?
                    <div className={Styles.detailsWrap}>
                        <div className={Styles.sectionHeader}>
                            <FormattedMessage id="add_order_form.details"/>
                            <span className={Styles.totalSum}>{this.detailsTotal} <FormattedMessage id='cur'/></span>
                        </div>
                        {detailsElements}
                    </div>
                : null}
                <div className={Styles.commentWrap}>
                    <div className={Styles.sectionHeader}>
                        <FormattedMessage id="comment"/>
                    </div>
                    <div className={Styles.commentElement}>
                        <TextArea
                            className={Styles.commentaryTextArea}
                            placeholder={`${this.props.intl.formatMessage({id: 'comment'})}...`}
                            rows={5}
                            onChange={()=>{this.state.commentary = event.target.value}}
                        />
                    </div>
                </div>
            </div>
        ) : (
            <div className={Styles.agreementPage}>
                <div className={Styles.vehicleInfoWrap}>
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
                        <span><FormattedMessage id="hours"/>/<FormattedMessage id="count"/></span>
                    </div>
                    <div className={`${Styles.columnHeader} ${Styles.rowSum}`}>
                        <span><FormattedMessage id="sum"/></span>
                    </div>
                    <div className={`${Styles.columnHeader} ${Styles.rowSwitch}`}>
                        <span></span>
                    </div>
                </div>
                {servicesElements.length ?
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
                : null}
                {detailsElements.length ?
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
                : null}
                <div>
                    <TextArea
                        className={Styles.commentaryTextArea}
                        placeholder={`${this.props.intl.formatMessage({id: 'comment'})}...`}
                        rows={5}
                        onChange={()=>{this.state.commentary = event.target.value}}
                    />
                </div>
                <div className={`${Styles.agreementTotalSum} ${Styles.totalWrap}`}>
                    <span>Итог:</span>
                    <span className={Styles.totalSum}>{this.servicesTotal + this.detailsTotal} <FormattedMessage id='cur'/></span>
                </div>
                <Button
                    type="primary"
                    onClick={()=>{this.showConfirm()}}
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
        const { isMobile, checked } = this.props;
        return isMobile ? (
            <div className={`${Styles.serviceElement} ${ checked ? null: Styles.disabledRow}`}>
                <div style={{width:"10%", fontSize: "18px", textAlign:"left"}}>
                    {this.props.num}
                </div>
                <div style={{width:"62%", textAlign:"left"}}>
                    <p style={{padding: "5px 0"}}>{data.serviceName}</p>
                    {data.comment.asd == null ? 
                        null
                        :
                        <p style={{fontStyle:"italic", padding: "5px 0"}}>
                            {data.comment.asd}
                        </p> 
                    }
                </div>
                <div style={{width:"13%", fontSize: "18px"}}>{data.hours}</div>
                <div style={{width:"15%"}}>
                    <div style={{width:"100%", padding: "5px 0"}}>{data.sum}</div>
                    <div style={{width:"100%", padding: "5px 0"}}>
                        <Switch
                            checked={checked}
                            onClick={(value)=>{
                                this.props.onSwitchService(this.props.num-1, value);
                            }}
                        />
                    </div>
                </div>
            </div>
            ) : (
            <div className={`${Styles.serviceElement} ${ checked ? null: Styles.disabledRow}`}>
                <div className={Styles.rowKey}>
                    <span>{this.props.num}</span>
                </div>
                <div className={Styles.rowName}>
                    <span>{data.serviceName}</span>
                </div>
                <div className={Styles.rowComment}>
                    <span>{data.comment?data.comment.asd:null}</span>
                </div>
                <div className={Styles.rowPrice}>
                    <span>{data.price} <FormattedMessage id='cur'/></span>
                </div>
                <div className={Styles.rowCount}>
                    <span>{data.hours} <FormattedMessage id='add_order_form.hours_shortcut'/></span>
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
        const { isMobile, checked } = this.props
        return isMobile ? (
            <div className={`${Styles.detailElement} ${ checked ? null: Styles.disabledRow}`}>
                <div style={{width:"10%", fontSize: "18px", textAlign:"left"}}>
                    {this.props.num}
                </div>
                <div style={{width:"62%", textAlign:"left"}}>
                    <p style={{padding: "5px 0"}}>{data.detailName}</p>
                    {data.detailBrand == null ? 
                        null
                        :
                        <p style={{fontStyle:"italic", padding: "5px 0"}}>
                            {data.detailBrand}
                        </p> 
                    }
                </div>
                <div style={{width:"13%", fontSize: "18px"}}>{data.count}</div>
                <div style={{width:"15%"}}>
                    <div style={{width:"100%", padding: "5px 0"}}>{data.sum}</div>
                    <div style={{width:"100%", padding: "5px 0"}}>
                        <Switch
                            checked={checked}
                            onClick={(value)=>{
                                this.props.onSwitchDetail(this.props.num-1, value);
                            }}
                        />
                    </div>
                </div>
            </div>
            ) : (
            <div className={`${Styles.detailElement} ${ checked ? null: Styles.disabledRow}`}>
                <div className={Styles.rowKey}>
                    <span>{this.props.num}</span>
                </div>
                <div className={Styles.rowName}>
                    <span>{data.detailName}</span>
                </div>
                <div className={Styles.rowComment}>
                    <span>{data.detailBrand}</span>
                </div>
                <div className={Styles.rowPrice}>
                    <span>{data.price} <FormattedMessage id='cur'/></span>
                </div>
                <div className={Styles.rowCount}>
                    <span>{data.count} <FormattedMessage id='pc'/></span>
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