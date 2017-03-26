import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import App from './containers/app';
import store from './stores/store';

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.querySelector('.root')
);
