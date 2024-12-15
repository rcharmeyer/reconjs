import './index.css'

import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './product'

import { RootProvider } from 'react-scoped-hooks'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

RootProvider.attach (StrictMode)
RootProvider.attach (({ children }) => {
	return (
		<QueryClientProvider client={queryClient}>
			{children}
		</QueryClientProvider>
	)
})

ReactDOM.createRoot (document.getElementById('root')!).render(
	<RootProvider>
		<App />
	</RootProvider>
)