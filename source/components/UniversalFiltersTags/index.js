// vendor
import React, { Component } from 'react';
import { Tag, Tooltip } from 'antd';
import _ from 'lodash';
import { v4 } from 'uuid';
import { injectIntl } from 'react-intl';

// own
import Styles from './styles.m.css';

@injectIntl
class UniversalFiltersTags extends Component {
    state = {
        tags: [],
    };

    // To deals with dateranges, one daterange == two date pickers, which we need to clear
    tagsToUniversalFilterFields = {
        beginDate:  [ 'startDate', 'endDate' ],
        createDate: [ 'createStartDate', 'createEndDate' ],
    };

    // Bind tags to filters keys
    filterTagsFields = [ 'managers', 'employee', 'service', 'models', 'make', 'creationReasons', 'cancelReasons', 'beginDate', 'createDate', 'year', 'odometerLower', 'odometerGreater' ];

    // Clear tags using tagsToUniversalFilterFields
    handleClose = removedTag => {
        this.props.clearUniversalFilters([ ...this.tagsToUniversalFilterFields[ removedTag ] || [], removedTag ]);
    };

    localizeTag(tag) {
        return this.props.intl.formatMessage({
            id:             `universal_filters_tags.${tag}`,
            defaultMessage: tag,
        });
    }

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
            .value()
            .map((tag) => this.localizeTag(tag));

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
