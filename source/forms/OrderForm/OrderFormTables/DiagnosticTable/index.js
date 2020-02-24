// vendor
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Table, Button, Modal, Upload, Icon, Checkbox, Select, Input } from 'antd';
import { FormattedMessage } from 'react-intl';

// proj
import { Catcher } from 'commons';
import { API_URL, addNewDiagnosticTemplate, getDiagnosticsTemplates, addNewDiagnosticRow, sendDiagnosticAnswer, deleteDiagnosticProcess } from 'core/forms/orderDiagnosticForm/saga';
import { DiagnosticStatusButtons } from 'components';

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
            diagnosticsTitles: [],
            processesTitles: [],
        };
        this.templatesData = this.templatesData == undefined ? {} : this.templatesData;
        this.templatesTitles = [];
        this.diagnosticsTitles = [];
        this.processesTitles = [];
        this.addNewDiagnostic = this.addNewDiagnostic.bind(this);
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
                    if(this.state.possibleRows.indexOf(num) == -1 )this.state.possibleRows.push(num);
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
                    let options = undefined !== this.state.diagnosticsTitles ? this.state.diagnosticsTitles : [];
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
                    let options = undefined !== this.state.processesTitles ? this.state.processesTitles : [];
                    return detail != "" ? (
                        <span>
                            <p>{detail}</p>
                            <p>{rowProp.actionTitle}</p>
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
    }

    onPlanChange(event) {
        let tmp = [];
        for (let i = 0; i < this.diagnosticsTitles.length; i++) {
            if(this.diagnosticsTitles[i].parent == event) {
                tmp.push(this.diagnosticsTitles[i].title);
            }
        }
        this.setState({
            diagnosticsTitles: tmp,
        });
    }

    onStageChange(event) {
        let tmp = [];
        for (let i = 0; i < this.processesTitles.length; i++) {
            if(this.processesTitles[i].parent == event) {
                tmp.push(this.processesTitles[i].title);
            }
        }
        this.setState({
            processesTitles: tmp,
        });
    }

    onDetailChange(event) {
        let processId, diagnosticId, processParent, diagnosticParent,templateId;
        for (let i = 0; i < this.processesTitles.length; i++) {
            if(this.processesTitles[i].title == event) {
                processId = this.processesTitles[i].id;
                processParent = this.processesTitles[i].parent;
            }
        }
        for (let i = 0; i < this.diagnosticsTitles.length; i++) {
            if(this.diagnosticsTitles[i].title == processParent) {
                diagnosticId = this.diagnosticsTitles[i].id;
                diagnosticParent = this.diagnosticsTitles[i].parent;
            }
        }
        templateId = this.templatesTitles.indexOf(diagnosticParent) + 1;
        addNewDiagnosticRow(this.state.orderId, templateId, diagnosticId, processId);
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
            that.setState({
                orderDiagnostic: data.diagnosis,
            });
            //that.state.orderDiagnostic = data;
            that.updateDataSource();
            console.log("data", data);
        })
        .catch(function (error) {
            console.log('error', error)
        });
    }

    getTemplatesList() {
        for(let i = 0 ; i < this.templatesData.diagnosticTemplatesCount; i++) {
            this.templatesTitles.push(this.templatesData.diagnosticTemplates[i].diagnosticTemplateTitle);
            let diagnosticsCount = this.templatesData.diagnosticTemplates[i].diagnosticsCount;
            for (let j = 0; j < diagnosticsCount; j++) {
                let diagnostic =  this.templatesData.diagnosticTemplates[i].diagnostics[j];
                let id = diagnostic.diagnosticId;
                let title = diagnostic.diagnosticTitle;
                this.diagnosticsTitles.push({
                    id: id,
                    title: title,
                    parentId: this.templatesData.diagnosticTemplates[i].diagnosticTemplateId,
                    parent: this.templatesData.diagnosticTemplates[i].diagnosticTemplateTitle,
                });

                for (let k = 0; k < diagnostic.processesCount; k++) {
                    let process =  diagnostic.processes[k];
                    let id = process.processId;
                    let title = process.processTitle;
                    this.processesTitles.push({
                        id: id,
                        title: title,
                        parentId: diagnostic.diagnosticId,
                        parent: diagnostic.diagnosticTitle,
                    });
                }
            }
        }
        /*this.setState({
            diagnosticsTitles: this.diagnosticsTitles,
            processesTitles: this.processesTitles,
        });*/
    }

    deleteRow(index) {
        let tmp_dataSource = this.state.dataSource;
        tmp_dataSource.splice(index, 1);

        for(let i = 0; i < tmp_dataSource.length; i++) {
            tmp_dataSource[i].key = i+1;
        }
        this.setState({
            dataSource: tmp_dataSource,
        });
        this.getCurrentDiagnostic();
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
    }

    async editSelectedRowsStatus(status) {
        for(let i = 0; i < this.state.selectedRows.length; i++){
            let key = this.state.selectedRows[i] - 1;
            await sendDiagnosticAnswer(
                this.props.orderId,
                this.state.dataSource[key].diagnosticTemplateId,
                this.state.dataSource[key].diagnosticId,
                this.state.dataSource[key].processId,
                status
            );
        }
        this.setState({
            selectedRows: [],
        });
        {this.getCurrentDiagnostic()}
    }

    async deleteSelectedRows() {
        for(let i = 0; i < this.state.selectedRows.length; i++){
            let key = this.state.selectedRows[i] - 1;
            await deleteDiagnosticProcess(
                this.props.orderId,
                this.state.dataSource[key].diagnosticTemplateId,
                this.state.dataSource[key].diagnosticId,
                this.state.dataSource[key].processId,
            );
        }
        this.setState({
            selectedRows: [],
        });
        {this.getCurrentDiagnostic()}
    }

    onChangeCheckbox(key) {
        if(event.target.checked) {
            this.state.selectedRows.push(key);
        }
        else {
            let index = this.state.selectedRows.indexOf(key);
            this.state.selectedRows.splice(index, 1);
        }

        let allchecked = (this.state.selectedRows.length == this.state.possibleRows.length),
            indeterminate = this.state.selectedRows.length < this.state.possibleRows.length && this.state.selectedRows.length > 0;

        this.setState({
            headerCheckboxIndeterminate: indeterminate,
            checkedAll: allchecked,
        });
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
            let diagnosticsCount = _.pick(diagnosticTemplates[i], [
                "diagnosticsCount",
            ]).diagnosticsCount;
            let diagnosticTemplateTitle = _.pick(diagnosticTemplates[i], [
                "diagnosticTemplateTitle",
            ]).diagnosticTemplateTitle;
            let diagnosticTemplateId = _.pick(diagnosticTemplates[i], [
                "diagnosticTemplateId",
            ]).diagnosticTemplateId;
            let diagnostics = _.pick(diagnosticTemplates[i], [
                "diagnostics",
            ]).diagnostics;
            for(let j = 0; j < diagnosticsCount; j++) {
                let diagnosticTitle = _.pick(diagnostics[j], [
                    "diagnosticTitle",
                ]).diagnosticTitle;
                let diagnosticId = _.pick(diagnostics[j], [
                    "diagnosticId",
                ]).diagnosticId;
                let processesCount = _.pick(diagnostics[j], [
                    "processesCount",
                ]).processesCount;
                let processes = _.pick(diagnostics[j], [
                    "processes",
                ]).processes;
                for(let k = 0; k < processesCount; k++) {
                    let processTitle = _.pick(processes[k], [
                        "processTitle",
                    ]).processTitle;
                    let actionTitle = _.pick(processes[k], [
                        "actionTitle",
                    ]).actionTitle;
                    let processId = _.pick(processes[k], [
                        "processId",
                    ]).processId;
                    let answer = _.pick(processes[k], [
                        "answer",
                    ]).answer;
                    let comment = _.pick(processes[k], [
                        "comment",
                    ]).comment;
                    let photo = _.pick(processes[k], [
                        "photo",
                    ]).photo;
                    dataSource.push({
                        key: key,
                        processId: processId,
                        plan: diagnosticTemplateTitle,
                        stage: diagnosticTitle,
                        detail: processTitle,
                        actionTitle: actionTitle,
                        status: answer,
                        commentary: comment,
                        orderId: orderId,
                        diagnosticTemplateId: diagnosticTemplateId,
                        diagnosticId: diagnosticId,
                        photo: photo,
                    },);
                    key++;
                }
            }
        }
        dataSource.push({
            key: key,
            processId: "",
            plan: "",
            detail: "",
            actionTitle: "",
            stage: "",
            status: "",
            commentary: "",
            orderId: orderId,
            diagnosticTemplateId: "",
            diagnosticId: "",
            photo: "",
            allTemplatesData: orderDiagnostic,
        },);
        //this.state.dataSource = dataSource;
        //this.state.rowsCount = key;
        this.setState({
            dataSource: dataSource,
            rowsCount: key,
        });
        console.log(this.state.dataSource);
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
        console.log("RENDER");
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
                    editSelectedRowsStatus = {this.editSelectedRowsStatus}
                    deleteSelectedRows = {this.deleteSelectedRows}

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
            indeterminate: props.headerCheckboxIndeterminate,
            checked: props.checkedAll,
            selectValue : "",
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

    render(){
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
                    <Button>-</Button>
                </div>
                <div style={{ width: "35%" }}>
                    <Button type="primary" style={{ width: "80%" }}>Создать Н/З</Button>
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

    handleClick = (status) => {
        const { rowProp } = this.props;
        sendDiagnosticAnswer(rowProp.orderId, rowProp.diagnosticTemplateId, rowProp.diagnosticId, rowProp.processId, status);
        this.setState({status:status});
    }
    render(){
        this.state.status = this.props.status;
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
    }

    showModal = () => {
        this.setState({
            visible: true,
        });
    };

    handleOk = () => {
        this.setState({ loading: true });
        const { rowProp } = this.props;
        sendDiagnosticAnswer(rowProp.orderId, rowProp.diagnosticTemplateId, rowProp.diagnosticId, rowProp.processId, rowProp.status, this.state.commentary);
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
        sendDiagnosticAnswer(rowProp.orderId, rowProp.diagnosticTemplateId, rowProp.diagnosticId, rowProp.processId, rowProp.status, rowProp.commentary, this.state.photo);
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


class DeleteProcessButton extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            deleted: false,
        }
    }

    handleClick = () => {
        const { rowProp } = this.props;
        deleteDiagnosticProcess(rowProp.orderId, rowProp.diagnosticTemplateId, rowProp.diagnosticId, rowProp.processId);
        //ReactDOM.findDOMNode(this).parentNode.parentNode.style.display = 'none';
        ReactDOM.findDOMNode(this).parentNode.parentNode.style.backgroundColor = "";
        this.props.deleteRow(this.props.rowProp.key-1);
        this.setState({deleted:true});
    }

    render() {
        return <Icon type="delete" onClick={this.handleClick} className={Styles.delete_diagnostic_button}/>

    }
}
export default DiagnosticTable;