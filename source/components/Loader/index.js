// vendor
import React from 'react';

// own
import Styles from './styles.m.css';

const Loader = ({ loading }) =>
    loading ? (
        <div className={ Styles.loader }>
            <div className={ Styles.animation } />
        </div>
    ) : (
        <div>loading</div>
    );

export default Loader;
