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

