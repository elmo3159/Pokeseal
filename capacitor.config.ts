import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'com.pokeseal.app',
  appName: 'ポケシル',
  webDir: 'out',

  // サーバー設定
  server: {
    // 本番ビルド時はローカルアセットを使用
    androidScheme: 'https',
    iosScheme: 'https',
  },

  // iOS固有の設定
  ios: {
    contentInset: 'automatic',
    preferredContentMode: 'mobile',
    limitsNavigationsToAppBoundDomains: true,
    backgroundColor: '#FFF5F8', // アプリの背景色
  },

  // Android固有の設定
  android: {
    backgroundColor: '#FFF5F8',
    allowMixedContent: false,
    captureInput: true,
    webContentsDebuggingEnabled: false, // 本番ではfalse
  },

  // プラグイン設定
  plugins: {
    // スプラッシュスクリーン設定
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: '#FFF5F8',
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true,
    },
    // ステータスバー設定
    StatusBar: {
      style: 'LIGHT',
      backgroundColor: '#6B3FA0', // Primary color
    },
    // キーボード設定
    Keyboard: {
      resize: 'body',
      resizeOnFullScreen: true,
    },
  },
}

export default config
