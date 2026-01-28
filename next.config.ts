import type { NextConfig } from 'next'

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

const nextConfig: NextConfig = {
  // モバイルアプリ用の静的エクスポート設定
  output: 'export',

  // 画像最適化（静的エクスポート用）
  images: {
    unoptimized: true,
  },

  // TypeScript厳格モード
  typescript: {
    ignoreBuildErrors: false,
  },

  // 実験的機能
  experimental: {
    // 最適化されたパッケージインポート
    optimizePackageImports: [
      'lucide-react',
      'framer-motion',
      '@floating-ui/react',
    ],
  },
}

export default withBundleAnalyzer(nextConfig)
