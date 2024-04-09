"use strict";
// src/services/microsoft/MicrosoftService.ts
// 支持语言 https://learn.microsoft.com/zh-cn/azure/ai-services/speech-service/language-support?tabs=tts
// 语音库 https://speech.microsoft.com/portal/voicegallery
// 定价 https://azure.microsoft.com/zh-cn/pricing/details/cognitive-services/speech-services/
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sdk = __importStar(require("microsoft-cognitiveservices-speech-sdk"));
const debug_1 = __importDefault(require("debug"));
const Configuration_1 = __importDefault(require("../../config/Configuration"));
const debug = (0, debug_1.default)('voice-services:azure');
const azureSpeechLangs = {
    zh: {
        recoginize: "zh-CN", transaltion: "zh-Hans", tts: "zh-CN", voices: [
            "zh-CN-XiaochenMultilingualNeural", "zh-CN-XiaorouNeural", "zh-CN-XiaoxiaoDialectsNeural", "zh-CN-XiaoxiaoMultilingualNeura", "zh-CN-XiaoyuMultilingualNeural",
            "zh-CN-YunjieNeural", "zh-CN-YunyiMultilingualNeural"
        ]
    },
    en: {
        recoginize: "en-US", transaltion: "en", tts: "en-US", voices: [
            "en-US-AIGenerate1Neural", "en-US-AIGenerate2Neural", "en-US-BrianMultilingualNeural", "en-US-EmmaMultilingualNeural"
        ]
    },
    ko: {
        recoginize: "ko-KR", transaltion: "ko", tts: "ko-KR", voices: [
            "ko-KR-SunHiNeural", "ko-KR-InJoonNeural", "ko-KR-BongJinNeural", "ko-KR-GookMinNeural", "ko-KR-JiMinNeural", "ko-KR-SeoHyeonNeural", "ko-KR-SoonBokNeural", "ko-KR-YuJinNeural", "ko-KR-HyunsuNeural"
        ]
    }
};
class AzureService {
    speechConfig;
    apiVersion = '2023-12-01-preview';
    constructor() {
        const config = Configuration_1.default.getInstance().getAzureConfig();
        if (config.apiVersion) {
            this.apiVersion = config.apiVersion;
        }
        this.speechConfig = sdk.SpeechConfig.fromSubscription(config.key, config.region);
    }
    handleError(error) {
        // 实现错误处理逻辑
        debug('[AzureService:Error]', error);
        // 可以在这里记录错误，或者触发错误通知等
    }
    logDebug(...params) {
        debug("[AzureService:Debug]", ...params);
    }
    ;
    // 语音合成
    async textToSpeech(text, params) {
        const language = this.getLanguageConfig(params.language);
        if (language === undefined) {
            this.handleError(new Error(`textToSpeech no support language ${params.language}`));
            return null;
        }
        this.speechConfig.speechSynthesisLanguage = language.tts;
        const voices = language.voices;
        if (params.voice && !voices.includes(params.voice)) {
            this.handleError(new Error(`textToSpeech no support voice ${params.voice}`));
            return null;
        }
        this.speechConfig.speechSynthesisVoiceName = params.voice || language.voices[0];
        this.speechConfig.speechSynthesisOutputFormat = sdk.SpeechSynthesisOutputFormat.Raw16Khz16BitMonoPcm;
        if (params.format === 'mp3') {
            this.speechConfig.speechSynthesisOutputFormat = sdk.SpeechSynthesisOutputFormat.Audio16Khz128KBitRateMonoMp3;
        }
        const speechSynthesizer = new sdk.SpeechSynthesizer(this.speechConfig);
        return new Promise((resolve, reject) => {
            speechSynthesizer.speakTextAsync(text, (result) => {
                const { audioData } = result;
                if (!audioData) {
                    this.handleError(new Error("textToSpeech no audiData"));
                    resolve(null);
                }
                resolve(Buffer.from(audioData));
            }, (error) => {
                this.handleError(new Error(error));
                reject(error);
            });
        });
        return null;
    }
    async speechRecognize(audioStream, params, callback) {
        const language = this.getLanguageConfig(params.language);
        if (language === undefined)
            return null;
        this.speechConfig.speechRecognitionLanguage = language.recoginize;
        let pushStream = sdk.AudioInputStream.createPushStream();
        audioStream.on('data', function (arrayBuffer) {
            pushStream.write(arrayBuffer.slice(0));
        }).on('end', function () {
            pushStream.close();
        });
        const audioConfig = sdk.AudioConfig.fromStreamInput(pushStream);
        const speechRecognizer = new sdk.SpeechRecognizer(this.speechConfig, audioConfig);
        return new Promise((resolve, reject) => {
            speechRecognizer.canceled = (s, e) => {
                this.logDebug(`CANCELED: Reason=${e.reason}`);
                if (e.reason == sdk.CancellationReason.Error) {
                    this.logDebug(`"CANCELED: ErrorCode=${e.errorCode}`);
                    this.logDebug(`"CANCELED: ErrorDetails=${e.errorDetails}`);
                }
                speechRecognizer.stopContinuousRecognitionAsync();
            };
            speechRecognizer.recognizing = (s, e) => {
                this.logDebug(`RECOGNIZING: Text=${e.result.text}`);
                if (callback)
                    callback(e.result.text);
            };
            speechRecognizer.sessionStopped = (s, e) => {
                this.logDebug("\n    Session stopped event.");
                speechRecognizer.stopContinuousRecognitionAsync();
            };
            speechRecognizer.recognized = (s, e) => {
                speechRecognizer.close();
                if (e.result.reason == sdk.ResultReason.RecognizedSpeech) {
                    this.logDebug(`RECOGNIZED: Text=${e.result.text}`);
                    resolve(e.result.text);
                }
                else if (e.result.reason == sdk.ResultReason.NoMatch) {
                    this.logDebug("NOMATCH: Speech could not be recognized.");
                    resolve(null);
                }
                else {
                    resolve(null);
                }
            };
            speechRecognizer.startContinuousRecognitionAsync();
        });
    }
    async speechTranslateToSpeech(audioStream, params) {
        return null;
    }
    getLanguageConfig(language) {
        return azureSpeechLangs[language] || undefined;
    }
}
exports.default = AzureService;