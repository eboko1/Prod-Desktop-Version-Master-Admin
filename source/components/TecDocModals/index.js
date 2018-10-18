// vendor
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import _ from 'lodash';

// proj
import { PartAttributes, PartSuggestions } from 'components';
import {
    fetchPartAttributes,
    fetchSuggestionParts,
    fetchCrossParts,
    clearPartAttributes,
    clearSuggestionParts,
    clearCrossParts,
} from 'core/tecDocActions/duck';

// own
import Styles from './styles.m.css';

const mapDispatchToProps = {
    fetchPartAttributes,
    fetchSuggestionParts,
    fetchCrossParts,
    clearPartAttributes,
    clearSuggestionParts,
    clearCrossParts,
};

const mapStateToProps = state => ({
    suggestions:         state.tecDocActions.suggestions,
    crosses:             state.tecDocActions.crosses,
    attributes:          state.tecDocActions.attributes,
    selectedAttributes:  state.tecDocActions.selectedAttributes,
    selectedSuggestions: state.tecDocActions.selectedSuggestions,
    selectedCrosses:     state.tecDocActions.selectedCrosses,
});

@injectIntl
@connect(
    mapStateToProps,
    mapDispatchToProps,
)
export default class TecDocModalsContainer extends Component {
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

        const attributes =
            attributesPartCode &&
            attributesSupplierId &&
            _.chain(allAttributes)
                .find({
                    partCode:   attributesPartCode,
                    supplierId: attributesSupplierId,
                })
                .get('attributes')
                .value();

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

        return { crosses, suggestions, attributes };
    }

    render() {
        const { selectedAttributes } = this.props;

        const {
            fetchPartAttributes,
            clearPartAttributes,
            clearSuggestionParts,
            clearCrossParts,
        } = this.props;

        const {
            attributes,
            crosses,
            suggestions,
        } = this.extractRelevantTecDocData();

        return (
            <div>
                <PartAttributes
                    attributes={ attributes }
                    showModal={ Boolean(attributes) }
                    hideModal={ clearPartAttributes }
                />
                <PartSuggestions
                    fetchPartAttributes={ fetchPartAttributes }
                    suggestions={ suggestions }
                    showModal={ Boolean(suggestions) && !selectedAttributes }
                    hideModal={ clearSuggestionParts }
                />
                <PartSuggestions
                    fetchPartAttributes={ fetchPartAttributes }
                    suggestions={ crosses }
                    showModal={ Boolean(crosses) && !selectedAttributes }
                    hideModal={ clearCrossParts }
                />
            </div>
        );
    }
}
