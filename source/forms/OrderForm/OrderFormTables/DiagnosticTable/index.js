// vendor
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Table, Button, Modal, Upload, Icon, Checkbox, Select, Input, InputNumber, AutoComplete } from 'antd';
import { FormattedMessage } from 'react-intl';

// proj
import { Catcher } from 'commons';
import {
    API_URL,
    addNewDiagnosticTemplate,
    getDiagnosticsTemplates,
    addNewDiagnosticRow,
    sendDiagnosticAnswer,
    deleteDiagnosticProcess,
    deleteDiagnosticTemplate
} from 'core/forms/orderDiagnosticForm/saga';

// own
import Styles from './styles.m.css';

class DiagnosticTable extends Component {
    _isMounted = false;

    constructor(props) {
        super(props);
        this.state = {
            update: false,
            orderDiagnostic: props.orderDiagnostic,
            orderId: props.orderId,
            selectedRows: [],
            rowsCount: 0,
            headerCheckboxIndeterminate: false,
            checkedAll: false,
            possibleRows : [],
            dataSource: [],
            groupsTitles: [],
            partsTitles: [],
        };
        this.templatesData = this.templatesData == undefined ? {} : this.templatesData;
        this.templatesTitles = [];
        this.groupsTitles = [];
        this.partsTitles = [];
        this.getCurrentDiagnostic = this.getCurrentDiagnostic.bind(this);
        this.addNewDiagnostic = this.addNewDiagnostic.bind(this);
        this.deleteDiagnostic = this.deleteDiagnostic.bind(this);
        this.onPlanChange = this.onPlanChange.bind(this);
        this.onStageChange = this.onStageChange.bind(this);
        this.onDetailChange = this.onDetailChange.bind(this);
        this.getTemplatesList = this.getTemplatesList.bind(this);
        this.updateDataSource = this.updateDataSource.bind(this);
        this.deleteRow = this.deleteRow.bind(this);
        this.onCheckAll = this.onCheckAll.bind(this);
        this.editSelectedRowsStatus = this.editSelectedRowsStatus.bind(this);
        this.deleteSelectedRows = this.deleteSelectedRows.bind(this);
        this.columns = [
            {
                title:     '#',
                dataIndex: 'key',
                key:       'key',
                width:     '5%',
                render: (num)=> {
                    let checked = this.state.selectedRows.indexOf(num) > -1;
                    return(
                        <div>
                            <span>{num} </span>
                            <Checkbox
                                onChange={()=>{this.onChangeCheckbox(num)}}
                                checked = { checked }
                            />
                        </div>
                    )
                },
            },
            {
                title:     <FormattedMessage id='order_form_table.diagnostic.plan' />,
                dataIndex: 'plan',
                key:       'plan',
                width:     '15%',
                render: (plan)=> {
                    const { Option } = Select;
                    return plan != "" ? (
                        <p>
                            {plan}
                        </p>
                    ) : (
                        <Select
                            showSearch
                            placeholder={<FormattedMessage id='order_form_table.diagnostic.plan' />}
                            onChange={this.onPlanChange}
                        >
                            {this.templatesTitles.map((template) => <Option value={template}>{template}</Option>)}
                        </Select>
                    );
                },
            },
            {
                title:     <FormattedMessage id='order_form_table.diagnostic.stage' />,
                dataIndex: 'stage',
                key:       'stage',
                width:     '15%',
                render: (stage)=> {
                    const { Option } = Select;
                    let options = undefined !== this.state.groupsTitles ? this.state.groupsTitles : [];
                    return stage != "" ? (
                        <p>
                            {stage}
                        </p>
                    ) : (
                        <Select
                            showSearch
                            placeholder={<FormattedMessage id='order_form_table.diagnostic.stage' />}
                            disabled={options.length == 0}
                            onChange={this.onStageChange}
                        >
                            {options.map((template) => <Option value={template}>{template}</Option>)}
                        </Select>  
                    );
                },
            },
            {
                title:     <FormattedMessage id='order_form_table.diagnostic.detail' />,
                dataIndex: 'detail',
                key:       'detail',
                width:     '35%',
                render: (detail, rowProp)=> {
                    const { Option } = Select;
                    let options = undefined !== this.state.partsTitles ? this.state.partsTitles : [];
                    return detail != "" ? (
                        <span>
                            <p>{detail}</p>
                            <p style={{fontStyle: "italic"}}>{rowProp.actionTitle}</p>
                        </span>
                    ) : (
                        <Select
                            showSearch
                            placeholder={<FormattedMessage id='order_form_table.diagnostic.detail' />}
                            disabled={options.length == 0}
                            onChange={this.onDetailChange}
                        >
                            {options.map((template) => <Option value={template}>{template}</Option>)}
                        </Select> 
                    );
                },
            },
            {
                title:     <FormattedMessage id='order_form_table.diagnostic.commentary' />,
                dataIndex: 'commentary',
                key:       'commentary',
                width:     '5%',
                render: (commentary, rowProp) => (
                    <CommentaryButton
                        commentary={commentary}
                        rowProp={rowProp}
                    />
                ),
            },
            {
                title:     <FormattedMessage id='order_form_table.diagnostic.photo' />,
                dataIndex: 'photo',
                key:       'photo',
                width:     '5%',
                render: (photo, rowProp) => (
                    <PhotoButton
                        photo={photo}
                        rowProp={rowProp}
                    />
                ),
            },
            {
                title:     <FormattedMessage id='order_form_table.diagnostic.status' />,
                dataIndex: 'status',
                key:       'status',
                width:     '15%',
                render: (text, rowProp) => {
                    return (
                        <DiagnosticStatusButton
                            getCurrentDiagnostic={this.getCurrentDiagnostic}
                            status={text}
                            rowProp={rowProp}
                        />
                    )
                },
            },
            {
                dataIndex: 'delete',
                key:       'delete',
                width:     '5%',
                render: (text, rowProp) => (
                    <DeleteProcessButton
                        deleteRow = {this.deleteRow}
                        rowProp={rowProp}
                    />
                ),
            },
        ];
    }

