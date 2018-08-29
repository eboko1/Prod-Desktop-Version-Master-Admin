// vendor
import React, { Component } from 'react';

// proj
import { DecoratedSelect } from 'forms/DecoratedFields';

class LimitedDecoratedSelect extends Component {
    state = {
        search: null,
    };

    render() {
        const { children } = this.props;
        const { search } = this.state;
        const limitedChildren = !search
            ? children.slice(0, 100)
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
                onSearch={ search => this.setState({ search }) }
            />
        );
    }
}

export default LimitedDecoratedSelect;
