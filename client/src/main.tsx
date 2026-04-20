import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client'
import { ThemeProvider, GlobalStyles } from './styles/theme'
import App from './App'

const client = new ApolloClient({
  uri: 'http://localhost:4000',
  cache: new InMemoryCache(),
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ApolloProvider client={client}>
      <BrowserRouter>
        <ThemeProvider>
          <GlobalStyles />
          <App />
        </ThemeProvider>
      </BrowserRouter>
    </ApolloProvider>
  </StrictMode>
)
