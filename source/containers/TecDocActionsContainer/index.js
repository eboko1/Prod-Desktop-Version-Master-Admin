// vendor
import React, { Component } from "react";
import { connect } from "react-redux";
import { injectIntl } from "react-intl";
import { Button } from "antd";
import _ from "lodash";

// proj
import { Catcher, StyledButton } from "commons";
import { TecDocModals } from "components";
import {
    fetchPartAttributes,
    fetchSuggestionParts,
    fetchCrossParts,
    clearPartAttributes,
    clearSuggestionParts,
    clearCrossParts,
    setOperationIndex,
} from "core/tecDocActions/duck";

// own
import Styles from "./styles.m.css";

const mapDispatchToProps = {
    fetchPartAttributes,
    fetchSuggestionParts,
    fetchCrossParts,
    clearPartAttributes,
    clearSuggestionParts,
    clearCrossParts,
    setOperationIndex,
};

const mapStateToProps = state => ({
    suggestions: state.tecDocActions.suggestions,
    crosses: state.tecDocActions.crosses,
    attributes: state.tecDocActions.attributes,
    selectedAttributes: state.tecDocActions.selectedAttributes,
    selectedSuggestions: state.tecDocActions.selectedSuggestions,
    selectedCrosses: state.tecDocActions.selectedCrosses,
    operationIndex: state.tecDocActions.operationIndex,
});

@injectIntl
@connect(mapStateToProps, mapDispatchToProps)
export default class TecDocActionsContainer extends Component {
    getSupplier() {
        const { selectedAttributes, brands, brandId } = this.props;
        const { supplierId } = selectedAttributes || {};

        return supplierId || brandId
            ? _.chain(brands)
                  .find(supplierId ? { supplierId } : { brandId })
                  .value()
            : null;
    }

    getProduct() {
        const { detailId, details } = this.props;

        return detailId
            ? _.chain(details)
                  .find({ detailId })
                  .value()
            : null;
    }

    render() {
        const {
            detailCode,
            modificationId,
            index,
            operationIndex,
        } = this.props;

        const product = this.getProduct();
        const supplier = this.getSupplier();
        const productId = _.get(product, "productId");
        const supplierId = _.get(supplier, "supplierId");

        const {
            fetchPartAttributes,
            fetchSuggestionParts,
            fetchCrossParts,
            setOperationIndex,
        } = this.props;

        const areAttributesForbidden = !detailCode || !supplierId;
        const areSuggestionsForbidden = !productId || !modificationId;
        const areCrossesForbidden = !productId || !modificationId;

        return (
            <Catcher>
                {index === operationIndex && (
                    <TecDocModals
                        product={product}
                        supplier={supplier}
                        {...this.props}
                    />
                )}
                <div className={Styles.actionContainer}>
                    <Button
                        className={Styles.actionItem}
                        disabled={areAttributesForbidden}
                        icon="check"
                        onClick={() => {
                            setOperationIndex(index);
                            fetchPartAttributes(detailCode, supplierId);
                        }}
                    />
                    <StyledButton
                        className={Styles.actionItem}
                        disabled={areSuggestionsForbidden}
                        icon="question"
                        type="secondary"
                        onClick={() => {
                            setOperationIndex(index);
                            fetchSuggestionParts(productId, modificationId);
                        }}
                    />
                    <StyledButton
                        className={Styles.actionItem}
                        disabled={areCrossesForbidden}
                        type="warning"
                        icon="swap"
                        onClick={() => {
                            setOperationIndex(index);
                            fetchCrossParts(productId, modificationId);
                        }}
                    />
                </div>
            </Catcher>
        );
    }
}
