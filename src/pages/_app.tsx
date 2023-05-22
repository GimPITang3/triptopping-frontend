import '@/styles/globals.css';
import type { AppProps } from 'next/app';

import Layout from '../components/Layout';
import PlanContextProvider from '@/components/PlanContextProvider';
import UserContextProvider from '@/components/UserContextProvider';
import { GoogleOAuthProvider } from '@react-oauth/google';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <GoogleOAuthProvider clientId="1028097431026-mmb0irmfn0jd7b47nsqpkgisdqoibbh2.apps.googleusercontent.com">
      <UserContextProvider>
        <PlanContextProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </PlanContextProvider>
      </UserContextProvider>
    </GoogleOAuthProvider>
  );
}
