// vendor
import React from 'react';
import { createPortal } from 'react-dom';

// own
import Styles from './styles.m.css';

const portal = document.getElementById('spinner');

const Spinner = ({ spin }) =>
    spin
        ? createPortal(
            <section className={ Styles.spinner }>
                <div className={ Styles.animation } />
            </section>,
            portal,
        )
        : null;

export default Spinner;
