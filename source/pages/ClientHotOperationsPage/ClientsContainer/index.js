//Vendor
import React from 'react';
import { Table, Input } from 'antd';

//Proj

export default class ClientsContainer extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {

        return (
            <div>
                <div style={{display: 'flex', justifyContent: 'center', padding: '10px'}}>
                    <div style={{display: 'flex', justifyContent: 'flex-end', padding: '5px', alignItems: 'center'}}>Search: </div>
                    <div style={{width: '40%'}}><Input /></div>
                    
                </div>
                
                <div>
                    <Table />
                </div>
            </div>
        );
    }
}