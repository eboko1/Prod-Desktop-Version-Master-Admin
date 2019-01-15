// vendor
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import numeral from 'numeral';

export default class Numeral extends Component {
    static propTypes = {
        children: PropTypes.number,
        mask:     PropTypes.string,
        currency: PropTypes.string,
        url:      PropTypes.string,
        urlBlank: PropTypes.bool,
        nullText: PropTypes.string,
        styler:   PropTypes.func,
    };

    static defaultProps = {
        children: 0,
        mask:     '0,0[]00',
        currency: '',
        url:      null,
        urlBlank: false,
        nullText: '0',
    };

    numFormatter() {
        const { children, url, mask, currency, nullText } = this.props;
        if (children) {
            if (url) {
                return (
                    <Link to={ url }>
                        <nobr>
                            { numeral(children).format(mask) } { currency }
                        </nobr>
                    </Link>
                );
            }

            return (
                <nobr>
                    { numeral(children).format(mask) } { currency }
                </nobr>
            );
        }

        return (
            <span>
                { nullText } { currency }
            </span>
        );
    }

    render() {
        return (
            <span className={ this.props.className }>{ this.numFormatter() }</span>
        );
    }
}
