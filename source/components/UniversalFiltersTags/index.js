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

    filterTagsFields = [ 'managers', 'employee', 'service', 'models', 'make', 'creationReasons', 'cancelReasons' ];

    handleClose = removedTag => this.props.clearUniversalFilter(removedTag);

    render() {
        const filter = this.props.filter || {};

        // TODO refactro lodash chain
        const tagsFilter = _(filter)
            .pick(this.filterTagsFields)
            .toPairs()
            .filter(
                ([ key, value ]) =>
                    !_.isNil(value) && !(_.isString(value) && _.isEmpty(value)),
            )
            .map(([ key ]) => key)
            .value();

        return (
            <div>
                { tagsFilter.map(tag => {
                    const isLongTag = tag.length > 20;
                    const tagElem = (
                        <Tag
                            color='#9b59b6'
                            name={ tag }
                            // after rm tag ant persist local state of Component
                            // v4 generate uniq component with new state
                            key={ v4() } // TODO hidden tags will block new tags
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
