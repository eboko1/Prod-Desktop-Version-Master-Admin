// vendor
import React, { Component } from 'react';
import { injectIntl } from 'react-intl';
import _ from 'lodash';

// proj
import { PartAttributes, PartSuggestions } from 'components';

// own
import Styles from './styles.m.css';

@injectIntl
export default class TecDocModals extends Component {
    extractRelevantTecDocData() {
        const {
            crosses: allCrosses,
            suggestions: allSuggestions,
            attributes: allAttributes,
            selectedAttributes,
            selectedSuggestions,
            selectedCrosses,
        } = this.props;

        const {
            supplierId: attributesSupplierId,
            partCode: attributesPartCode,
        } = selectedAttributes || {};
        const {
            productId: suggestionsProductId,
            modificationId: suggestionsModificationId,
        } = selectedSuggestions || {};
        const {
            productId: crossesProductId,
            modificationId: crossesModificationId,
        } = selectedCrosses || {};

        const attributesEntity =
            attributesPartCode &&
            attributesSupplierId &&
            _.chain(allAttributes)
                .find({
                    partCode:   attributesPartCode,
                    supplierId: attributesSupplierId,
                })
                .value();

        const attributes = _.get(attributesEntity, 'attributes');
        const images = _.get(attributesEntity, 'images');

        const suggestions =
            suggestionsProductId &&
            suggestionsModificationId &&
            _.chain(allSuggestions)
                .find({
                    productId:      suggestionsProductId,
                    modificationId: suggestionsModificationId,
                })
                .get('suggestions')
                .value();

        const crosses =
            crossesProductId &&
            crossesModificationId &&
            _.chain(allCrosses)
                .find({
                    productId:      crossesProductId,
                    modificationId: crossesModificationId,
                })
                .get('crosses')
                .value();

        return { crosses, suggestions, attributes, images };
    }

    render() {
        const { selectedAttributes } = this.props;
        const { partCode: detailCode } = selectedAttributes || {};

        const {
            fetchPartAttributes,
            clearPartAttributes,
            clearSuggestionParts,
            clearCrossParts,
            onSelect,
            product,
            supplier,
        } = this.props;

        const {
            attributes,
            images,
            crosses,
            suggestions,
        } = this.extractRelevantTecDocData();

        return (
            <div>
                <PartAttributes
                    product={ product }
                    images={ images }
                    supplier={ supplier }
                    detailCode={ detailCode }
                    attributes={ attributes }
                    showModal={ Boolean(selectedAttributes) }
                    hideModal={ clearPartAttributes }
                />
                <PartSuggestions
                    fetchPartAttributes={ fetchPartAttributes }
                    onSelect={ onSelect }
                    suggestions={ suggestions }
                    showModal={ Boolean(suggestions) && !selectedAttributes }
                    hideModal={ clearSuggestionParts }
                />
                <PartSuggestions
                    fetchPartAttributes={ fetchPartAttributes }
                    onSelect={ onSelect }
                    suggestions={ crosses }
                    showModal={ Boolean(crosses) && !selectedAttributes }
                    hideModal={ clearCrossParts }
                />
            </div>
        );
    }
}
