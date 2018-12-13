import React from 'react';
import ReactDOM from 'react-dom';
import War from './components/War';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<War />, div);
  ReactDOM.unmountComponentAtNode(div);
});
