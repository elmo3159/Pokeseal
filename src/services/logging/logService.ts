/**
 * ロギングサービス
 * 構造化されたログ出力とエラートラッキングを提供
 */

// ログレベル
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  FATAL = 4,
}

// ログレベル名
const LOG_LEVEL_NAMES: Record<LogLevel, string> = {
  [LogLevel.DEBUG]: 'DEBUG',
  [LogLevel.INFO]: 'INFO',
  [LogLevel.WARN]: 'WARN',
  [LogLevel.ERROR]: 'ERROR',
  [LogLevel.FATAL]: 'FATAL',
}

// ログエントリの型
export interface LogEntry {
  level: LogLevel
  timestamp: string
  category: string
  message: string
  data?: Record<string, unknown>
  error?: Error
  userId?: string
  sessionId?: string
}

// ログハンドラーの型
export type LogHandler = (entry: LogEntry) => void

// ロガー設定
interface LoggerConfig {
  minLevel: LogLevel
  enableConsole: boolean
  handlers: LogHandler[]
  sessionId?: string
  userId?: string
}

// デフォルト設定
const DEFAULT_CONFIG: LoggerConfig = {
  minLevel: process.env.NODE_ENV === 'production' ? LogLevel.INFO : LogLevel.DEBUG,
  enableConsole: true,
  handlers: [],
}

// グローバル設定
let globalConfig: LoggerConfig = { ...DEFAULT_CONFIG }

// セッションID生成
function generateSessionId(): string {
  return `sess_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
}

// 現在のセッションID
let currentSessionId: string = typeof window !== 'undefined' ? generateSessionId() : 'server'

/**
 * ロガークラス
 */
class Logger {
  private category: string
  private config: LoggerConfig

  constructor(category: string, config?: Partial<LoggerConfig>) {
    this.category = category
    this.config = { ...globalConfig, ...config }
  }

  private log(level: LogLevel, message: string, data?: Record<string, unknown>, error?: Error): void {
    if (level < this.config.minLevel) {
      return
    }

    const entry: LogEntry = {
      level,
      timestamp: new Date().toISOString(),
      category: this.category,
      message,
      data,
      error,
      userId: this.config.userId,
      sessionId: currentSessionId,
    }

    // コンソール出力
    if (this.config.enableConsole) {
      this.logToConsole(entry)
    }

    // カスタムハンドラー
    for (const handler of this.config.handlers) {
      try {
        handler(entry)
      } catch (e) {
        console.error('[Logger] Handler error:', e)
      }
    }
  }

  private logToConsole(entry: LogEntry): void {
    const prefix = `[${entry.timestamp}] [${LOG_LEVEL_NAMES[entry.level]}] [${entry.category}]`

    const args: unknown[] = [prefix, entry.message]
    if (entry.data) {
      args.push(entry.data)
    }

    switch (entry.level) {
      case LogLevel.DEBUG:
        console.debug(...args)
        break
      case LogLevel.INFO:
        console.info(...args)
        break
      case LogLevel.WARN:
        console.warn(...args)
        break
      case LogLevel.ERROR:
      case LogLevel.FATAL:
        console.error(...args)
        if (entry.error) {
          console.error(entry.error)
        }
        break
    }
  }

  debug(message: string, data?: Record<string, unknown>): void {
    this.log(LogLevel.DEBUG, message, data)
  }

  info(message: string, data?: Record<string, unknown>): void {
    this.log(LogLevel.INFO, message, data)
  }

  warn(message: string, data?: Record<string, unknown>): void {
    this.log(LogLevel.WARN, message, data)
  }

  error(message: string, error?: Error | unknown, data?: Record<string, unknown>): void {
    const err = error instanceof Error ? error : undefined
    const extraData = error instanceof Error ? data : { ...data, error }
    this.log(LogLevel.ERROR, message, extraData, err)
  }

  fatal(message: string, error?: Error, data?: Record<string, unknown>): void {
    this.log(LogLevel.FATAL, message, data, error)
  }

  /**
   * パフォーマンス計測
   */
  time(label: string): () => void {
    const start = performance.now()
    return () => {
      const duration = performance.now() - start
      this.debug(`${label} completed`, { durationMs: Math.round(duration * 100) / 100 })
    }
  }
}

/**
 * ロガーファクトリー
 */
export function createLogger(category: string): Logger {
  return new Logger(category)
}

/**
 * グローバル設定を更新
 */
export function configureLogger(config: Partial<LoggerConfig>): void {
  globalConfig = { ...globalConfig, ...config }
}

/**
 * ユーザーIDを設定
 */
export function setLogUserId(userId: string | undefined): void {
  globalConfig.userId = userId
}

/**
 * ログハンドラーを追加
 */
export function addLogHandler(handler: LogHandler): void {
  globalConfig.handlers.push(handler)
}

/**
 * セッションIDをリセット
 */
export function resetLogSession(): void {
  currentSessionId = generateSessionId()
}

// 事前定義されたロガー
export const appLogger = createLogger('App')
export const authLogger = createLogger('Auth')
export const tradeLogger = createLogger('Trade')
export const gachaLogger = createLogger('Gacha')
export const networkLogger = createLogger('Network')
export const uiLogger = createLogger('UI')

export default Logger
