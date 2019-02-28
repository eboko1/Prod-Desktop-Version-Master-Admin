// vendor
import React from 'react';

// own
import Styles from './styles.m.css';

const Loader = ({ loading, background = 'white' }) =>
    loading ? (
        <div className={ Styles.loader } style={ { background } }>
            <div className={ Styles.animation } />
        </div>
    ) : null;

export default Loader;
