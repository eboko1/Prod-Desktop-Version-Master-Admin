// vendor
import React, { Component } from "react";
import { FormattedMessage, injectIntl } from 'react-intl';
import { withRouter } from 'react-router-dom';
import {
    Table,
    Button,
    Icon,
    Select,
    Input,
    InputNumber,
    Modal
} from 'antd';

// proj
import { Layout, Spinner } from 'commons';

// own
import Styles from './styles.m.css';

@injectIntl
@withRouter

class AvailabilitiesPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: [],
        };
        this.columns = [
            {
                title:     '#',
                dataIndex: 'key',
                key:       'key',
                width:     '5%',
                render: (data, elem)=>{
                    const key = elem.key;
                    return (
                        <Input
                            style={{minWidth: "100px"}}
                            placeholder={this.props.intl.formatMessage({id: 'diagnostic-page.plan'})}
                            value={data}
                            onChange={(event)=>{
                                elem.key = event.target.value;
                                this.setState({
                                    update: true,
                                });
                            }}
                        />
                    )
                }
            },
        ]
    }

    handleCancel() {
        this.setState({
            visible: false,
        })
    }

    handleOk() {
        this.setState({
            visible: false,
        })
    }

    componentWillMount() {
        var that = this;
        let token = localStorage.getItem('_my.carbook.pro_token');
        let url = __API_URL__;
        let params = `/availabilities/settings`;
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
            console.log(data);
            data.diagnosticParts.map((elem, index)=>elem.key=index);
            that.setState({
                dataSource: data,
            });
        })
        .catch(function (error) {
            console.log('error', error)
        })
    }

    render() {
       const {dataSource} = this.state;

        return (
            <Layout
                title={ <FormattedMessage id='navigation.availabilities' /> }
                controls={
                    <>
                        <Button
                            type='primary'
                        >
                            <FormattedMessage id='save' />
                        </Button>
                    </>
                }
            >
                <Table
                    dataSource={dataSource}
                    columns={this.columns}
                    locale={{
                        emptyText: <FormattedMessage id='no_data' />,
                    }}
                    scroll={{ y: 680 }}
                />
            </Layout>
        );
    }
}

export default AvailabilitiesPage;