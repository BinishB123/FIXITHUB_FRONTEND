// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { Provider } from 'react-redux'
import store from './Redux/store/store.tsx'
import { SocketProvider } from './context/socketioContext.tsx'


createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <SocketProvider>
    <App />
    </SocketProvider>
  </Provider>,
)
