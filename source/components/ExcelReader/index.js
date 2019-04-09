// vendor
import React, { Component } from 'react';
import XLSX from 'xlsx';

// own
import { makeCols } from './columns';
import types from './types';

export class ExcelReader extends Component {
    state = {
        file: null,
        data: [],
        cols: [],
    };

    componentDidUpdate(prevProps, prevState) {
        if (prevState.file !== this.state.file) {
            this._handleFile();
        }
    }

    _handleChange = event => {
        const files = event.target.files;
        if (files && files[ 0 ]) {
            this.setState({ file: files[ 0 ] });
        }
    };

    _handleFile = () => {
        /* Boilerplate to set up FileReader */
        const reader = new FileReader();
        const rABS = !!reader.readAsBinaryString;

        reader.onload = event => {
            /* Parse data */
            const bstr = event.target.result;
            const wb = XLSX.read(bstr, {
                type:    rABS ? 'binary' : 'array',
                bookVBA: true,
            });

            /* Get first worksheet */
            const wsname = wb.SheetNames[ 0 ];
            const ws = wb.Sheets[ wsname ];

            /* Convert array of arrays */
            const data = XLSX.utils.sheet_to_json(ws);
            console.log('→ data', data);
            /* Update state */
            this.setState({ data: data, cols: makeCols(ws[ '!ref' ]) }, () => {
                console.log(JSON.stringify(this.state.data, null, 2));
            });

            this.props.importExcel(data);
        };

        if (rABS) {
            reader.readAsBinaryString(this.state.file);
        } else {
            reader.readAsArrayBuffer(this.state.file);
        }
    };

    render() {
        return (
            <div>
                <label htmlFor='file'>Upload an Excel</label>
                <input
                    type='file'
                    className='form-control'
                    id='file'
                    accept={ types }
                    onChange={ this._handleChange }
                    style={ { visibility: 'hidden' } }
                />
            </div>
        );
    }
}
