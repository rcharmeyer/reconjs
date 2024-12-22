import './index.css'

import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './product'

import { RootProvider } from '@reconjs/react'

ReactDOM.createRoot (document.getElementById('root')!).render(
	<StrictMode>
		<RootProvider>
			<App />
		</RootProvider>
	</StrictMode>
)