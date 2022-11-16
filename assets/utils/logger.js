const fs = require('fs');
const path = require('path');

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

class serviceLogger {
  constructor(serviceName, loggerStorage) {
    this.serviceName = serviceName;
    this.loggerStorage = loggerStorage;
    this.timestamp = new Date().toISOString();
  }

  log(message) {
    console.log(`[${this.timestamp}] ${this.serviceName}: ${message}`);
  }

  request(message) {
    console.log(`${FgMagenta}[${this.timestamp}] ${this.serviceName}: ${message}${Reset}`);
  }

  success(message) {
    console.log(`${FgGreen}[${this.timestamp}] ${this.serviceName}: ${message}${Reset}`);
  }

  debug(message) {
    console.debug(`${FgCyan}[${this.timestamp}] ${this.serviceName}: ${message}${Reset}`);
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