import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {ReactFlowProvider} from "@xyflow/react";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ReactFlowProvider>
      <div className="w-screen h-screen flex">
        <App />
      </div>
    </ReactFlowProvider>
  </StrictMode>,
)
