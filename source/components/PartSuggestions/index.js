// vendor
import React, { Component } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Modal, Table, Button, Popover } from 'antd';
import _ from 'lodash';

// proj
import { Catcher } from 'commons';
import { images } from 'utils';

// own
import Styles from './styles.m.css';

@injectIntl
export default class PartSuggestions extends Component {
    render() {
        const {
            suggestions,
            hideModal,
            showModal,
            fetchPartAttributes,
            onSelect,
        } = this.props;

        this.columns = [
            {
                title:  <FormattedMessage id='partsSuggestions.detailCode' />,
                key:    'photo',
                width:  '10%',
                render: suggestion => {
                    const image = _.get(suggestion, 'images[0]');

                    return image ? (
                        <img
                            style={ { cursor: 'pointer' } }
                            onClick={ () =>
                                fetchPartAttributes(
                                    suggestion.partNumber,
                                    suggestion.supplierId,
                                )
                            }
                            width={ 75 }
                            src={ `${__TECDOC_IMAGES_URL__}/${
                                image.supplierId
                            }/${image.pictureName}` }
                        />
                    ) : (
                        <div
                            style={ { cursor: 'pointer' } }
                            onClick={ () =>
                                fetchPartAttributes(
                                    suggestion.partNumber,
                                    suggestion.supplierId,
                                )
                            }
                        >
                            No photo
                        </div>
                    );
                },
            },
            {
                title:     <FormattedMessage id='partsSuggestions.detailCode' />,
                dataIndex: 'partNumber',
                width:     '15%',
            },
            {
                title:     <FormattedMessage id='partsSuggestions.supplierName' />,
                dataIndex: 'supplierName',
                width:     '15%',
                onFilter:  (value, record) => record.supplierName === value,
                filters:   _(suggestions)
                    .map('supplierName')
                    .uniq()
                    .map(name => ({
                        text:  name,
                        value: name,
                    }))
                    .value(),
            },
            {
                title:     <FormattedMessage id='partsSuggestions.description' />,
                dataIndex: 'description',
                width:     '20%',
            },
            {
                key:    'attributes',
                width:  '25%',
                render: suggestion => (
                    <div>
                        { _.get(suggestion, 'attributes') && (
                            <Popover
                                getPopupContainer={ trigger =>
                                    trigger.parentNode
                                }
                                content={ _.map(
                                    suggestion.attributes,
                                    ({ value, description }) => (
                                        <div>
                                            <p>
                                                <a>{ description }</a>: { value }
                                            </p>
                                        </div>
                                    ),
                                ) }
                            >
                                <div
                                    key={
                                        suggestion.partNumber +
                                        '-' +
                                        suggestion.supplierName
                                    }
                                    className={ Styles.attributesText }
                                >
                                    { _.upperFirst(
                                        _.map(suggestion.attributes, 'value')
                                            .map(str => str.toLocaleLowerCase())
                                            .join(', '),
                                    ) }
                                </div>
                            </Popover>
                        ) }
                    </div>
                ),
            },
            {
                key:    'actions',
                width:  '10%',
                render: suggestion => (
                    <div className={ Styles.suggestionContainer }>
                        <Button
                            className={ Styles.suggestionItem }
                            icon='enter'
                            onClick={ () => {
                                onSelect(
                                    suggestion.brandId,
                                    suggestion.partNumber,
                                );
                                hideModal();
                            } }
                        >
                            <FormattedMessage id='partsSuggestions.apply' />
                        </Button>
                    </div>
                ),
            },
            {
                key:    'ecat',
                width:  '10%',
                render: suggestion => (
                    <a
                        target='_blank'
                        rel='noopener noreferrer'
                        href={ `https://maxi.ecat.ua/products/search/${
                            suggestion.partNumber
                        }/type:article+customerNo:none` }
                    >
                        <img
                            className={ Styles.logo }
                            src={ images.ecatLogo }
                            alt='logo'
                        />
                    </a>
                ),
            },
        ];

        return (
            <Catcher>
                <Modal
                    width={ '65%' }
                    title={ <FormattedMessage id='partsSuggestions.title' /> }
                    cancelText={ <FormattedMessage id='cancel' /> }
                    visible={ showModal }
                    footer={ null }
                    onCancel={ () => hideModal() }
                >
                    { suggestions && (
                        <Table
                            pagination={ { pageSize: 6 } }
                            dataSource={ suggestions }
                            columns={ this.columns }
                        />
                    ) }
                </Modal>
            </Catcher>
        );
    }
}
