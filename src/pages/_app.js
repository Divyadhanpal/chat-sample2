import "@/styles/globals.css";
import "@/styles/app.css";
import { Provider } from 'react-redux';
import store from '../redux/store.js';

export default function App({ Component, pageProps }) {
  return (
    <Provider store={store}>
        <div><Component {...pageProps} /></div>
    </Provider>
);
}
