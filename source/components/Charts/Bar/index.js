// vendor
import React, { Component } from 'react';

import {
    BarChart,
    Bar as BarColumn,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
} from 'recharts';

import _ from 'lodash';

// const data = [{ name: 'Page A', uv: 4000, pv: 2400, amt: 2400 }, { name: 'Page B', uv: 3000, pv: 1398, amt: 2210 }, { name: 'Page C', uv: 2000, pv: 9800, amt: 2290 }, { name: 'Page D', uv: 2780, pv: 3908, amt: 2000 }, { name: 'Page E', uv: 1890, pv: 4800, amt: 2181 }, { name: 'Page F', uv: 2390, pv: 3800, amt: 2500 }, { name: 'Page G', uv: 3490, pv: 4300, amt: 2100 }];

export default class Bar extends Component {
    render() {
        const { data } = this.props;
        // console.log('→ data', data);
        let result;

        /* eslint-disable func-names*/
        if (data) {
            result = _.each(data, (value, key) => key);
            // result = _.each(data, function(value) {
            //     _.each(value, function(value) {
            //         console.log('→ aaa');
            //
            //         return <div>{ value }</div>;
            //     });
            // });
            // result = _.each(data, value =>
            //     _.each(value => score => <div>{ score }</div>));
        }
        console.log('→ result', result);
        // .map(bar => _.each(bar.score, (value, key) => <div>{key}</div>)

        return data ? (
            <BarChart
                width={ 600 }
                height={ 300 }
                data={ data }
                margin={ { top: 5, right: 30, left: 20, bottom: 5 } }
            >
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis dataKey='id' />
                <YAxis />
                <Tooltip />
                <Legend />
                { /* { console.log('→ Object.keys(data)', _.each(data)) } */ }
                { /* { console.log('→ set::', [ ...new Set(data) ].join(', ')) } */ }
                { /* { _.each(data).map(bar =>
                    _.each(bar.score, (value, key) => (
                        <BarColumn
                            dataKey={ 'total' }
                            fill='rgba(155, 89, 182, .85)'
                        />
                    ))) } */ }
            </BarChart>
        ) : null;
    }
}

/* <BarColumn
    dataKey={ key }
    fill='rgba(155, 89, 182, .85)'
/> */
