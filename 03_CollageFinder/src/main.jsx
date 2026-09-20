import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { HeroUIProvider } from '@heroui/system'
import store from './store'
import App from './App.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <HeroUIProvider>
          <App />
        </HeroUIProvider>
      </BrowserRouter>
    </Provider>
  </StrictMode>,
)