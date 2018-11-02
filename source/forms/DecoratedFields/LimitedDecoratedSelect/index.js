// vendor
import React, { Component } from 'react';
import _ from 'lodash';

// proj
import { DecoratedSelect } from 'forms/DecoratedFields';

export default class LimitedDecoratedSelect extends Component {
    static defaultProps = {
        children:      [],
        defaultValues: [],
    };

    state = {
        search: null,
    };

    render() {
        const { children, defaultValues } = this.props;
        console.log('→ children', children);
        const { search } = this.state;
        const requiredOptions = children
            ? children.filter(({ props: { children } }) =>
                defaultValues.includes(children))
            : [];

        const limitedChildren = !search
            ? _.uniq([ ...children.slice(0, 100), ...requiredOptions ])
            : children
                .filter(
                    ({ props: { children } }) =>
                        children.toLowerCase().indexOf(search) !== -1,
                )
                .slice(0, 100);

        return children ? (
            <DecoratedSelect
                { ...this.props }
                children={ limitedChildren }
                onSearch={ search =>
                    this.setState({
                        search: _.isString(search)
                            ? search.toLowerCase()
                            : search,
                    })
                }
            />
        ) : null;
    }
}
