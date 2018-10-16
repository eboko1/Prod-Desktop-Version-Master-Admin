// Core
import React, { Component } from 'react';

// proj
import { Catcher } from 'commons';
import { CallsPieChart } from 'components';

export default class CallsStatistics extends Component {
    render() {
        return (
            <Catcher>
                <div>
                    calls pies
                    { /* <CallsPieChart /> */ }
                </div>
            </Catcher>
        );
    }
}
