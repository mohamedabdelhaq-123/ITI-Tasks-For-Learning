import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {BrowserRouter} from 'react-router-dom'
import './index.css'
import store from './store/store.js'
import App from './App.jsx'
import { Provider } from 'react-redux'
import LangProvider from './context/LangContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <Provider store={store}>
      <LangProvider>
        <App />
      </LangProvider>
    </Provider>
    </BrowserRouter>
  </StrictMode>,
)

// strict modej => run comp. twice to catch bugs early
// BrowserRouter => connect to html5 history api
  // 1. prevent refresh while routing
  // 2. modify the url depending on 
  // wrap the app not wrapp the data in app => what if app itself need feature from react-router-dom

// need to provide the store so any component need it find it

// everychild and subchild is wrapped and can use the context => langProvider