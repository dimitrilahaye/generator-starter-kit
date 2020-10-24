import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
<%_ if (sentry) {  _%>
import * as Sentry from "@sentry/react";
<%_ } _%>
import * as serviceWorker from './serviceWorker';

<%_ if (sentry) {  _%>
Sentry.init({ dsn: "https://examplePublicKey@o0.ingest.sentry.io/0" });
<%_ } _%>

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
