import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

interface ErrorLog {
    timestamp: string;
    level: 'info' | 'warn' | 'error';
    message: string;
    stack?: string;
    metadata?: any;
}

class Logger {
    private static instance: Logger;
    private maxLogs = 100;
    private storageKey = 'app_error_logs';

    private constructor() { }

    static getInstance(): Logger {
        if (!Logger.instance) {
            Logger.instance = new Logger();
        }
        return Logger.instance;
    }

    async log(level: 'info' | 'warn' | 'error', message: string, metadata?: any, stack?: string) {
        const logEntry: ErrorLog = {
            timestamp: new Date().toISOString(),
            level,
            message,
            metadata: {
                platform: Platform.OS,
                ...metadata
            },
            stack
        };

        // Console log for development
        if (__DEV__) {
            console.log(`[${level.toUpperCase()}] ${message}`, metadata);
        }

        try {
            // Store logs persistently for debugging production issues
            const existingLogs = await this.getLogs();
            const updatedLogs = [logEntry, ...existingLogs].slice(0, this.maxLogs);
            await AsyncStorage.setItem(this.storageKey, JSON.stringify(updatedLogs));
        } catch (error) {
            console.error('Failed to store log:', error);
        }
    }

    async info(message: string, metadata?: any) {
        await this.log('info', message, metadata);
    }

    async warn(message: string, metadata?: any) {
        await this.log('warn', message, metadata);
    }

    async error(message: string, error?: Error, metadata?: any) {
        await this.log('error', message, metadata, error?.stack);
    }

    async getLogs(): Promise<ErrorLog[]> {
        try {
            const logs = await AsyncStorage.getItem(this.storageKey);
            return logs ? JSON.parse(logs) : [];
        } catch (error) {
            console.error('Failed to retrieve logs:', error);
            return [];
        }
    }

    async clearLogs() {
        try {
            await AsyncStorage.removeItem(this.storageKey);
        } catch (error) {
            console.error('Failed to clear logs:', error);
        }
    }

    async exportLogs(): Promise<string> {
        const logs = await this.getLogs();
        return JSON.stringify(logs, null, 2);
    }
}

export const logger = Logger.getInstance();