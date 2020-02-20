// vendor
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Table, Button, Modal, Upload, Icon, Checkbox, Select, Input } from 'antd';
import { FormattedMessage } from 'react-intl';

// proj
import { Catcher } from 'commons';
import { sendDiagnosticAnswer } from 'core/forms/orderDiagnosticForm/saga';
import { DiagnosticStatusButtons } from 'components';

// own
import Styles from './styles.m.css';

class DiagnosticTable extends Component {
    constructor(props) {
        super(props);
        this.columns = [
            {
                title:     '#',
                dataIndex: 'key',
                key:       'key',
                width:     '3%',
                render: (num)=> (
                <div>
                    <span>{num} </span>
                    <Checkbox></Checkbox>
                </div>
                ),
            },
            {
                title:     <FormattedMessage id='order_form_table.diagnostic.plan' />,
                dataIndex: 'plan',
                key:       'plan',
                width:     '10%',
                render: (plan)=> {
                    return plan != "" ? (
                        <p>
                            {plan}
                        </p>
                    ) : (
                        <Select defaultValue={plan}>
                            <Option value={plan}>{plan}</Option>
                        </Select>  
                    );
                },
            },
            {
                title:     <FormattedMessage id='order_form_table.diagnostic.detail' />,
                dataIndex: 'detail',
                key:       'detail',
                width:     '15%',
                render: (detail)=> {
                    return detail != "" ? (
                        <p>
                            {detail}
                        </p>
                    ) : (
                        <Select defaultValue={detail}>
                            <Option value={detail}>{detail}</Option>
                        </Select>  
                    );
                },
            },
            {
                title:     <FormattedMessage id='order_form_table.diagnostic.stage' />,
                dataIndex: 'stage',
                key:       'stage',
                width:     '45%',
                render: (stage)=> {
                    return stage != "" ? (
                        <p>
                            {stage}
                        </p>
                    ) : (
                        <Input defaultValue={stage}/>
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
                width:     '12%',
                render: (text, rowProp) => (
                    <DiagnosticStatusButton
                        status={text}
                        rowProp={rowProp}
                    />
                ),
            },
            {
                dataIndex: 'delete',
                key:       'delete',
                width:     '5%',
                render: (text, rowProp) => (
                    <Icon type="delete" className={Styles.delete_diagnostic_button}/>
                ),
            },
        ];
    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextProps.orderDiagnostic !== this.props.orderDiagnostic;
    }

    render() {
        const {orderDiagnostic, orderId } = this.props;
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
                        detail: diagnosticTitle,
                        stage: processTitle,
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
            stage: "",
            status: "",
            commentary: "",
            orderId: orderId,
            diagnosticTemplateId: "",
            diagnosticId: "",
            photo: "",
        },);
        const columns = this.columns;

        return (
            <Catcher>
                <DiagnosticTableHeader/>
                <Table
                    className={ Styles.diagnosticTable }
                    dataSource={ dataSource }
                    columns={ columns }
                    locale={ {
                        emptyText: <FormattedMessage id='no_data' />,
                    } }
                />
            </Catcher>
        );
    }
}

class DiagnosticTableHeader extends React.Component{
    render(){
        return(
            <div className={Styles.DiagnosticTableHeader}>
                <div style={{ width: "3%" }}>
                    <Checkbox></Checkbox>
                </div>
                <div style={{ width: "10%" }}>
                    <Select
                        showSearch
                        style={{ width: 200 }}
                        placeholder="Template"
                    >
                        <Option value="test">test</Option>
                        <Option value="test2">test2</Option>
                        <Option value="test3">test3</Option>
                    </Select>
                </div>
                <div style={{ width: "15%" }}>
                    <Button>+</Button>
                    <Button>-</Button>
                </div>
                <div style={{ width: "45%" }}>
                    <Button type="primary" style={{ width: "80%" }}>Создать Н/З</Button>
                </div>
                <div style={{ width: "10%" }}>
                    <Button type="primary">Open</Button>
                </div>
                <div style={{ width: "12%" }}>
                    <Button style={{background:'rgb(81, 205, 102)'}}>
                        <FormattedMessage id='order_form_table.diagnostic.status.ok' />
                    </Button>
                    <Button style={{background:'rgb(255, 255, 0)'}}>
                        <FormattedMessage id='order_form_table.diagnostic.status.bad' />
                    </Button>
                    <Button type="danger" style={{background:'rgb(255, 126, 126)'}}>
                        <FormattedMessage id='order_form_table.diagnostic.status.critical' />
                    </Button>
                </div>
                <div style={{ width: "5%" }}>
                    <Icon type="delete" className={Styles.delete_diagnostic_button}/>
                </div>
            </div>
        );
    }
}

class DiagnosticStatusButton extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            status: this.props.status
        }
    }
    componentDidMount() {
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
    componentDidUpdate() {
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
    handlClick = (status) => {
        const { rowProp } = this.props;
        sendDiagnosticAnswer(rowProp.orderId, rowProp.diagnosticTemplateId, rowProp.diagnosticId, rowProp.processId, status);
        this.setState({status:status});
    }
    render(){
        const status = this.state.status;
        return status > 0 ? (
            <div className={Styles.diagnostic_status_button_wrap}>
                <Button className={Styles.diagnostic_status_button_edit} type="primary" onClick={()=>this.handlClick(0)}>
                    <FormattedMessage id='order_form_table.diagnostic.status.edit' />
                </Button>
            </div>
            ) : (
            <div className={Styles.diagnostic_status_button_wrap}>
                <Button className={Styles.diagnostic_status_button} onClick={()=>this.handlClick(1)} style={{background:'rgb(81, 205, 102)'}}>
                    <FormattedMessage id='order_form_table.diagnostic.status.ok' />
                </Button>
                <Button className={Styles.diagnostic_status_button} onClick={()=>this.handlClick(2)} style={{background:'rgb(255, 255, 0)'}}>
                    <FormattedMessage id='order_form_table.diagnostic.status.bad' />
                </Button>
                <Button className={Styles.diagnostic_status_button} type="danger" onClick={()=>this.handlClick(3)} style={{background:'rgb(255, 126, 126)'}}>
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
                            {<FormattedMessage id='submit' />}
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
            {
              uid: '-1',
              name: 'xxx.png',
              status: 'done',
              url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
              thumbUrl: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
            },
            {
              uid: '-2',
              name: 'yyy.png',
              status: 'error',
            },
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
                            {<FormattedMessage id='submit' />}
                        </Button>,
                    ]}
                    >
                    <Upload {...props}></Upload>
                </Modal>
            </div>
        );
    }
}

export default DiagnosticTable;