// vendor
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import { injectIntl, FormattedMessage } from 'react-intl';
import _ from 'lodash';
import moment from 'moment';
import { Table, Button, Icon } from 'antd';

// proj
import { RequisiteSettingFormModal } from "forms";
// own

export default class RequisiteSettingContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fetched: false,
            dataSource: [
                {key: 0, name: "Чернявський Сергій Миколайович", form: "soleProprietor", code: "24467341", isPayer: false},
                {key: 1, name: "Колісник Марія Григорівна", form: "soleProprietor", code: "24467342", isPayer: false},
                {key: 2, name: "Авто Плюс", form: "ltd", code: "24467343", isPayer: false},
                {key: 3, name: "Авто Плюс ПДВ", form: "ltd", code: "24467344", isPayer: true},
            ],
        };

        this.columns = [
            {
                title:     '№',
                key:       'key',
                dataIndex: 'key',
                render: (key) => {
                    return (
                        key+1
                    )
                }
            },
            {
                title:     <FormattedMessage id='requisite-setting.form'/>,
                key:       'formType',
                dataIndex: 'formType',
                render:    (formType, elem) => {
                    return formType ? (
                        <FormattedMessage id={`requisite-setting.form.${formType}`}/>
                    ) : (
                        elem.formName
                    )
                },
            },
            {
                title:     <FormattedMessage id='requisite-setting.name'/>,
                key:       'name',
                dataIndex: 'name',
            },
            {
                title:     <p><FormattedMessage id='requisite-setting.code'/> <FormattedMessage id='USREOU'/></p>,
                key:       'ifi',
                dataIndex: 'ifi',
            },
            {
                title:     <p><FormattedMessage id='requisite-setting.payer'/> <FormattedMessage id='VAT'/></p>,
                key:       'isTaxPayer',
                dataIndex: 'isTaxPayer',
                render:    (isTaxPayer) => {
                    return (
                        <Icon type={isTaxPayer ? 'check' : 'close'}/>
                    )
                },
            },
            {
                key:    'actions',
                render: (elem) => {
                    return (
                        <div style={{textAlign: 'end'}}>
                            <Button
                                onClick={()=>this.props.showModal(elem)}
                            >
                                <Icon type='edit'/>
                            </Button>
                            <Button
                                disabled={elem.used}
                                onClick={()=>{
                                    this.props.deleteRequisite(elem.id, this.props.updateDataSource);
                                }}
                            >
                                <Icon style={{color: 'var(--danger)'}} type='delete'/>
                            </Button>
                        </div>
                        
                    )
                },
            },
        ];
    }

    componentDidMount() {
        this.setState({
            fetched: true,
        })
    }

    render() {
        const { modalVisible, showModal, hideModal, requisiteData, dataSource, postRequisite, updateRequisite, clientId, loading } = this.props;
        const { fetched } = this.state;
        return (
            <div>
                <Table
                    loading={ loading }
                    columns={ this.columns }
                    dataSource={ dataSource }
                    onRow={ (record, rowIndex) => {
                        return {
                            onDoubleClick: event => {
                                showModal(record);
                            }
                        };
                    }}
                />
                <RequisiteSettingFormModal
                    modalVisible={ modalVisible }
                    hideModal={ hideModal }
                    requisiteData={ requisiteData }
                    postRequisite={postRequisite}
                    updateRequisite={updateRequisite}
                    clientId={clientId}
                />
            </div>
        );
    }
}
