// vendor
import React, { Component } from "react";
import { FormattedMessage, injectIntl } from "react-intl";
import { Modal, List, Carousel } from "antd";

// proj
import { Catcher } from "commons";

// own
import Styles from "./styles.m.css";

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
                  value: detailCode,
                  description: formatMessage({
                      id: "partAttributes.detailCode",
                  }),
              }
            : null;
        const supplierAttribute = supplier
            ? {
                  value: supplier.brandName,
                  description: formatMessage({
                      id: "partAttributes.brandName",
                  }),
              }
            : null;

        const supplierAdditionalAttributes =
            supplier && supplier.supplierId === 85
                ? [
                      {
                          value: (
                              <a
                                  style={{ color: "red " }}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  href={"https://kyb-europe.com/rus/qr/"}
                              >
                                  Перейти
                              </a>
                          ),
                          description: "Техническая информация по установке",
                      },
                      {
                          value: (
                              <a
                                  style={{ color: "red " }}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  href={
                                      "https://kyb-europe.com/rus/izobrazheniya-360/"
                                  }
                              >
                                  Перейти
                              </a>
                          ),
                          description: "3-D изображение запчасти",
                      },
                  ]
                : [];
        const attributes = initAttributes
            ? [
                  detailCodeAttribute,
                  supplierAttribute,
                  ...initAttributes,
                  ...supplierAdditionalAttributes,
              ].filter(Boolean)
            : [];

        const hasImages = Boolean(images && images.length);

        return (
            <Catcher>
                <Modal
                    title={<FormattedMessage id="partAttributes.title" />}
                    cancelText={<FormattedMessage id="cancel" />}
                    visible={showModal}
                    onOk={() => hideModal()}
                    onCancel={() => hideModal()}
                    footer={null}
                >
                    {images &&
                        attributes &&
                        (hasImages ? (
                            <Carousel
                                className={Styles.attributesCarousel}
                                autoplay
                            >
                                {images.map(({ pictureName, supplierId }) => (
                                    <div
                                        className={
                                            Styles.attributesCarouselSlide
                                        }
                                    >
                                        <img
                                            onError={e => {
                                                e.target.onerror = null;
                                                e.target.src = `${__TECDOC_IMAGES_URL__}/not_found.png`;
                                            }}
                                            src={`${__TECDOC_IMAGES_URL__}/${supplierId}/${pictureName}`}
                                        />
                                    </div>
                                ))}
                            </Carousel>
                        ) : null)}
                    <List
                        bordered
                        dataSource={attributes}
                        renderItem={item => (
                            <List.Item>
                                {item.description && item.value && (
                                    <div>
                                        <a>{item.description}</a>: {item.value}
                                    </div>
                                )}
                                {item.description &&
                                    !item.value &&
                                    item.description}
                                {!item.description && item.value}
                            </List.Item>
                        )}
                    />
                </Modal>
            </Catcher>
        );
    }
}
