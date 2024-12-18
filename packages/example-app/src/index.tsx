import './index.css'

import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './product'

import { RootProvider } from '@reconjs/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

ReactDOM.createRoot (document.getElementById('root')!).render(
	<StrictMode>
		<QueryClientProvider client={queryClient}>
			<RootProvider>
				<App />
			</RootProvider>
		</QueryClientProvider>
	</StrictMode>
)