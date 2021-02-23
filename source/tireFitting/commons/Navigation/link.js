// vendor
import React, { Component } from 'react';
import { Link as ReactLink } from 'react-router-dom';

// proj

// own

/*
 * Taken form https://gist.github.com/shprink/bf9599e1d66b9dc4d151e89c1199ccb8
 * The problem described in https://github.com/ReactTraining/react-router/issues/1147
 * */
export default class Link extends Component {
    parseTo(to) {
        let parser = document.createElement('a');
        parser.href = to;

        return parser;
    }

    isInternal(to) {
        // If it's a relative url such as '/path', 'path' and does not contain a protocol we can assume it is internal.

        if (to.indexOf('://') === -1) {
            return true;
        }

        const toLocation = this.parseTo(to);

        return window.location.hostname === toLocation.hostname;
    }

    render() {
        const {
            to,
            children,
            onClick,
            collapsed,
            mobile,
            ...rest
        } = this.props;

        const isInternal = this.isInternal(to);

        if (isInternal) {
            return mobile ? (
                <ReactLink
                    to={ to }
                    { ...rest }
                    onClick={ () => onClick(!collapsed) }
                >
                    { children }
                </ReactLink>
            ) : (
                <ReactLink to={ to } { ...rest }>
                    { children }
                </ReactLink>
            );
        }

        return (
            <a href={ to } { ...rest }>
                { children }
            </a>
        );
    }
}
