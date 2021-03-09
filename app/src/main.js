import React from 'react';
import ReactDom from 'react-dom';
import Editor from '../src/components/editor';
import ErrorBoundry from './components/errorBoundry';


ReactDom.render(
    <ErrorBoundry>
        <Editor/>
    </ErrorBoundry>
    , document.getElementById('root'));
