type LogLevel = 'info' | 'warn' | 'error' | 'debug'

interface LogContext {
  userId?: string
  action?: string
  resource?: string
  [key: string]: any
}

interface LogEntry {
  timestamp: string
  level: LogLevel
  message: string
  context?: LogContext
  error?: {
    message: string
    stack?: string
  }
}

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
}

const CURRENT_LEVEL = process.env.LOG_LEVEL || 'info'

function shouldLog(level: LogLevel): boolean {
  return LOG_LEVELS[level] >= LOG_LEVELS[CURRENT_LEVEL as LogLevel]
}

function formatLog(entry: LogEntry): string {
  return JSON.stringify({
    ...entry,
    timestamp: entry.timestamp,
  })
}

export const logger = {
  info(message: string, context?: LogContext) {
    if (!shouldLog('info')) return
    console.info(formatLog({
      timestamp: new Date().toISOString(),
      level: 'info',
      message,
      context,
    }))
  },

  warn(message: string, context?: LogContext) {
    if (!shouldLog('warn')) return
    console.warn(formatLog({
      timestamp: new Date().toISOString(),
      level: 'warn',
      message,
      context,
    }))
  },

  error(message: string, error?: Error, context?: LogContext) {
    if (!shouldLog('error')) return
    console.error(formatLog({
      timestamp: new Date().toISOString(),
      level: 'error',
      message,
      error: error ? {
        message: error.message,
        stack: error.stack,
      } : undefined,
      context,
    }))
  },

  debug(message: string, context?: LogContext) {
    if (!shouldLog('debug')) return
    console.debug(formatLog({
      timestamp: new Date().toISOString(),
      level: 'debug',
      message,
      context,
    }))
  },

  // Audit log for sensitive actions
  audit(action: string, userId: string, details?: Record<string, any>) {
    console.info(formatLog({
      timestamp: new Date().toISOString(),
      level: 'info',
      message: `AUDIT: ${action}`,
      context: { userId, ...details },
    }))
  },
}
