import '@/styles/globals.css';
import type { AppProps } from 'next/app';

import Layout from '../components/Layout';
import PlanContextProvider from '@/components/PlanContextProvider';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <PlanContextProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </PlanContextProvider>
  );
}
