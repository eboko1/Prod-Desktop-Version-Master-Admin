// core
import React, { Component } from 'react';
import { Icon } from 'antd';

// proj
import { images } from 'utils';

// own
import Styles from './styles.m.css';
import { FormattedMessage } from 'react-intl';

class Footer extends Component {
    static defaultProps = {
        startYear:   2015,
        currentYear: new Date().getFullYear(),
    };

    render() {
        const { startYear, currentYear, collapsed } = this.props;

        return (
            <footer
                className={ `${Styles.footer} ${collapsed &&
                    Styles.footerCollapsed}` }
            >
                <div className={ Styles.contacts }>
                    <FormattedMessage id='footer.support' />
                    :&nbsp;
                    <a href='tel:380442994556'>+38(044)299-45-56</a>
                    &nbsp;
                    <FormattedMessage id='or' />
                    &nbsp;
                    <a href='mailto:support@carbook.pro'>support@carbook.pro</a>
                    &nbsp;
                </div>
                <div className={ Styles.copyright }>
                    <img
                        className={ Styles.logo }
                        src={ images.carbookLogo }
                        alt='logo'
                    />
                    <div>
                        { `${startYear} - ${currentYear} ` }
                        <Icon type='trademark' />
                    </div>
                </div>
            </footer>
        );
    }
}

export default Footer;
