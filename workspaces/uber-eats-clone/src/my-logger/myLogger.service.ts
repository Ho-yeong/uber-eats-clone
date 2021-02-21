import { LoggerService } from '@nestjs/common';
import { logFileCheck } from './logger-check';

export class MyLoggerService implements LoggerService {
  log(message: string) {
    /* your implementation */
    if (message) {
      logFileCheck(message);
    }
  }
  error(message: string, trace: string) {
    /* your implementation */
  }
  warn(message: string) {
    /* your implementation */
  }
  debug(message: string) {
    /* your implementation */
  }
  verbose(message: string) {
    /* your implementation */
  }
}
