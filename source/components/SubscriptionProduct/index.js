// vendor
import React from 'react';
import styled from 'styled-components';
import { FormattedMessage } from 'react-intl';

// proj
import { Numeral } from 'commons';
import { StyledButton } from 'commons/_uikit';
import { GridCard } from 'components/Grid/GridCard';

export const SubscriptionProduct = props => {
    const {
        name,
        price,
        description,
        // rolesPackageId,
        // suggestionGroupId,
    } = props;
    // name={name}
    // price={price}
    // description={description}
    // rolesPackageId={rolesPackageId}

    const createMarkup = () => ({ __html: description });

    // eslint-disable eslint(react/no-danger)
    return (
        <GridCard>
            <ProductTitleWrapper>
                <ProductTitle>{ name }</ProductTitle>
            </ProductTitleWrapper>
            <ProductDescription dangerouslySetInnerHTML={ createMarkup() } />
            <ProductFooter>
                <ShowMore>
                    <FormattedMessage id='subscription.details' />
                </ShowMore>
                <ProductPrice>
                    <Numeral currency={ 'грн.' }>{ price }</Numeral> /{ ' ' }
                    <FormattedMessage id='subscription.monthly' />
                </ProductPrice>
                <PurchaseButton type='secondary' onClick={ props.setModal }>
                    <FormattedMessage id='subscription.purchase' />
                </PurchaseButton>
            </ProductFooter>
        </GridCard>
    );
};

const ProductTitleWrapper = styled.div`
    background: var(--primary);
    padding: 4px;
    margin: 4px;
    display: flex;
    justify-content: center;
`;

const ProductTitle = styled.h2`
    color: white;
    font-size: 24px;
    font-weight: bold;
    width: 200px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: center;
`;

const ProductDescription = styled.div`
    flex: 1 1 100%;
    max-height: 380px;
    overflow-y: scroll;
    margin: 16px 0;
    font-size: 16px;

    h2,
    h3 {
        font-size: 18px;
        font-weight: bold;
    }

    ol,
    ul {
        margin: 4px 32px;
        text-align: left;
    }

    ol {
        list-style-type: decimal;
    }

    ul {
        list-style-type: disc;
    }
`;

const ShowMore = styled.div`
    color: var(--link);
    text-decoration: dashed;
    cursor: pointer;

    &:hover {
        color: var(--primary);
        text-decoration: underline;
    }
`;

const ProductPrice = styled.div`
    font-size: 24px;
    font-weight: bold;
    background: var(--static);
    margin: 0 8px;
`;

const PurchaseButton = styled(StyledButton)`
    width: 80%;
    margin: 16px auto;
    font-size: 18px;
`;

const ProductFooter = styled.div`
    justify-self: flex-end;
`;
