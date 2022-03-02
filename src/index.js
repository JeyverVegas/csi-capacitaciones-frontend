import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import "react-toastify/dist/ReactToastify.css";
import "react-toggle/style.css";

import 'swiper/css/bundle';

import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import { ThemeContextProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { FeedBackProvider } from './context/FeedBackContext';

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeContextProvider>
        <AuthProvider>
          <FeedBackProvider>
            <App />
          </FeedBackProvider>
        </AuthProvider>
      </ThemeContextProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
