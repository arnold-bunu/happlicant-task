'use client'; 
import type {ReactNode} from 'react';
import { ApolloProvider } from '@apollo/client/react';
import createApolloClient from '../lib/apollo-client';

const client = createApolloClient();
/**
 * This component wraps the ApolloProvider and initializes the Apollo Client.
 * It only renders the ApolloProvider if the session is available and the client is initialized.
 * If the session is not available, it renders the children without the ApolloProvider.
 * If the client is not initialized, it renders a loading skeleton.
 */

interface ApolloProviderWrapperProps {
  children: ReactNode;
}

export default function ApolloProviderWrapper({ children }: ApolloProviderWrapperProps) {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}