    addNewDiagnostic(data) {
        addNewDiagnosticTemplate(this.state.orderId, this.templatesTitles.indexOf(data)+1);
        setTimeout(this.getCurrentDiagnostic,500);
        //this.getCurrentDiagnostic();
    }

    deleteDiagnostic(data) {
        deleteDiagnosticTemplate(this.state.orderId, this.templatesTitles.indexOf(data)+1);
        setTimeout(this.getCurrentDiagnostic,500);
        //this.getCurrentDiagnostic();
    }

    onPlanChange(event) {
        let tmp = [];
        for (let i = 0; i < this.groupsTitles.length; i++) {
            if(this.groupsTitles[i].parent == event) {
                tmp.push(this.groupsTitles[i].title);
            }
        }
        this.setState({
            groupsTitles: tmp,
        });
    }

    onStageChange(event) {
        let tmp = [];
        for (let i = 0; i < this.partsTitles.length; i++) {
            if(this.partsTitles[i].parent == event) {
                tmp.push(this.partsTitles[i].title);
            }
        }
        this.setState({
            partsTitles: tmp,
        });
    }

    onDetailChange(event) {
        let partId, groupId, partParent, diagnosticParent,templateId;
        for (let i = 0; i < this.partsTitles.length; i++) {
            if(this.partsTitles[i].title == event) {
                partId = this.partsTitles[i].id;
                partParent = this.partsTitles[i].parent;
            }
        }
        for (let i = 0; i < this.groupsTitles.length; i++) {
            if(this.groupsTitles[i].title == partParent) {
                groupId = this.groupsTitles[i].id;
                diagnosticParent = this.groupsTitles[i].parent;
            }
        }
        templateId = this.templatesTitles.indexOf(diagnosticParent) + 1;
        addNewDiagnosticRow(this.state.orderId, templateId, groupId, partId);
        setTimeout(this.getCurrentDiagnostic,500);
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
            console.log(data);
            that.setState({
                orderDiagnostic: data.diagnosis,
            });
            that.updateDataSource();
        })
        .catch(function (error) {
            console.log('error', error)
        });
    }

    getTemplatesList() {
        for(let i = 0 ; i < this.templatesData.diagnosticTemplatesCount; i++) {
            this.templatesTitles.push(this.templatesData.diagnosticTemplates[i].diagnosticTemplateTitle);
            let groupsCount = this.templatesData.diagnosticTemplates[i].groupsCount;
            for (let j = 0; j < groupsCount; j++) {
                let diagnostic =  this.templatesData.diagnosticTemplates[i].groups[j];
                let id = diagnostic.groupId;
                let title = diagnostic.groupTitle;

                this.groupsTitles.push({
                    id: id,
                    title: title,
                    parentId: this.templatesData.diagnosticTemplates[i].diagnosticTemplateId,
                    parent: this.templatesData.diagnosticTemplates[i].diagnosticTemplateTitle,
                });

                for (let k = 0; k < diagnostic.partsCount; k++) {
                    let part =  diagnostic.parts[k];
                    let id = part.partId;
                    let title = part.partTitle;
                    this.partsTitles.push({
                        id: id,
                        title: title,
                        parentId: diagnostic.groupId,
                        parent: diagnostic.groupTitle,
                    });
                }
            }
        }
        /*this.setState({
            groupsTitles: this.groupsTitles,
            partsTitles: this.partsTitles,
        });*/
    }

    async deleteRow(index) {
        await deleteDiagnosticProcess(
            this.props.orderId,
            this.state.dataSource[index].diagnosticTemplateId,
            this.state.dataSource[index].groupId,
            this.state.dataSource[index].partId,
        );
        this.setState({
            selectedRows: [],
            possibleRows: [],
            checkedAll: false,
            headerCheckboxIndeterminate: false,
        });
        await this.getCurrentDiagnostic();
    }

    onCheckAll() {
        if(!this.state.checkedAll) {
            this.setState({
                checkedAll: true,
                selectedRows: this.state.possibleRows,
                headerCheckboxIndeterminate: false,
            });
        }
        else {
            this.setState({
                checkedAll: false,
                selectedRows: [],
                headerCheckboxIndeterminate: false,
            });
        }
        this.getCurrentDiagnostic();
    }

    async editSelectedRowsStatus(status) {
        for(let i = 0; i < this.state.selectedRows.length; i++){
            let key = this.state.selectedRows[i] - 1;
            await sendDiagnosticAnswer(
                this.props.orderId,
                this.state.dataSource[key].diagnosticTemplateId,
                this.state.dataSource[key].groupId,
                this.state.dataSource[key].partId,
                status
            );
        }
        this.setState({
            selectedRows: [],
            possibleRows: [],
            checkedAll: false,
            headerCheckboxIndeterminate: false,
        });
        await this.getCurrentDiagnostic();
    }

    async deleteSelectedRows() {
        for(let i = 0; i < this.state.selectedRows.length; i++){
            let key = this.state.selectedRows[i] - 1;
            await deleteDiagnosticProcess(
                this.props.orderId,
                this.state.dataSource[key].diagnosticTemplateId,
                this.state.dataSource[key].groupId,
                this.state.dataSource[key].partId,
            );
        }
        this.setState({
            selectedRows: [],
            possibleRows: [],
            checkedAll: false,
            headerCheckboxIndeterminate: false,
        });
        await this.getCurrentDiagnostic();
    }

    onChangeCheckbox(key) {
        const data = this.state.selectedRows;
        if(event.target.checked) {
            this.state.selectedRows.push(key);
        }
        else {
            let index = data.indexOf(key);
            this.state.selectedRows = data.filter((_, i) => i !== index);
        }
        let allchecked = (this.state.selectedRows.length == this.state.rowsCount),
            indeterminate = (this.state.selectedRows.length < this.state.rowsCount) && this.state.selectedRows.length > 0;
        this.setState({
            headerCheckboxIndeterminate: indeterminate,
            checkedAll: allchecked,
        });
        this.getCurrentDiagnostic();
    }

    setRowsColor() {
        let color, status;
        var rows = document.querySelectorAll(`.${Styles.diagnosticTable} tbody tr`);
        for(let i = 0; i < rows.length && i < this.state.dataSource.length; i++){
            status = this.state.dataSource[i].status;
            color = "";
            if(status == 1) {
                color = "rgb(200,225,180)";
            }
            else if(status == 2) {
                color = "rgb(255,240,180)";
            }
            else if(status == 3) {
                color = "rgb(250,175,175)";
            }
            rows[i].style.backgroundColor = color;
        };
    }

    updateDataSource() {
        this.state.possibleRows = [];
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
                    this.state.possibleRows.push(key);
                    key++;
                }
            }
        }
        dataSource.push({
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
        },);
        this.state.possibleRows.push(key);
        //this.state.dataSource = dataSource;
        //this.state.rowsCount = key;
        this.setState({
            dataSource: dataSource,
            rowsCount: key,
        });
        this.forceUpdate();
    }

    componentWillMount() {
        {this.updateDataSource()}
        var that = this;
        let token = localStorage.getItem('_my.carbook.pro_token');
        let url = API_URL;
        let params = `/diagnostics`;
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
            that.templatesData = data;
            that.getTemplatesList();
            that.forceUpdate();
        })
        .catch(function (error) {
            console.log('error', error)
        })
    }

    componentDidMount() {
        this._isMounted = true;
        {this.setRowsColor()}
    }

    componentDidUpdate() {
        {this.setRowsColor()}
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    render() {
        this.setRowsColor();
        const columns = this.columns;
        return (
            <div>
                <DiagnosticTableHeader
                    templatesTitles = {this.templatesTitles}
                    rowsCount = {this.state.rowsCount}
                    selectedRows = {this.state.selectedRows}
                    indeterminate = {this.state.headerCheckboxIndeterminate}
                    checkedAll = {this.state.checkedAll}
                    onCheckAll = {this.onCheckAll}
                    addNewDiagnostic = {this.addNewDiagnostic}
                    deleteDiagnostic = {this.deleteDiagnostic}
                    editSelectedRowsStatus = {this.editSelectedRowsStatus}
                    deleteSelectedRows = {this.deleteSelectedRows}
                    dataSource = {this.state.dataSource}
                />
                <Table
                    className={ Styles.diagnosticTable }
                    dataSource={ this.state.dataSource }
                    columns={ columns }
                    locale={ {
                        emptyText: <FormattedMessage id='no_data' />,
                    } }
                    pagination={false}
                    scroll={{ y: 540 }}
                />
            </div>
        );
    }
}

