import type { Metadata, Viewport } from 'next'
import './globals.css'
import { Providers } from './providers'

export const metadata: Metadata = {
  title: 'ポケシル - ポケットシールちょう',
  description: 'デジタルシール帳でシールを集めて、貼って、交換しよう！',
  keywords: ['シール', 'シール帳', 'コレクション', 'ガチャ', '交換'],
  authors: [{ name: 'Pokeseal Team' }],
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'ポケシル',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#A78BFA',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ja">
      <head>
        {/* Google Fonts - 丸みのある可愛らしいフォント */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Kosugi+Maru&family=M+PLUS+Rounded+1c:wght@300;400;500;700;800&family=Zen+Maru+Gothic:wght@300;400;500;700&display=swap"
          rel="stylesheet"
        />
        {/* PWA: Apple Touch Icon */}
        <link rel="apple-touch-icon" href="/stickers/ポフン/ポフン_1.png" />
        {/* PWA: Splash Screen Color */}
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className="antialiased" suppressHydrationWarning>
        <Providers>
          {children}
        </Providers>
        {/* Service Worker Registration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').then(
                    function(registration) {
                      console.log('ServiceWorker registration successful');
                    },
                    function(err) {
                      console.log('ServiceWorker registration failed: ', err);
                    }
                  );
                });
              }
            `,
          }}
        />
      </body>
    </html>
  )
}
