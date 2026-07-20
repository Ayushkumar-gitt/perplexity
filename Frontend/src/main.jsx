import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './app/App.jsx'
import AppRouter from './AppRouter.jsx'
import { Provider } from 'react-redux'
import { store } from './app/app.store.js'

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <AppRouter>
      <App />
    </AppRouter>
  </Provider>
)
