import type { NextConfig } from 'next'

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
}

export default nextConfig
