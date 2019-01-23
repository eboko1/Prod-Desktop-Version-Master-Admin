// vendor
import React from 'react';
import { render } from 'react-dom';

// proj
import('./theme/init.css'); // only chunk (split-point)
import './theme/antd/antd.less';
import './store/nprogress'; // whole file

// own
import App from './App.js';

render(<App />, document.getElementById('app'));
