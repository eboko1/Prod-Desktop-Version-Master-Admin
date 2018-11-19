// vendor
import React, { Component } from 'react';
import _ from 'lodash';

// proj
import { DecoratedSelect } from 'forms/DecoratedFields';

export default class LimitedDecoratedSelect extends Component {
    _onSearch = search => {
        this.setState({
            search: _.isString(search) ? search.toLowerCase() : void 0,
        });
    };

    constructor(props) {
        super(props);

        const requiredOptions = this._calculateRequiredOptions();
        const emptySearchOptions = this._getEmptySearchOptions();

        this.searchMap = {};
        this.state = { search: void 0, requiredOptions, emptySearchOptions };
    }

    _calculateRequiredOptions = () => {
        const defaultValues = this.props.defaultValues || [];

        return this.props.children
            ? this.props.children.filter(({ props: { children } }) =>
                defaultValues.includes(children))
            : [];
    };

    _getEmptySearchOptions = () => {
        const requiredOptions = this._calculateRequiredOptions();
        const children = this.props.children || [];

        return _.uniq([ ...children.slice(0, 50), ...requiredOptions ]);
    };

    _resolveSearchResult = search => {
        if (!this.searchMap[ search ]) {
            this.searchMap[ search ] = (this.props.children || [])
                .filter(
                    ({ props: { children } }) =>
                        children.toLowerCase().indexOf(search) !== -1,
                )
                .slice(0, 50);
        }

        return this.searchMap[ search ];
    };

    componentDidUpdate(prevProps) {
        if (
            prevProps.children !== this.props.children ||
            this.props.defaultValues !== prevProps.defaultValues
        ) {
            const requiredOptions = this._calculateRequiredOptions();
            const emptySearchOptions = this._getEmptySearchOptions();

            this.searchMap = {};
            this.setState({ requiredOptions, emptySearchOptions });
        }
    }

    render() {
        const { children } = this.props;
        const { search } = this.state;

        const limitedChildren = !search
            ? this.state.emptySearchOptions
            : this._resolveSearchResult(search);

        return children ? (
            <DecoratedSelect
                { ...this.props }
                children={ limitedChildren }
                onSearch={ this._onSearch }
            />
        ) : null;
    }
}
