/*
Container used to show clients and perform basic search of them.
*/
//Vendor
import React from 'react';
import { connect } from "react-redux";
import { Table, Input } from 'antd';

//Own
import { columnsConfig } from './config';

const mapStateToProps = state => ({
    user: state.auth,
    clients: state.clientHotOperations.clients
});

@connect(
    mapStateToProps,
    void 0,
)
export default class ClientsContainer extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {
            clients
        } = this.props;

        return (
            <div>
                <div style={{display: 'flex', justifyContent: 'center', padding: '10px'}}>
                    <div style={{display: 'flex', justifyContent: 'flex-end', padding: '5px', alignItems: 'center'}}>Search: </div>
                    <div style={{width: '40%'}}><Input /></div>
                    
                </div>
                
                <div>
                    <Table
                        dataSource={clients}
                        columns={columnsConfig()}
                        scroll={ { x: 1000, y: '30vh' } }
                    />
                </div>
            </div>
        );
    }
}