import React from 'react';
import ReactDOM from 'react-dom';
import './styles/index.css';
import War from './components/War';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<War />, document.getElementById('root'));
registerServiceWorker();
