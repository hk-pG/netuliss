import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import './game/Game'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
    <div id="game"></div>
  </React.StrictMode>,
)
export {}
