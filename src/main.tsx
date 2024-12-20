import React from 'react';
import {createRoot} from 'react-dom/client';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import App from './App';
import {MantineProvider} from "@mantine/core";
import "@mantine/core/styles.css";
import { theme } from "./theme";

const client = new ApolloClient({
    uri: 'http://localhost:5000/graphql',
    cache: new InMemoryCache()
});

createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <ApolloProvider client={client}>
            <MantineProvider defaultColorScheme="dark" theme={theme}>
            <App />
            </MantineProvider>
        </ApolloProvider>
    </React.StrictMode>
)
