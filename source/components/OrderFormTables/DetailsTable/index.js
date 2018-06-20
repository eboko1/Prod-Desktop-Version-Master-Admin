// vendor
import React, { Component } from 'react';

// proj
import { Catcher } from 'commons';

class DetailsTable extends Component {
    handleChange(value) {
        console.log(`selected ${value}`);
    }

    render() {
        return (
            <Catcher>
                <div>DetailsTable</div>
            </Catcher>
        );
    }
}

export default DetailsTable;
