import { Logger } from '../types';

class ConsoleLogger implements Logger {
    private formatMessage(level: string, message: string, data?: any): string {
        const timestamp = new Date().toISOString();
        const dataString = data ? JSON.stringify(data, null, 2) : '';
        return `[${timestamp}] [${level}] ${message} ${dataString}`;
    }

    info(message: string, data?: any): void {
        console.info(this.formatMessage('INFO', message, data));
    }

    error(message: string, error: any): void {
        console.error(this.formatMessage('ERROR', message, error));
    }

    warn(message: string, data?: any): void {
        console.warn(this.formatMessage('WARN', message, data));
    }

    debug(message: string, data?: any): void {
        console.debug(this.formatMessage('DEBUG', message, data));
    }
}

export const logger = new ConsoleLogger(); 