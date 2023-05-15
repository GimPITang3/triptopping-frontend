import '@/styles/globals.css';
import type { AppProps } from 'next/app';

import Layout from '../components/Layout';
import PlanContextProvider from '@/components/PlanContextProvider';
import UserContextProvider from '@/components/UserContextProvider';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <UserContextProvider>
      <PlanContextProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </PlanContextProvider>
    </UserContextProvider>
  );
}
