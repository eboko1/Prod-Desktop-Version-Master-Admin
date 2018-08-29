// vendor
import React, { Component } from 'react';

// proj
import { DecoratedSelect } from 'forms/DecoratedFields';

class LimitedDecoratedSelect extends Component {
    state = {
        search: null,
    };

    render() {
        const { children, defaultValues = [] } = this.props;
        const { search } = this.state;
        const requiredOptions = children.filter(({ props: { children } }) =>
            defaultValues.includes(children));

        const limitedChildren = !search
            ? _.uniq([ ...children.slice(0, 100), requiredOptions ])
            : children
                .filter(
                    ({ props: { children } }) =>
                        children.toLowerCase().indexOf(search) !== -1,
                )
                .slice(0, 100);

        return (
            <DecoratedSelect
                { ...this.props }
                children={ limitedChildren }
                onSearch={ search => this.setState({ search: _.isString(search) ? search.toLowerCase() : search }) }
            />
        );
    }
}

export default LimitedDecoratedSelect;
