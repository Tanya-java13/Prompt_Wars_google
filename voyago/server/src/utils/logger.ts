type Severity = 'DEFAULT' | 'DEBUG' | 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL';

interface LogEntry {
  severity: Severity;
  message: string;
  [key: string]: unknown;
}

const isProd = process.env.NODE_ENV === 'production';

function log(severity: Severity, message: string, meta: Record<string, unknown> = {}): void {
  if (isProd) {
    // Google Cloud structured logging format (parsed by Cloud Logging agent)
    const entry: LogEntry = { severity, message, ...meta, timestamp: new Date().toISOString() };
    console.log(JSON.stringify(entry));
  } else {
    const prefix = `[${severity}]`;
    const extras = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
    console.log(`${prefix} ${message}${extras}`);
  }
}

export const logger = {
  info:  (msg: string, meta?: Record<string, unknown>) => log('INFO', msg, meta),
  warn:  (msg: string, meta?: Record<string, unknown>) => log('WARNING', msg, meta),
  error: (msg: string, meta?: Record<string, unknown>) => log('ERROR', msg, meta),
  debug: (msg: string, meta?: Record<string, unknown>) => log('DEBUG', msg, meta),
};
