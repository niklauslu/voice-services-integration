import { Readable } from "stream";

// 创建一个自定义的Readable流来接收音频数据
export class AudioStream extends Readable {
    constructor(options?: any) {
        super(options);
    }

    _read(size: number): void {
        // _read是必须的，但是我们不需要实现任何内容
        // 因为我们将会手动推送数据到这个流
    }

    // 结束流
    close() {
        this.push(null);
    }

    // 添加音频数据到流
    addAudio(data: Buffer) {
        this.push(data);
    }
}