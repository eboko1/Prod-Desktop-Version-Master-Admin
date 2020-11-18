// vendor
import React, { Component } from "react";
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Switch, Button, Icon, Input, Modal } from 'antd';
import { getLocale, setLocale } from 'utils';

// proj
import {Layout, Spinner, MobileView, ResponsiveView, StyledButton} from 'commons';
import {
    API_URL,
    getAgreementData,
    confirmAgreement,
} from 'core/agreement/saga';

// own
import Styles from './styles.m.css';

@injectIntl
class AgreementPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            confirmed: false,
            dataSource: undefined,
            servicesList: [],
            detailsList: [],
            commentary: null,
        }
        this.servicesTotal = 0;
        this.detailsTotal = 0;
        this.servicesDiscount = 0;
        this.detailsDiscount = 0;
        this.taxRate = 1;
        this.updateData = this.updateData.bind(this);
        this.onSwitchService = this.onSwitchService.bind(this);
        this.onSwitchDetail = this.onSwitchDetail.bind(this);
        this.business = {};
        this.manager = {};
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
                resultData.disableLaborIds.push(elem.id);
            }
        });

        this.state.detailsList.map((elem)=>{
            if(!elem.checked) {
                resultData.disableDetailIds.push(elem.id);
            }1
        });
        confirmAgreement(this.sessionId, resultData, this.props.intl.locale);
        this.setState({
            confirmed: true,
        })
    }

    updateData(data) {
        if(data.stats.isTaxPayer) {
            this.taxRate = 1 + data.stats.taxRate/100;
        }
        this.state.servicesList = data.labors.map((elem)=>{
            elem.checked = elem.agreement != 'REJECTED' ? true : false;
            elem.comment = elem.comment; //"**description**";
            elem.discount = data.servicesDiscount ? data.servicesDiscount/100 : 0;
            elem.price = Math.round(elem.price*(1-elem.discount)*10*this.taxRate)/10;
            elem.sum = elem.price * elem.count;
            return elem;
        });
        this.state.detailsList = data.details.map((elem)=>{
            elem.checked = elem.agreement != 'REJECTED' ? true : false;
            elem.discount = data.detailsDiscount ? data.detailsDiscount/100 : 0;
            elem.price = Math.round(elem.price*(1-elem.discount)*10*this.taxRate)/10;
            elem.sum = elem.price * elem.count;
            return elem;
        });
        this.detailsDiscount = data.detailsDiscount;
        this.servicesDiscount = data.servicesDiscount;
        this.business = data.business;
        this.manager = data.manager;
        this.setState({
            isOpened: data.isOpened,
            dataSource: data,
            loading: false,
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
        var localeLang = getLocale();
        if(localeLang == 'uk') localeLang = 'ua';
        if(localeLang != this.lang) {
            setLocale(this.lang);
            window.location.reload();
        }
        getAgreementData(this.sessionId, this.lang, this.updateData);
        window.addEventListener('resize', this.updateDimensions);
    }

    formatPhoneNumber = (str) => {
        //Filter only numbers from the input
        let cleaned = ('' + str).replace(/\D/g, '');
        
        //Check if the input is of correct
        let match = cleaned.match(/^(1|)?(\d{2})(\d{3})(\d{3})(\d{4})$/);
        
        if (match) {
          //Remove the matched extension code
          //Change this to format for any country code.
          let intlCode = (match[2] ? '+38 ' : '')
          return [intlCode, '(', match[3], ') ', match[4], '-', match[5]].join('')
        }
        
        return null;
    }

    updateDimensions = () => {
        this.setState({});
    };
    
    componentWillUnmount() {
        window.removeEventListener('resize', this.updateDimensions);
    }

    render() {
        const { TextArea } = Input;
        const isMobile = window.innerWidth < 1200;
        const { dataSource, confirmed, loading } = this.state;
        const { business, manager } = this;
        const { formatMessage } = this.props.intl;

        if(loading) {
            return (
                <Spinner spin/>
            )
        }
        if(confirmed) {
            return (
                <AgreementResult
                    status="success"
                    title="Successfully, Thanks!"
                    subtitle="You can close this tab"
                />
            )
        }
        if(dataSource == undefined) {
            return (
                <AgreementResult
                    title="There are some problems with your operation."
                />
            )
        }

        this.servicesTotal = 0;
        this.detailsTotal = 0;
        const vehicleNumber = dataSource.vehicle.vehiclenumber;
        const vehicleMake= dataSource.vehicle.make;
        const vehicleModel= dataSource.vehicle.model;
        const vehicleModification= dataSource.vehicle.modification;
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
                    discount={this.servicesDiscount ? this.servicesDiscount/100 : 0}
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
                    discount={this.detailsDiscount ? this.detailsDiscount/100 : 0}
                />
            )
        });
        const totalSum = Math.round((this.servicesTotal + this.detailsTotal)*10)/10;
        return isMobile ? (
            <div className={Styles.agreementPage}>
                <div className={Styles.agreementHeader}>
                    <div 
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            width: '100%'
                        }}
                    >
                        <div style={{textTransform: "uppercase"}}>
                            <p>{vehicleNumber}</p>
                            <p>{vehicleMake} {vehicleModel}</p>
                        </div>
                        <div>
                            <Button
                                style={{height: "100%"}}
                                type="primary"
                                onClick={()=>{this.showConfirm()}}
                            >
                                <FormattedMessage id='save'/>
                            </Button>
                        </div>
                    </div>
                    <div style={{marginTop: 15}}>
                        {`${formatMessage({id: 'order_form_table.total_sum'})}: ${totalSum} ${formatMessage({id: 'cur'})}`}
                    </div>
                </div>
                <div className={Styles.businessInfo}>
                    <span>{business.name}:</span> <a className={Styles.phoneNumber} href={`tel:${this.formatPhoneNumber(business.phones[0])}`}>{this.formatPhoneNumber(business.phones[0])}</a>
                </div>
                <div className={Styles.businessInfo}>
                    <span>{manager.name}:</span> <a className={Styles.phoneNumber} href={`tel:${this.formatPhoneNumber(manager.phone)}`}>{this.formatPhoneNumber(manager.phone)}</a>
                </div>
                {servicesElements.length ?
                    <div className={Styles.servicesWrap}>
                        <div className={Styles.sectionHeader}>
                            <FormattedMessage id='add_order_form.services'/>
                            <span className={Styles.totalSum}>{Math.round(this.servicesTotal*10)/10} <FormattedMessage id='cur'/></span>
                        </div>
                        {servicesElements}
                    </div>
                : null}
                {detailsElements.length ?
                    <div className={Styles.detailsWrap}>
                        <div className={Styles.sectionHeader}>
                            <FormattedMessage id="add_order_form.details"/>
                            <span className={Styles.totalSum}>{Math.round(this.detailsTotal*10)/10} <FormattedMessage id='cur'/></span>
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
                <div className={Styles.businessInfo}>
                    <span>{business.name}:</span> <a href={`tel:${this.formatPhoneNumber(business.phones[0])}`}>{this.formatPhoneNumber(business.phones[0])}</a>
                </div>
                <div className={Styles.businessInfo}>
                    <span>{manager.name}:</span> <a href={`tel:${this.formatPhoneNumber(manager.phone)}`}>{this.formatPhoneNumber(manager.phone)}</a>
                </div>
                <div className={Styles.vehicleInfoWrap}>
                    <div className={`${Styles.vehicleInfo} ${Styles.vehicleNumber}`}>
                        {vehicleMake} {vehicleModel} {vehicleModification} {vehicleNumber}
                    </div>
                </div>
                <div className={`${Styles.agreementHeader}`}>
                    <div className={`${Styles.columnHeader} ${Styles.rowKey}`}>
                        <span>#</span>
                    </div>
                    <div className={`${Styles.columnHeader} ${Styles.rowName}`}>
                        <span><FormattedMessage id="description"/></span>
                    </div>
                    <div className={`${Styles.columnHeader} ${Styles.rowComment}`}>
                        <span></span>
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
                            <span className={Styles.totalSum}>{Math.round(this.servicesTotal*10)/10} <FormattedMessage id='cur'/></span>
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
                            <span className={Styles.totalSum}>{Math.round(this.detailsTotal*10)/10} <FormattedMessage id='cur'/></span>
                        </div>
                    </div>
                : null}
                <div>
                    <TextArea
                        disabled={!this.state.isOpened}
                        className={Styles.commentaryTextArea}
                        placeholder={`${this.props.intl.formatMessage({id: 'comment'})}...`}
                        rows={5}
                        onChange={()=>{this.state.commentary = event.target.value}}
                    />
                </div>
                <div className={`${Styles.agreementTotalSum} ${Styles.totalWrap}`}>
                    <FormattedMessage id='order_form_table.total_sum'/>
                    <span className={Styles.totalSum}>{totalSum} <FormattedMessage id='cur'/></span>
                </div>
                <Button
                    disabled={!this.state.isOpened}
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
        const disabled = data.agreement == 'REJECTED' || data.agreement == 'AGREED';
        return isMobile ? (
            <div className={`${Styles.serviceElement} ${ disabled || !checked ? Styles.disabledRow : null }`} style={data.isCritical ? {backgroundColor: 'rgb(250,175,175)'} : null}>
                <div style={{width:"5%", fontSize: "18px"}}>
                    {this.props.num}
                </div>
                <div style={{width:"65%", padding: "0 5px"}}>
                    <p style={{padding: "5px 0"}}>{data.serviceName}</p>
                    {data.comment ? 
                        <p style={{fontStyle:"italic", padding: "5px 0"}}>
                            {data.comment.problems ? `${data.comment.problems.map((problem)=>" " + problem.toLowerCase())}` : ``}
                        </p> 
                        :
                        null
                    }
                </div>
                <div style={{width:"15%", fontSize: "16px"}}>{Math.round(data.count*10)/10}</div>
                <div style={{width:"15%"}}>
                    <div style={{width:"100%", padding: "5px 0"}}>
                        {Math.round(data.sum*10)/10}
                    </div>
                    <div style={{width:"100%", padding: "5px 0"}}>
                        <Switch
                            checked={disabled ? data.agreement == 'AGREED' : checked}
                            disabled={disabled}
                            onClick={(value)=>{
                                this.props.onSwitchService(this.props.num-1, value);
                            }}
                        />
                    </div>
                </div>
            </div>
            ) : (
            <div className={`${Styles.serviceElement} ${ disabled || !checked ? Styles.disabledRow : null }`} style={data.isCritical ? {backgroundColor: 'rgb(250,175,175)'} : null}>
                <div className={Styles.rowKey}>
                    <span>{this.props.num}</span>
                </div>
                <div className={Styles.rowName}>
                    <span>{data.serviceName}</span>
                </div>
                <div className={Styles.rowComment}>
                    <span>{data.comment && data.comment.problems ? `${data.comment.problems.map((problem)=>" " + problem.toLowerCase())}` : null}</span>
                </div>
                <div className={Styles.rowPrice}>
                    <span>{Math.round(data.price*10)/10}</span>
                </div>
                <div className={Styles.rowCount}>
                    <span>{Math.round(data.count*10)/10} <FormattedMessage id='add_order_form.hours_shortcut'/></span>
                </div>
                <div className={Styles.rowSum}>
                    <span>{Math.round(data.sum*10)/10}</span>
                </div>
                <div className={Styles.rowSwitch}>
                    <Switch
                        checked={disabled ? data.agreement == 'AGREED' : checked}
                        disabled={disabled}
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
        const disabled = data.agreement == 'REJECTED' || data.agreement == 'AGREED';
        return isMobile ? (
            <div className={`${Styles.detailElement} ${ disabled || !checked ? Styles.disabledRow : null }`} style={data.isCritical ? {backgroundColor: 'rgb(250,175,175)'} : null}>
                <div style={{width:"5%", fontSize: "18px"}}>
                    {this.props.num}
                </div>
                <div style={{width:"65%", padding: "0 5px"}}>
                    <p style={{padding: "5px 0"}}>{data.detailName}</p>
                    {data.detailBrand == null ? 
                        null
                        :
                        <p style={{fontStyle:"italic", padding: "5px 0"}}>
                            {data.detailBrand}
                        </p> 
                    }
                </div>
                <div style={{width:"15%", fontSize: "16px"}}>{Math.round(data.count*10)/10}</div>
                <div style={{width:"15%"}}>
                    <div style={{width:"100%", padding: "5px 0"}}>
                        {Math.round(data.sum*10)/10}
                    </div>
                    <div style={{width:"100%", padding: "5px 0"}}>
                        <Switch
                            checked={disabled ? data.agreement == 'AGREED' : checked}
                            disabled={disabled}
                            onClick={(value)=>{
                                this.props.onSwitchDetail(this.props.num-1, value);
                            }}
                        />
                    </div>
                </div>
            </div>
            ) : (
            <div className={`${Styles.detailElement} ${ disabled || !checked ? Styles.disabledRow : null }`} style={data.isCritical ? {backgroundColor: 'rgb(250,175,175)'} : null}>
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
                    <span>{Math.round(data.price*10)/10}</span>
                </div>
                <div className={Styles.rowCount}>
                    <span>{Math.round(data.count*10)/10} <FormattedMessage id='pc'/></span>
                </div>
                <div className={Styles.rowSum}>
                    <span>{Math.round(data.sum*10)/10}</span>
                </div>
                <div className={Styles.rowSwitch}>
                    <Switch
                        checked={disabled ? data.agreement == 'AGREED' : checked}
                        disabled={disabled}
                        onClick={(value)=>{
                            this.props.onSwitchDetail(this.props.num-1, value);
                        }}
                    />
                </div>
            </div>
        )
    }
}

class AgreementResult extends Component {
    componentDidMount() {
        /*setTimeout(()=>{
            window.close();
        }, 5000);*/
    }

    render() {
        return (
            <div
                style={{
                    display: "inline-block",
                    margin: "auto",
                    textAlign: "center",
                }}
            >
                {this.props.status == "success" ? (
                    <Icon
                        type="check-circle" 
                        theme="filled"
                        style={{
                            fontSize: "72px",
                            color: "#52c41a",
                            marginBottom: "24px",
                        }}
                    />
                ) : (
                    <Icon
                        type="warning" 
                        theme="filled"
                        style={{
                            fontSize: "72px",
                            color: "#faad14",
                            marginBottom: "24px",
                        }}
                    />
                )}
                <div
                    style={{
                        color: "rgba(0, 0, 0, 0.85)",
                        fontSize: "24px",
                        lineHeight: 1.8,
                    }}
                >
                    {this.props.title}
                </div>
                <div 
                    style={{
                        color: "rgba(0, 0, 0, 0.45)",
                        fontSize: "14px",
                        lineHeight: 1.6,
                    }}
                >
                    {this.props.subtitle}
                </div>
            </div>
        )
    }
}

export default AgreementPage;