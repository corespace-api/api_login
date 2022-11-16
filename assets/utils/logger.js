const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

// get the environment variables
dotenv.config();

Reset = "\x1b[0m"
Bright = "\x1b[1m"
Dim = "\x1b[2m"
Underscore = "\x1b[4m"
Blink = "\x1b[5m"
Reverse = "\x1b[7m"
Hidden = "\x1b[8m"

FgBlack = "\x1b[30m"
FgRed = "\x1b[31m"
FgGreen = "\x1b[32m"
FgYellow = "\x1b[33m"
FgBlue = "\x1b[34m"
FgMagenta = "\x1b[35m"
FgCyan = "\x1b[36m"
FgWhite = "\x1b[37m"

BgBlack = "\x1b[40m"
BgRed = "\x1b[41m"
BgGreen = "\x1b[42m"
BgYellow = "\x1b[43m"
BgBlue = "\x1b[44m"
BgMagenta = "\x1b[45m"
BgCyan = "\x1b[46m"
BgWhite = "\x1b[47m"

// create a function to write the different logs (default, error) in append mode in the log files
const writeLog = (type, message, filePath) => {
  const logPath = filePath || process.env.LOG_PATH || path.join(__dirname, '../..', 'logs');
  const logFilePath = path.join(logPath, type);
  const timestamp = new Date().toISOString().split('T')[0];

  if (!fs.existsSync(logPath)) { fs.mkdirSync(logPath); }
  if (!fs.existsSync(`${logPath}/${type}`)) { fs.mkdirSync(`${logPath}/${type}`); }

  // write the log in the file
  fs.appendFileSync(path.join(logFilePath, `${timestamp}.log`), `${message}\r`);
};


class serviceLogger {
  constructor(serviceName, loggerStorage) {
    this.serviceName = serviceName;
    this.loggerStorage = loggerStorage;
    this.timestamp = new Date().toISOString();
  }

  log(message) {
    const logString = `[${this.timestamp}] ${this.serviceName}: ${message}`;
    console.log(logString);
    writeLog('default', logString);
  }

  request(message) {
    const logString = `[${this.timestamp}] ${this.serviceName}: ${message}`;
    console.log(`${FgMagenta}${logString}${Reset}`);
    writeLog('request', logString);
  }

  success(message) {
    const logString = `[${this.timestamp}] ${this.serviceName}: ${message}`;
    console.log(`${FgGreen}${logString}${Reset}`);
    writeLog('default', logString);
  }

  debug(message) {
    if (!process.env.LOG_LEVEL === 'debug') { return; }
    const logString = `[${this.timestamp}] ${this.serviceName}: ${message}`;
    console.debug(`${FgCyan}${logString}${Reset}`);
    writeLog('debug', logString);
  }

  info(message) {
    console.info(`${FgBlue}[${this.timestamp}] ${this.serviceName}: ${message}${Reset}`);
  }

  warn(message) {
    console.warn(`${FgYellow}[${this.timestamp}] ${this.serviceName}: ${message}${Reset}`);
  }

  error(message) {
    console.error(`${FgRed}[${this.timestamp}] ${this.serviceName}: ${message}${Reset}`);
  }

  custom(message, color) {
    console.log(`${color}[${this.timestamp}] ${this.serviceName}: ${message}${Reset}`);
  }
}

module.exports = serviceLogger;