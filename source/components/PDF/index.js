// vendor
import React, { Component } from 'react';
import { Document, Page } from 'react-pdf';
import { Pagination } from 'antd';

// proj
import { Loader } from 'commons';

// own
import samplePDF from './pricelist.pdf';
import Styles from './styles.m.css';

const options = {
    cMapUrl:    'cmaps/',
    cMapPacked: true,
};

export class PDF extends Component {
    state = {
        numPages:   null,
        pageNumber: 1,
    };

    _onDocumentLoadSuccess = document => {
        const { numPages } = document;
        this.setState({
            numPages,
            pageNumber: 1,
        });
    };

    _onChange = page => {
        this.setState({
            pageNumber: page,
        });
    };

    render() {
        const { numPages, pageNumber } = this.state;

        return (
            <div className={ Styles.pdf }>
                <Document
                    file={ samplePDF }
                    onLoadSuccess={ this._onDocumentLoadSuccess }
                    options={ options }
                    loading={ <Loader loading /> }
                >
                    <Page pageNumber={ pageNumber } scale={ 2 } />
                    { /* <Pagination
                        simple
                        defaultCurrent={ pageNumber }
                        // x10 for antd simple pagination weird approach
                        total={ numPages * 10 }
                        onChange={ this._onChange }
                        className={ Styles.paging }
                    /> */ }
                </Document>
            </div>
        );
    }
}
