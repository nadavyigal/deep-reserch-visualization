const isProd = process.env.NODE_ENV === 'production';

const logger = {
  info: (...args: any[]) => {
    if (!isProd) console.log(...args);
  },
  warn: (...args: any[]) => {
    if (!isProd) console.warn(...args);
  },
  error: (...args: any[]) => {
    console.error(...args);
  }
};

export default logger;
