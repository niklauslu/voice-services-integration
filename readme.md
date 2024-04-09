### 语音AI服务聚合

#### 1.配置说明

##### 微软
```
AZURE_KEY=
AZURE_REGION=
```

#### 2.安装
```sh
npm i voice-services-integration
```

#### 3.使用

##### 引入
```js
import { LCVoiceService } from 'voice-services-integration'
```

##### 文字转语音 TTS
```js
const audioService = LCVoiceService.getService("azure")

const audioData = await audioService.textToSpeech(text, {
    language: "zh",
    format: "mp3"
})
```

##### 语音转文字 ASR

```js
import { AudioStream, LCVoiceService } from "voice-services-integration";

const vs = LCVoiceService.getService("azure")
const audioStream = new AudioStream()

// 传入一个音频流
vs.speechRecognize(audioStream, {
    language: "zh"
}, (result) => {
    console.log(result)
}).then(result => {
    console.log(result)
})

// 模拟音频流
const stream = createReadStream("test.pcm", { highWaterMark: 1024 * 10 })
let index = 0
stream.on('data', (chunk: Buffer) => {
    index++
    setTimeout(() => {
        audioStream.addAudio(chunk)
    }, index * 10)
    
})

stream.on('end', () => {
    setTimeout(() => {
        audioStream.close()
    }, index * 10)
})
```

##### 语音翻译（支持同时翻译成多种语言）
```js
import { AudioStream, LCVoiceService } from "voice-services-integration";

const vs = LCVoiceService.getService("azure")
const audioStream = new AudioStream()
vs.speechTranslate(audioStream, {
    from: "zh", // 源语言
    to: ["en", "ko"], // 目标语言
    tts: true // 是否需要语音合成
}, (result) => {
    console.log(result)
    // 识别过程中的识别结果
    // {
    //     language: 'en', // 翻译的语言
    //     type: 'text|audio', // 翻译的类型, 文本或者语音，tts为true的时候会接收语音
    //     text: '床前明月光疑是地上霜。举头望明月低头思故乡。',  // 识别的文本
    //     result: 'The bright moonlight in front of the bed is suspected to be frost on the ground. Raise your head to look at the bright moon and bow your head to think of your hometown.' // 翻译后的文本
    // }

}).then(results => {
    console.log(results)
    // 识别完成后的结果
    // [ 
    //     {
    //         language: 'en', // 翻译的语言
    //         type: 'text', // 翻译的类型,这里只有文本，tts语音需要用callback接收
    //         text: '床前明月光疑是地上霜。举头望明月低头思故乡。',  // 识别的文本
    //         result: 'The bright moonlight in front of the bed is suspected to be frost on the ground. Raise your head to look at the bright moon and bow your head to think of your hometown.' // 翻译后的文本
    //     },
    //     ...
    // ]
})

// 模拟音频流
const stream = createReadStream("test.pcm", { highWaterMark: 1024 * 10 })
let index = 0
stream.on('data', (chunk: Buffer) => {
    index++
    console.log(index)
    setTimeout(() => {
        audioStream.addAudio(chunk)
    }, index * 10)

})

stream.on('end', () => {
    setTimeout(() => {
        audioStream.close()
    }, index * 10)
})
```


