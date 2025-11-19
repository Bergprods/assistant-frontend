import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { I18nProvider } from './i18n'
import 'bootstrap/dist/css/bootstrap.min.css'
import './styles/tailwind.css'
import './styles/globals.css'

createRoot(document.getElementById('root')).render(
	<I18nProvider initial={navigator.language.startsWith('sv') ? 'sv' : 'sv'}>
		<App />
	</I18nProvider>
)
