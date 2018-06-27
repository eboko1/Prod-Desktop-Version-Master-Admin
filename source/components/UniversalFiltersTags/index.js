// vendor
import React, { Component } from 'react';
import { Tag, Tooltip } from 'antd';

// own
import Styles from './styles.m.css';

class UniversalFiltersTags extends Component {
    state = {
        tags: [ 'Filter 1', 'Filter 2', 'Filter 3' ],
    };

    log = e => console.log(e);

    handleClose = removedTag => {
        const tags = this.state.tags.filter(tag => tag !== removedTag);
        console.log(tags);
        this.setState({ tags });
    };

    render() {
        return (
            <div>
                { this.state.tags.map((tag, index) => {
                    const isLongTag = tag.length > 20;
                    const tagElem = (
                        <Tag
                            key={ tag }
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
