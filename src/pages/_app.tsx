import type { AppProps } from 'next/app';
import '@/styles/global.css';

// eslint-disable-next-line react/jsx-props-no-spreading
const App = ({ Component, pageProps }: AppProps) => <Component {...pageProps} />;

export default App;
