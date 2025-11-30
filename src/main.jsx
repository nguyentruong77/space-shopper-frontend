import '@/assets/tailwind.css'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { RouterProvider } from 'react-router-dom'
import App from './App.jsx'
import { router } from './routers/index.jsx'
import { store } from './stories/index.js'

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <RouterProvider router={router} />
    <App />
  </Provider>
)