class DiagnosticTableHeader extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            indeterminate: props.indeterminate,
            checked: props.checkedAll,
            selectValue : "",
            dataSource: props.dataSource,
        }
    }

    handleClickCheckbox() {
        this.setState({
            checked: !this.state.checked,
        });
    }

    handleClickStatusButtons(status) {
        {this.props.editSelectedRowsStatus(status)};
    }

    handleClickDeleteButton() {
        {this.props.deleteSelectedRows()};
    }

    updateState() {
        this.state.checked = this.props.checkedAll;
        this.state.indeterminate = this.props.indeterminate;
        this.state.dataSource = this.props.dataSource;
    }

    componentWillUpdate() {
        this.updateState();
    }

    render(){
        const { Option } = Select;
        return(
            <div className={Styles.diagnosticTableHeader}>
                <div style={{ width: "5%", padding: '5px 10px' }}>
                    <Checkbox
                        checked = {this.state.checked}
                        indeterminate = {this.state.indeterminate}
                        onChange = {this.props.onCheckAll}
                        onClick = {()=>this.handleClickCheckbox()}
                    />
                </div>
                <div style={{ width: "15%" }}>
                    <Select
                        showSearch
                        placeholder={<FormattedMessage id='order_form_table.diagnostic.plan' />}
                        onChange={()=>{this.setState({selectValue: event.target.innerText})}}
                    >
                        {this.props.templatesTitles.map((template) => <Option value={template}>{template}</Option>)}
                    </Select>
                </div>
                <div style={{ width: "15%" }}>
                    <Button onClick={() => this.props.addNewDiagnostic(this.state.selectValue)}>+</Button>
                    <Button onClick={() => this.props.deleteDiagnostic(this.state.selectValue)}>-</Button>
                </div>
                <div style={{ width: "35%" }}>
                    <ConfirmDiagnosticModal
                        dataSource = {this.state.dataSource}
                    />
                </div>
                <div style={{ width: "10%" }}>
                    <Button type="primary" onClick={()=>{this.handleClickStatusButtons(0)}}>
                        <FormattedMessage id='order_form_table.diagnostic.status.edit' />
                    </Button>
                </div>
                <div className={Styles.diagnostic_status_button_wrap} style={{ width: "15%" }}>
                    <Button className={Styles.diagnostic_status_button} onClick={()=>{this.handleClickStatusButtons(1)}}  style={{background:'rgb(81, 205, 102)'}}>
                        <FormattedMessage id='order_form_table.diagnostic.status.ok' />
                    </Button>
                    <Button className={Styles.diagnostic_status_button} onClick={()=>{this.handleClickStatusButtons(2)}} style={{background:'rgb(255, 255, 0)'}}>
                        <FormattedMessage id='order_form_table.diagnostic.status.bad' />
                    </Button>
                    <Button className={Styles.diagnostic_status_button}  type="danger" onClick={()=>{this.handleClickStatusButtons(3)}} style={{background:'rgb(255, 126, 126)', color: 'black'}}>
                        <FormattedMessage id='order_form_table.diagnostic.status.critical' />
                    </Button>
                </div>
                <div style={{ width: "5%", padding: '5px 10px'}}>
                    <Icon type="delete" className={Styles.delete_diagnostic_button} onClick={()=>{this.handleClickDeleteButton()}}/>
                </div>
            </div>
        );
    }
}

