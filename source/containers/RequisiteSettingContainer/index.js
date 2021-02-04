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

const mapStateToProps = state => ({
    user: state.auth,
    isMobile: state.ui.views.isMobile,
});
@injectIntl
@connect(mapStateToProps)
export default class RequisiteSettingContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fetched: false,
            dataSource: [],
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
                                disabled={this.props.disabled}
                                onClick={()=>this.props.showModal(elem)}
                            >
                                <Icon type='edit'/>
                            </Button>
                            <Button
                                disabled={elem.used || this.props.disabled}
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
        const { modalVisible, showModal, hideModal, requisiteData, dataSource, postRequisite, updateRequisite, id, loading, isMobile, disabled } = this.props;
        const { fetched } = this.state;
        return (
            <div>
                <Table
                    loading={ loading }
                    columns={ isMobile ? this.columns.slice(1, -1) : this.columns }
                    dataSource={ dataSource }
                    onRow={ (record, rowIndex) => {
                        return {
                            onDoubleClick: event => {
                                if(!disabled) showModal(record);
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
                    id={id}
                />
            </div>
        );
    }
}
