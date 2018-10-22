// vendor
import React, { Component } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Modal, List, Carousel } from 'antd';

// proj
import { Catcher } from 'commons';

// own
import Styles from './styles.m.css';

@injectIntl
export default class PartAttributes extends Component {
    render() {
        const {
            attributes: initAttributes,
            hideModal,
            showModal,
            supplier,
            detailCode,
            images,
        } = this.props;
        const { formatMessage } = this.props.intl;

        const detailCodeAttribute = detailCode
            ? {
                value:       detailCode,
                description: formatMessage({
                    id: 'partAttributes.detailCode',
                }),
            }
            : null;
        const supplierAttribute = supplier
            ? {
                value:       supplier.brandName,
                description: formatMessage({
                    id: 'partAttributes.brandName',
                }),
            }
            : null;
        const attributes = initAttributes
            ? [ detailCodeAttribute, supplierAttribute, ...initAttributes ].filter(Boolean)
            : [];

        return (
            <Catcher>
                <Modal
                    title={ <FormattedMessage id='partAttributes.title' /> }
                    cancelText={ <FormattedMessage id='cancel' /> }
                    visible={ showModal }
                    onOk={ () => hideModal() }
                    onCancel={ () => hideModal() }
                    footer={ null }
                >
                    { images &&
                        attributes && (
                        <Carousel
                            className={ Styles.attributesCarousel }
                            autoplay
                        >
                            { images.map(({ pictureName, supplierId }) => (
                                <div
                                    className={
                                        Styles.attributesCarouselSlide
                                    }
                                >
                                    <img
                                        src={ `${__TECDOC_IMAGES_URL__}/${supplierId}/${pictureName}` }
                                    />
                                </div>
                            )) }
                        </Carousel>
                    ) }
                    <List
                        bordered
                        dataSource={ attributes }
                        renderItem={ item => (
                            <List.Item>
                                { item.description &&
                                    item.value &&
                                    `${item.description}: ${item.value}` }
                                { item.description &&
                                    !item.value &&
                                    item.description }
                                { !item.description && item.value }
                            </List.Item>
                        ) }
                    />
                </Modal>
            </Catcher>
        );
    }
}
