// vendor
import React, { Component } from 'react';
import { Tag, Tooltip } from 'antd';
import { v4 } from 'uuid';
import { injectIntl } from 'react-intl';
import _ from 'lodash';

// own
import Styles from './styles.m.css';

@injectIntl
export default class UniversalFiltersTags extends Component {
    state = {
        tags: [],
    };

    // To deals with dateranges, one daterange == two date pickers, which we need to clear
    tagsToUniversalFilterFields = {
        beginDate:     [ 'startDate', 'endDate' ],
        createDate:    [ 'createStartDate', 'createEndDate' ],
        notVisitRange: [ 'notVisit', 'notVisitDays' ],
    };

    // Bind tags to filters keys
    /* eslint-disable array-element-newline */
    filterTagsFields = [
        'notVisitRange',
        'ordersGreater',
        'ordersLower',
        'managers',
        'employee',
        'service',
        'models',
        'make',
        'creationReasons',
        'cancelReasons',
        'beginDate',
        'createDate',
        'year',
        'odometerLower',
        'odometerGreater',
    ];

    // Clear tags using tagsToUniversalFilterFields
    handleClose = removedTagId => {
        this.props.clearUniversalFilters([
            ...this.tagsToUniversalFilterFields[ removedTagId ] || [],
            removedTagId,
        ]);
    };
    /* eslint-enable array-element-newline */

    localizeTag(id) {
        const name = this.props.intl.formatMessage({
            id:             `universal_filters_tags.${id}`,
            defaultMessage: id,
        });
        const tag = { id, name };

        return tag;
    }

    render() {
        console.log('→ this.props.filter', this.props.filter);
        let filter = this.props.filter || {};
        if (filter.notVisitDays) {
            filter = { ...filter, notVisitRange: true };
        }

        // TODO refactro lodash chain
        const tagsFilter = _(filter)
            .pick(this.filterTagsFields)
            .toPairs()
            .filter(
                ([ key, value ]) =>
                    !_.isNil(value) && !(_.isString(value) && _.isEmpty(value)),
            )
            .map(([ key ]) => key)
            .value()
            .map(tagId => this.localizeTag(tagId));

        return (
            <div>
                { tagsFilter.map(({ id, name }) => {
                    const isLongTag = name.length > 20;
                    const tagElem = (
                        <Tag
                            color='#9b59b6'
                            name={ name }
                            // after rm tag ant persist local state of Component
                            // v4 generate uniq component with new state
                            key={ v4() } // TODO hidden tags will block new tags
                            closable
                            afterClose={ () => this.handleClose(id) }
                        >
                            { isLongTag ? `${name.slice(0, 20)}...` : name }
                        </Tag>
                    );

                    // TODO z-index for tooltip
                    return isLongTag ? (
                        <Tooltip
                            title={ name }
                            key={ id }
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
