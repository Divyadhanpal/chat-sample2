import '@/styles/globals.css'

export default function App({ Component, pageProps }) {
  return <div className="bg-gray-600"><Component {...pageProps} /></div>
}