class DiagnosticStatusButton extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            status: props.status
        }
    }
    setColor() {
        let color = ""
        if(this.state.status == 1) {
            color = "rgb(200,225,180)";
        }
        else if(this.state.status == 2) {
            color = "rgb(255,240,180)";
        }
        else if(this.state.status == 3) {
            color = "rgb(250,175,175)";
        }

        ReactDOM.findDOMNode(this).parentNode.parentNode.style.backgroundColor = color;
    }

    componentDidMount() {
        {this.setColor()}
    }

    componentDidUpdate() {
        {this.setColor()}
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
            <div className={Styles.diagnostic_status_button_wrap}>
                <Button className={Styles.diagnostic_status_button_edit} type="primary" onClick={()=>this.handleClick(0)}>
                    <FormattedMessage id='order_form_table.diagnostic.status.edit' />
                </Button>
            </div>
            ) : (
            <div className={Styles.diagnostic_status_button_wrap}>
                <Button className={Styles.diagnostic_status_button} onClick={()=>this.handleClick(1)} style={{background:'rgb(81, 205, 102)'}}>
                    <FormattedMessage id='order_form_table.diagnostic.status.ok' />
                </Button>
                <Button className={Styles.diagnostic_status_button} onClick={()=>this.handleClick(2)} style={{background:'rgb(255, 255, 0)'}}>
                    <FormattedMessage id='order_form_table.diagnostic.status.bad' />
                </Button>
                <Button className={Styles.diagnostic_status_button} type="danger" onClick={()=>this.handleClick(3)} style={{background:'rgb(255, 126, 126)', color: 'black'}}>
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
        this.commentaryInput = React.createRef();
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
        this.setState({
            visible: false,
        });
    };

    componentDidUpdate() {
        if(this.commentaryInput.current != undefined) {
            this.commentaryInput.current.focus();
        }
    }

    render() {
        const { TextArea } = Input;
        const { visible, loading } = this.state;
        const commentary = this.state.commentary;
        return (
            <div>
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
                    <TextArea
                        autoFocus
                        onChange={()=>{this.state.commentary = event.target.value}}
                        style={{width: '100%', minHeight: '150px', resize:'none'}}
                        defaultValue={commentary}
                        ref={this.commentaryInput}
                    />
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
        console.log(this.state.photo);
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
        this.setState({
            visible: false,
        });
    };

    render() {
        this.actionUrl += `&photo=${this.state.photo}`;
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
        const photo = this.state.photo;
        return (
            <div>
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
                    <Upload 
                        listType='picture'
                        defaultFileList={[...fileList]}
                        beforeUpload={file => {
                            const reader = new FileReader();
                            reader.onload = e => {
                                console.log(e.target.result);
                                this.state.photo = e.target.result;
                            };
                            reader.readAsDataURL(file);
                            return false;
                        }}
                    >
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


class DeleteProcessButton extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            deleted: false,
        }
    }

    handleClick = () => {
        const { rowProp } = this.props;
        deleteDiagnosticProcess(rowProp.orderId, rowProp.diagnosticTemplateId, rowProp.groupId, rowProp.partId);
        //ReactDOM.findDOMNode(this).parentNode.parentNode.style.display = 'none';
        ReactDOM.findDOMNode(this).parentNode.parentNode.style.backgroundColor = "";
        this.props.deleteRow(this.props.rowProp.key-1);
        this.setState({deleted:true});
    }

    render() {
        return <Icon type="delete" onClick={this.handleClick} className={Styles.delete_diagnostic_button}/>

    }
}

