// Core
import React from 'react';
import { createPortal } from 'react-dom';

// Instruments
import Styles from './styles.m.css';

const portal = document.getElementById('spinner');
// const spinnerDiv = document.createElement('div');
// const spinner = spinnerDiv.setAttribute('id', 'spinner');
// const portal = spinner.getElementById('id', 'spinner');

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
