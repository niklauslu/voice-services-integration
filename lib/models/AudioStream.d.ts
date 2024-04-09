/// <reference types="node" />
/// <reference types="node" />
import { Readable } from "stream";
export declare class AudioStream extends Readable {
    constructor(options?: any);
    _read(size: number): void;
    close(): void;
    addAudio(data: Buffer): void;
}
