import { createWriteStream, WriteStream } from 'node:fs';
import fs from 'fs';
import path from 'node:path';

type LoggerOptions = {
    logsDir?: string;
    fileName: string;
    rotateDays?: number;
    rotateHours?: number;
    rotateMinutes?: number;
};

// Logger.getLogger({ fileName: 'test', rotateDays: 0, rotateMinutes: 1 })
export class Logger {
    private destinyFile!: string;
    inputStream!: WriteStream;
    private logsDir: string = path.join(process.cwd(), 'logs');
    private fileName!: string;
    private rotateDays: number;
    private rotateHours: number;
    private rotateMinutes: number;

    constructor(options: LoggerOptions) {
        if (!fs.existsSync(this.logsDir)) {
            fs.mkdirSync(this.logsDir, { recursive: true });
        }
        const { rotateDays = 1, rotateHours = 0, rotateMinutes = 0 } = options;
        this.rotateDays = rotateDays;
        this.rotateHours = rotateHours;
        this.rotateMinutes = rotateMinutes;
        this.fileName = options.fileName;
        this.destinyFile = path.join(this.logsDir, this.fileName);
        this.inputStream = this.createLoggerStreamNow();
        console.log(`Loger ${this.fileName} Iniciado`);
    }

    createLoggerStreamNow() {
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth() + 1;
        const day = today.getDate();
        const minutes = !!this.rotateMinutes ? today.getMinutes() : '';
        const stream = createWriteStream(
            `${this.destinyFile}-${year}-${month}-${day}-${minutes}.log`,
            { flags: 'a' },
        );
        stream.on('error', (err) => {
            console.error(`Error en el stream del logger ${this.fileName}: `, err);
            this.recoverStream();
        });
        return stream;
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

    static getLogger(options: LoggerOptions): Logger {
        const logger = new Logger(options);
        logger.dailyRotate();
        return logger;
    }

    timeToNextRotation(): number {
        const now = new Date();
        // const nextDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes() + 1, now.getSeconds(), now.getMilliseconds())
        const nextDate = new Date();
        nextDate.setDate(now.getDate() + this.rotateDays);
        nextDate.setHours(now.getHours() + this.rotateHours);
        nextDate.setMinutes(now.getMinutes() + this.rotateMinutes);
        nextDate.setSeconds(0, 0);
        const msDiff = nextDate.getTime() - now.getTime();
        return msDiff;
    }

    dailyRotate() {
        setTimeout(() => {
            const oldStream = this.inputStream;
            this.inputStream = this.createLoggerStreamNow();
            if (oldStream) {
                oldStream.end();
            }
            this.dailyRotate();
        }, this.timeToNextRotation());
    }

    private recoverStream() {
        try {
            console.log('Stream caido. Intentando recuperar');
            this.inputStream = this.createLoggerStreamNow();
            this.inputStream.on('error', (err) => {
                console.error('Error en el stream tras recuperación:', err);
            });
            console.log('Stream recuperado correctamente.');
        } catch (e) {
            console.error('No se pudo recuperar el stream del logger:', e);
        }
    }
}
