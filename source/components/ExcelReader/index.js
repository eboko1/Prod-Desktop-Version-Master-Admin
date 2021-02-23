// vendor
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { Button, Icon } from 'antd';
import XLSX from 'xlsx';
import styled from 'styled-components';

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
            // https://github.com/SheetJS/js-xlsx
            const data = XLSX.utils.sheet_to_json(ws, {
                header: [
                    'code',
                    'groupName',
                    'measureUnit',
                    'name',
                    'brandName',
                    'tradeCode',
                    'certificate',
                    'priceGroupNumber',
                    'price',
                ],
                range: 'A2:I50001',
            });
            /* Update state */
            this.setState({ data: data, cols: makeCols(ws[ '!ref' ]) });

            this.props.validateExcel(data);
        };

        if (rABS) {
            reader.readAsBinaryString(this.state.file);
        } else {
            reader.readAsArrayBuffer(this.state.file);
        }
    };

    render() {
        return (
            <StyledUpload>
                
                <label htmlFor='file'>
                    <div>
                        <Button type={'primary'} style={{pointerEvents: "none"}}>
                            <Icon type='upload' style={{fontSize: 18, marginRight: 4}}/>
                            <FormattedMessage id='storage.import_excel_with_products' />
                        </Button>
                    </div>
                </label>
                <input
                    type='file'
                    className='form-control'
                    id='file'
                    accept={ types }
                    onChange={ this._handleChange }
                />
            </StyledUpload>
        );
    }
}

const StyledUpload = styled.div`
    
    & > label {
        cursor: pointer;
        z-index: 200;
        display: block;
    }

    & > input {
        display: none;
    }
`;
