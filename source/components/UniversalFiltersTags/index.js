// vendor
import React, { Component } from 'react';
import { Tag, Tooltip } from 'antd';
import _ from 'lodash';
import { v4 } from 'uuid';

// own
import Styles from './styles.m.css';

class UniversalFiltersTags extends Component {
    state = {
        tags: [],
    };

    log = e => console.log(e);

    handleClose = removedTag => {
        this.props.onChangeUniversalFiltersForm({[removedTag]: void 0}, {form: 'universalFiltersForm', field: removedTag});
        this.props.setUniversalFilters({[removedTag]: void 0});
        this.props.fetchOrders();
        // const tags = this.state.tags.filter(tag => tag !== removedTag);
        // console.log(tags);
        // this.setState({ tags });
    };

    render() {
        console.log(this.state);
        console.log(this.props);
        const filter = this.props.filter || {};
        const tagsFilter = _(filter)
            .pick(
                'managers',
                'employee',
                'service',
                'models',
                'makes',
                'creationReasons',
                'cancelReasons',
            )
            .toPairs()
            .filter(
                ([ key, value ]) =>
                    !_.isNil(value) && !(_.isString(value) && _.isEmpty(value)),
            )
            .map(([ key ]) => key)
            .value();

        console.log('az-kek-4eburek', tagsFilter);

        return (
            <div>
                { tagsFilter.map((tag, index) => {
                    const isLongTag = tag.length > 20;
                    const tagElem = (
                        <Tag
                            color='#9b59b6'
                            name={ tag }
                            key={ v4() }
                            closable
                            afterClose={ () => this.handleClose(tag) }
                        >
                            { isLongTag ? `${tag.slice(0, 20)}...` : tag }
                        </Tag>
                    );

                    // TODO z-index for tooltip
                    return isLongTag ? (
                        <Tooltip
                            title={ tag }
                            key={ tag }
                            className={ Styles.tagTooltip }
                        >
                            { tagElem }
                            { console.log('→ tag', tag) }
                        </Tooltip>
                    ) : 
                        tagElem
                    ;
                }) }
            </div>
        );
    }
}

export default UniversalFiltersTags;
