import { createWriteStream, WriteStream } from 'node:fs';
import fs from "fs";
import path from 'node:path';

export class Logger {
    private destinyFile!: string;
    private inputStream!: WriteStream;
    private logsDir: string = path.join(process.cwd(), "logs");

    constructor(logFileName: string) {
        if (!fs.existsSync(this.logsDir)) {
            fs.mkdirSync(this.logsDir, { recursive: true });
        }
        this.destinyFile = path.join(this.logsDir, logFileName);
        this.inputStream = createWriteStream(this.destinyFile, { flags: 'a' });
        console.log('Loger creado');
    }

    error(msg: string | object) {
        this.inputStream.write(
            `[ERROR] [${new Date().toISOString()}] : ${this.formatMessage(msg)}\n`,
        );
    }

    info(msg: string | object) {
        this.inputStream.write(
            `[INFO] [${new Date().toISOString()}] : ${this.formatMessage(msg)}\n`,
        );
    }

    formatMessage(msg: string | object): string {
        if (msg instanceof Error) {
            return msg.stack ?? `${msg.name}: ${msg.message}`;
        }
        if (typeof msg === 'object') {
            return JSON.stringify(msg, null, 2);
        }
        return String(msg);
    }

    static getLogger(logFileName: string): Logger {
        return new Logger(logFileName + '.log');
    }
}
