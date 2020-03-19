// vendor
import React, { Component } from "react";
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Switch, Button, Icon} from 'antd';

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
        this.updateData = this.updateData.bind(this);
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
        console.log(this.state.detailsList);
        this.setState({
            dataSource: data,
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
        const { dataSource, servicesList, detailsList } = this.state;
        if(dataSource == undefined) {
            return (
                <Spinner spin={true}/>
            )
        }
        const vehicleNumber = dataSource.vehicleNumber;
        const servicesElements = servicesList.map((data, index)=>{
            return (
                <div key={index}>
                    <p>{data.serviceName}</p>
                    <p>{data.price}</p>
                    <p>{data.count}</p>
                    <p>{data.sum}</p>
                    <Switch
                        checked={true}
                    />
                </div>
            )
        })
        const detailsElements = detailsList.map((data, index)=>{
            return (
                <div key={index}>
                    <p>{data.detailName}</p>
                    <p>{data.price}</p>
                    <p>{data.count}</p>
                    <p>{data.sum}</p>
                    <Switch
                        checked={true}
                        onChange={(value)=>{
                            console.log(value);
                        }}
                    />
                </div>
            )
        })

        return (
            <div className={Styles.agreementPage}>
                <div>{vehicleNumber}</div>
                <div>
                    <FormattedMessage id='add_order_form.services'/>
                    {servicesElements}
                </div>
                <div>
                    <FormattedMessage id="add_order_form.details"/>
                    {detailsElements}
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
                    <FormattedMessage id='submit'/>
                </Button>
            </div>
        );
    }
}

export default AgreementPage;