import './index.css'

import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './main'

import { RootProvider, ScopeProvider } from 'react-scoped-hooks'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

ReactDOM.createRoot (document.getElementById('root')!).render(
  <React.StrictMode>
		<ScopeProvider>
			<QueryClientProvider client={queryClient}>
				<RootProvider>
					<App />
				</RootProvider>
			</QueryClientProvider>
		</ScopeProvider>
  </React.StrictMode>,
) 