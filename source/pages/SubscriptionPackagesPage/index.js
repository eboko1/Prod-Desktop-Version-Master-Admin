// vendor
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { BackTop } from 'antd';
import { HashLink } from 'react-router-hash-link';

// proj
import { Layout } from 'commons';
import { SubscriptionProductsContainer } from 'containers';
import book from 'routes/book';
// import BackTopComp from './test.js';

// own
// const { Link } = Anchor;

export default class SubscriptionPackagesPage extends Component {
    // _scrollTo = id =>
    //     document.getElementById(id).scrollIntoView({
    //         behavior: 'smooth',
    //         block:    'start',
    //     });

    constructor(props) {
        super(props);
        this.contentRef = React.createRef();
    }

    render() {
        return (
            <>
                <Layout
                    title={ <FormattedMessage id='navigation.subscription' /> }
                    paper={ false }

                    // description={ <FormattedMessage id='chart-page.description' /> }
                >
                    <div onClick={ () => this._scrollTo('#pro') }>pro</div>
                    <div onClick={ () => this._scrollTo('#advertise') }>adv</div>
                    { /* <Anchor affix={ false }>
                    <Link href='#pro' title='Pro' />
                    <Link href='#advertise' title='Advertise' />
                </Anchor> */ }
                    { /* <a href='#pro'>Pro</a>
                <a href='#advertise'>advertise</a> */ }
                    { /* <HashLink
                    to={ `${book.subscriptionPackagesPage}#pro` }
                    scroll={ el =>
                        el.scrollIntoView({ behavior: 'instant', block: 'end' })
                    }
                >
                    Link to Hash Fragment
                </HashLink>
                <HashLink
                    to={ '#advertise' }
                    // to={ `${book.subscriptionPackagesPage}#advertise` }
                    scroll={ el =>
                        el.scrollIntoView({ behavior: 'instant', block: 'end' })
                    }
                >
                    Link to Hash Fragment
                </HashLink> */ }
                    <SubscriptionProductsContainer />
                </Layout>
            </>
        );
    }
}
