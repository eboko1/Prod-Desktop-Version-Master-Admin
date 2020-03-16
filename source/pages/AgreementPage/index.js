// vendor
import React, { Component } from "react";
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Switch, Button, Icon} from 'antd';

// proj
import {Layout, Spinner, MobileView, ResponsiveView, StyledButton} from 'commons';

// own
import Styles from './styles.m.css';

class AgreementPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            servicesList: [],
            detailsList: [],
        }
        this.state.servicesList=[{
            id: 1,
            name: "service1",
            price: 1500,
            count: 1,
            checked: true,
        },{
            id: 2,
            name: "service2",
            price: 150,
            count: 2,
            checked: true,
        },{
            id: 123,
            name: "service3",
            price: 15,
            count: 10,
            checked: true,
        }];
        this.state.detailsList=[{
            id: 1,
            name: "detail1",
            price: 1500,
            count: 1,
            checked: true,
        },{
            id: 2,
            name: "detail2",
            price: 150,
            count: 2,
            checked: true,
        },{
            id: 123,
            name: "detail3",
            price: 15,
            count: 10,
            checked: true,
        }]
    }

    render() {
        const servicesElements = this.state.servicesList.map((data)=>{
            return (
                <div>
                    <p>{data.name}</p>
                    <p>{data.price}</p>
                    <p>{data.count}</p>
                    <Switch
                        checked={data.checked}
                    />
                </div>
            )
        })
        const detailsElements = this.state.detailsList.map((data)=>{
            return (
                <div>
                    <p>{data.name}</p>
                    <p>{data.price}</p>
                    <p>{data.count}</p>
                    <Switch
                        checked={data.checked}
                        onChange={(value)=>{
                            console.log(value);
                        }}
                    />
                </div>
            )
        })

        return (
            <div className={Styles.agreementPage}>
                <div>
                    <FormattedMessage id='service'/>
                    {servicesElements}
                </div>
                <div>
                    <FormattedMessage id="details"/>
                    {detailsElements}
                </div>
            </div>
        );
    }
}

export default AgreementPage;