import type { AppProps } from 'next/app'
import { Analytics } from '@vercel/analytics/react'
import '../globals.css'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Analytics />
      <Component {...pageProps} />
    </>
  )
}