class ConfirmDiagnosticModal extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            dataSource: props.dataSource,
            diagnosticList: [],
            servicesList: [],
            detailsList: [],
        }
        this.state.servicesList=[
            {key:1, id:"1", name:"Замена амортизатора пер. прав.", count:1, checked: true},
            {key:2, id:"2", name:"Замена амортизатора пер. лев.", count:1, checked: true},
            {key:3, id:"3", name:"Ремонт стойки", count:2, checked: true},
            {key:4, id:"4", name:"Замена лобового стекла", count:1, checked: true},
            {key:5, id:"5", name:"Ремонт ходовой части", count:1, checked: true},
        ];
        this.state.detailsList=[
            {key:1, id:"1", name:"Замена амортизатора пер. прав.", count:1, checked: true},
            {key:2, id:"2", name:"Замена амортизатора пер. лев.", count:1, checked: true},
            {key:3, id:"3", name:"Ремонт стойки", count:2, checked: true},
            {key:4, id:"4", name:"Замена лобового стекла", count:1, checked: true},
            {key:5, id:"5", name:"Ремонт ходовой части", count:1, checked: true},
        ];

        this.servicesOptions = this.getServicesOptions();
        this.detailsOptions = this.getDetailsOptions();
        this.lastServiceInput = React.createRef();
        this.lastDetailInput = React.createRef();
        this.diagnosticKey = 1;
    }

    showModal = () => {
        this.setState({
            visible: true,
        });
    };

    handleOk = () => {
        this.setState({ visible: false });
        console.log(this.state.diagnosticList);
    };
    
    handleCancel = () => {
        this.setState({
            visible: false,
            dataSource: this.props.dataSource,
            diagnosticList: [],
        });
    };

    updateState() {
        this.state.dataSource = this.props.dataSource;
        this.state.diagnosticList = [];
        this.diagnosticKey = 1;
    }

    componentDidUpdate() {
        this.servicesOptions = this.getServicesOptions();
        this.detailsOptions = this.getDetailsOptions();
    }

    componentWillUpdate() {
        this.updateState();
    }

    changeResolved(index, type) {
        this.state.diagnosticList[index].resolved = type=='disabled'?true:!this.state.diagnosticList[index].resolved;
        this.state.diagnosticList[index].type = type;
        this.setState({
            update: true,
        })
        if(type=='manually') {
            this.lastDetailInput.focus();
        }
    }

    disableDiagnosticRow(index){
        this.state.diagnosticList[index].checked = !this.state.diagnosticList[index].checked;
        this.state.diagnosticList[index].disabled = !this.state.diagnosticList[index].disabled;
        if(!event.target.checked) {
            {this.changeResolved(index, 'disabled')};
        }
        else {
            {this.changeResolved(index, '')};
        }
    }

    getDiagnostics(stage) {
        const { dataSource } = this.props;
        var diagnosticList = this.state.diagnosticList;
        let tmpSource = [];
        for(let i = 0; i < dataSource.length; i++) {
            if(dataSource[i].stage == stage && Number(dataSource[i].status) > 1) {
                tmpSource.push(dataSource[i]);
                if(this.state.diagnosticList.findIndex(x => x.id == dataSource[i].partId) == -1){
                    diagnosticList.push({key: this.diagnosticKey, id: dataSource[i].partId, resolved: false, type:'', disabled: false, checked: true});
                    this.diagnosticKey++;
                }
            }
        }
        this.state.diagnosticList = diagnosticList;

        return tmpSource.map((data)=>{
        let index = this.state.diagnosticList.findIndex(x => x.id == data.partId),
            key=this.state.diagnosticList[index].key,
            bgColor = this.state.diagnosticList[index].disabled?"#d9d9d9":"",
            txtColor = this.state.diagnosticList[index].disabled?"gray":"";

        if(!this.state.diagnosticList[index].resolved) {
            if(data.status == 1) {
                bgColor = "rgb(200,225,180)";
            }
            else if(data.status == 2) {
                bgColor = "rgb(255,240,180)";
            }
            else if(data.status == 3) {
                bgColor = "rgb(250,175,175)";
            }
        } else if(!this.state.diagnosticList[index].disabled){
            bgColor = "rgb(200,225,180)";
        }

        return (
        <div className={Styles.confirm_diagnostic_modal_row} style={{backgroundColor: bgColor, color: txtColor}}>
            <div style={{ width: '10%' }}>
                {key} <Checkbox
                        onChange={()=>this.disableDiagnosticRow(index)}
                        checked={this.state.diagnosticList[index].checked}
                    />
            </div>
            <div style={{ width: '50%', padding: '0 5px' }}>
                {data.detail}
            </div>
            {!this.state.diagnosticList[index].resolved ?
            <div className={Styles.confirm_diagnostic_modal_row_button} style={{ width: '40%'}}>
                <Button
                    type="primary"
                    onClick={()=>{this.changeResolved(index, 'automaticly')}}
                    style={{width: '49%', padding: '5px'}}
                >
                    <FormattedMessage id='order_form_table.diagnostic.automaticly' />
                </Button>
                <Button
                    type="primary"
                    onClick={()=>{this.changeResolved(index, 'manually')}}
                    style={{width: '49%', padding: '5px'}}
                >
                    <FormattedMessage id='order_form_table.diagnostic.manually' />
                </Button>
            </div>
            :
            <div className={Styles.confirm_diagnostic_modal_row_button} style={{ width: '40%'}}>
                <Button
                    disabled={this.state.diagnosticList[index].disabled}
                    onClick={()=>{this.changeResolved(index, '')}}
                    style={{width: '98%'}}
                >
                    <FormattedMessage id={`order_form_table.diagnostic.${this.state.diagnosticList[index].type}`} />
                </Button>
            </div>}
        </div>
        )})
    }

    getDiagnosticContent() {
        const { dataSource } = this.props;
        let stageList = [];
        for(let i = 0; i < dataSource.length; i++) {
            if(dataSource[i].stage != "" && stageList.indexOf(dataSource[i].stage) == -1 && Number(dataSource[i].status) > 1) {
                stageList.push(dataSource[i].stage);
            }
        }

        return stageList.map((stage)=>
            <div>
                <div className={Styles.confirm_diagnostic_modal_row_title}>{stage}</div>
                {this.getDiagnostics(stage)}
            </div>
        );
    }

    servicesCheckboxClick(index) {
        this.state.servicesList[index].checked = !this.state.servicesList[index].checked;
        this.setState({
            update: true,
        })
    }

    addNewServicesRow() {
        if(this.state.servicesList[this.state.servicesList.length-1].name != null) {
            this.state.servicesList.push(
                {key:this.state.servicesList[this.state.servicesList.length-1].key+1, id:null, name: null, count: 1, checked: true},
            );
            this.setState({
                update: true,
            })
        }
    }

    getServicesOptions() {
        const { Option } = AutoComplete;
        
        const services  = [
            {id:"1", name:"Замена амортизатора пер. прав."},
            {id:"2", name:"Замена амортизатора пер. лев."},
            {id:"3", name:"Ремонт стойки"},
        ];

        return services.map(
            (data, index) => (
                <Option value={ data.name } key={index}>
                    { data.name }
                </Option>
            ),
        );
    }

    deleteServiceRow(index) {
        var array = [...this.state.servicesList];
        if(array.length == 1) return 0;
        array.splice(index, 1);
        for(let i = 0; i < array.length; i++) {
            array[i].key = i+1;
        }
        this.setState({servicesList: array});
    }

    getServicesContent() {
        this.addNewServicesRow();
        var servicesList = [...this.state.servicesList];

        return this.state.servicesList.map((data)=>
            <div className={Styles.confirm_diagnostic_modal_row}>
                <div style={{ width: '10%' }}>
                    {data.key} <Checkbox
                        checked={data.checked}
                        onClick={()=>this.servicesCheckboxClick(data.key-1)}
                    />
                </div>
                <div style={{ width: '60%', padding: '0 5px'}}>
                    <AutoComplete
                        defaultActiveFirstOption={false}
                        className="service_input"
                        ref={(node)=>{this.lastServiceInput=node}}
                        disabled={!data.checked}
                        style={{ width: "100%"}}
                        onChange={(inputValue)=>{
                            this.state.servicesList[data.key-1].name = inputValue;
                            console.log(inputValue, data);
                            this.addNewServicesRow();
                        }}
                        placeholder={<FormattedMessage id='order_form_table.service.placeholder'/>}
                        defaultValue={data.name?data.name:undefined}
                        getPopupContainer={()=>document.getElementById(`${Styles.diagnosticModalServices}`)}
                        filterOption={(inputValue, option) =>
                            option.props.children.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0
                        }
                    >
                        {this.servicesOptions}
                    </AutoComplete>
                </div>
                <div style={{ width: '30%' }}>
                    <InputNumber
                        disabled={!data.checked}
                        style={{ width: '70%' }}
                        min={1}
                        max={50}
                        defaultValue={data.count?data.count:1}
                    />
                    <Icon
                        onClick={()=>this.deleteServiceRow(data.key-1)}
                        style={{margin: '0 5%'}}
                        type="delete"
                        className={Styles.delete_diagnostic_button}
                    />
                </div>
            </div>
        )
    }

    detailsCheckboxClick(index) {
        this.state.detailsList[index].checked = !this.state.detailsList[index].checked;
        this.setState({
            update: true,
        })
    }

    addNewDetailsRow() {
        if(this.state.detailsList[this.state.detailsList.length-1].name != null) {
            this.state.detailsList.push(
                {key:this.state.detailsList[this.state.detailsList.length-1].key+1, id:null, name: null, count: 1, checked: true},
            );
            this.setState({
                update: true,
            })
        }
    }

    getDetailsOptions() {
        const { Option } = AutoComplete;

        const details  = [
            {id:"1", name:"Амортизатор пер. прав."},
            {id:"2", name:"Амортизатор пер. лев."},
            {id:"3", name:"Гайка монтажная"},
        ];

        return details.map(
            (data, index) => (
                <Option value={ data.name } key={index}>
                    { data.name }
                </Option>
            ),
        );
    }

    deleteDetailRow(index) {
        var array = [...this.state.detailsList];
        if(array.length == 1) return 0;
        array.splice(index, 1);
        for(let i = 0; i < array.length; i++) {
            array[i].key = i+1;
        }
        this.setState({detailsList: array});
    }

    getDetailsContent() {
        this.addNewDetailsRow();

        return this.state.detailsList.map((data)=>
            <div className={Styles.confirm_diagnostic_modal_row}>
                <div style={{ width: '10%' }}>
                    {data.key} <Checkbox
                        checked={this.state.detailsList[data.key-1].checked}
                        onClick={()=>this.detailsCheckboxClick(data.key-1)}
                    />
                </div>
                <div style={{ width: '60%', padding: '0 5px'}}>
                    <AutoComplete
                        ref={(node)=>{this.lastDetailInput=node}}
                        disabled={!this.state.detailsList[data.key-1].checked}
                        style={{ width: "100%"}}
                        onChange={(inputValue)=>{
                            this.state.detailsList[data.key-1].name = inputValue;
                            this.addNewDetailsRow();
                        }}
                        placeholder={<FormattedMessage id='order_form_table.detail.placeholder'/>}
                        defaultValue={data.name?data.name:undefined}
                        getPopupContainer={()=>document.getElementById(`${Styles.diagnosticModalServices}`)}
                        filterOption={(inputValue, option) =>
                            option.props.children.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0
                        }
                    >
                        {this.detailsOptions}
                    </AutoComplete>
                </div>
                <div style={{ width: '30%' }}>
                    <InputNumber
                        disabled={!this.state.detailsList[data.key-1].checked}
                        style={{ width: '70%' }}
                        min={1}
                        max={50}
                        defaultValue={data.count?data.count:1}
                    />
                    <Icon
                        onClick={()=>this.deleteDetailRow(data.key-1)}
                        style={{margin: '0 5%'}}
                        type="delete"
                        className={Styles.delete_diagnostic_button}
                    />
                </div>
            </div>
        )
    }

    render() {
        const { visible } = this.state;
        return (
            <div>
                <Button style={{ width: "80%" }} type="primary" onClick={this.showModal}>
                    <FormattedMessage id='order_form_table.diagnostic.create_order'/>
                </Button>
                <Modal
                    width="75%"
                    visible={visible}
                    title={<FormattedMessage id='order_form_table.diagnostic.create_order' />}
                    onCancel={this.handleCancel}
                    footer={[
                        <Button key="back" onClick={this.handleCancel}>
                            {<FormattedMessage id='cancel' />}
                        </Button>,
                        <Button key="submit" type="primary" onClick={this.handleOk}>
                            {<FormattedMessage id='order_form_table.diagnostic.confirm' />}
                        </Button>,
                    ]}
                >
                    <div className={Styles.confirm_diagnostic_modal_wrap}>
                        <div className={Styles.confirm_diagnostic_modal_element}>
                            <div className={Styles.confirm_diagnostic_modal_element_title}>
                                <FormattedMessage id='order_form_table.diagnostic.results' />
                            </div>
                            <div className={Styles.confirm_diagnostic_modal_element_content}>
                                {this.getDiagnosticContent()}
                            </div>
                        </div>
                        <div id={Styles.diagnosticModalServices} className={Styles.confirm_diagnostic_modal_element}>
                            <div className={Styles.confirm_diagnostic_modal_element_title}>
                                <FormattedMessage id='add_order_form.services' />
                            </div>
                            <div className={Styles.confirm_diagnostic_modal_element_content}>
                                {this.getServicesContent()}
                            </div>
                        </div>
                        <div id={Styles.diagnosticModalDetails} className={Styles.confirm_diagnostic_modal_element}>
                            <div className={Styles.confirm_diagnostic_modal_element_title}>
                                <FormattedMessage id='add_order_form.details' />
                            </div>
                            <div className={Styles.confirm_diagnostic_modal_element_content}>
                                {this.getDetailsContent()}
                            </div>
                        </div>
                    </div>
                </Modal>
            </div>
        );
    }
}
export default DiagnosticTable;
