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
    // Clear tags using tagsToUniversalFilterFields
    handleClose = removedTagId => {
        const universalLinkedFields = this.props.universalLinkedFields || {};
        const additionalFieldsArrays =
            universalLinkedFields[ removedTagId ] || [];
        const additionalFields = _.flatten(additionalFieldsArrays);

        this.props.clearUniversalFilters([ ...additionalFields, removedTagId ]);
    };

    localizeTag(id) {
        const localeId = `universal_filters_tags.${id}`;
        const name = this.props.intl.formatMessage({ id: localeId });
        const tag = { id, name };

        return tag;
    }

    render() {
        const { filter, tagFields, universalLinkedFields = {} } = this.props;

        const findLinkedFieldParent = field => {
            const config = _(universalLinkedFields)
                .toPairs()
                .find(config => _.get(config, '1').includes(field));

            if (config) {
                return _.first(config);
            }
        };

        const hasTag = (key, value) => {
            const isValueValid =
                !_.isNil(value) &&
                !(_.isString(value) && _.isEmpty(value)) &&
                !(_.isArray(value) && !value.length);
            const isKeyValid =
                findLinkedFieldParent(key) || tagFields.includes(key);

            return isValueValid && isKeyValid;
        };

        const tagsFilter = _(filter)
            .toPairs()
            .filter(([ key, value ]) => hasTag(key, value))
            .map(
                ([ key ]) =>
                    tagFields.includes(key) ? key : findLinkedFieldParent(key),
            )
            .uniq()
            .map(tagId => this.localizeTag(tagId))
            .value();

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
