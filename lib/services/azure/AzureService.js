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
const Configuration_1 = __importDefault(require("../../config/Configuration"));
const _1 = require(".");
const consumers_1 = require("stream/consumers");
class AzureService {
    speechConfig;
    translationConfig;
    apiVersion = '2023-12-01-preview';
    constructor() {
        const config = Configuration_1.default.getInstance().getAzureConfig();
        if (config.apiVersion) {
            this.apiVersion = config.apiVersion;
        }
        this.speechConfig = sdk.SpeechConfig.fromSubscription(config.key, config.region);
        this.translationConfig = sdk.SpeechTranslationConfig.fromSubscription(config.key, config.region);
    }
    handleError(error) {
        // 实现错误处理逻辑
        console.error('[AzureService:Error]', error);
        // 可以在这里记录错误，或者触发错误通知等
    }
    logDebug(...params) {
        console.debug("[AzureService:Debug]", ...params);
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
                    return;
                }
                resolve(Buffer.from(audioData));
            }, (error) => {
                this.handleError(new Error(error));
                // reject(error);
                resolve(null);
            });
        });
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
    async speechTranslate(audioStream, params, callback) {
        const language = this.getLanguageConfig(params.from);
        if (language === undefined) {
            this.handleError(new Error("Language not supported"));
            return null;
        }
        let toLanguages = [];
        this.translationConfig.speechRecognitionLanguage = language.recoginize;
        params.to.forEach((l) => {
            const toLanguage = this.getLanguageConfig(l);
            if (toLanguage !== undefined) {
                this.translationConfig.addTargetLanguage(toLanguage.transaltion);
                toLanguages.push(toLanguage);
            }
        });
        if (toLanguages.length === 0) {
            this.handleError(new Error("No valid target languages found"));
            return null;
        }
        let pushStream = sdk.AudioInputStream.createPushStream();
        audioStream.on('data', function (arrayBuffer) {
            pushStream.write(arrayBuffer.slice(0));
        }).on('end', function () {
            pushStream.close();
        });
        const audioConfig = sdk.AudioConfig.fromStreamInput(pushStream);
        const translationRecognizer = new sdk.TranslationRecognizer(this.translationConfig, audioConfig);
        return new Promise((resolve, reject) => {
            translationRecognizer.recognizing = (s, e) => {
                this.logDebug(`speechTranslate TRANSLATING: Text=${e.result.text}`);
                toLanguages.forEach(l => {
                    const data = {
                        language: l.lang,
                        type: "text",
                        text: e.result.text,
                        result: e.result.translations.get(l.transaltion),
                    };
                    if (callback)
                        callback(data);
                });
            };
            translationRecognizer.recognized = (s, e) => {
                // console.log(`RECOGNIZED: Text=${e.result.text}, ${e.result.reason}`);
                if (e.result.reason == sdk.ResultReason.TranslatedSpeech) {
                    let datas = [];
                    toLanguages.forEach(l => {
                        datas.push({
                            language: l.lang,
                            type: "text",
                            text: e.result.text,
                            result: e.result.translations.get(l.transaltion),
                        });
                    });
                    if (params.tts) {
                        datas.forEach(async (d) => {
                            const audio = await this.textToSpeech(d.result, {
                                language: d.language,
                                format: params.ttsFormat,
                                voice: params.ttsVoice
                            });
                            if (consumers_1.buffer !== null) {
                                const result = {
                                    type: "audio",
                                    text: d.text,
                                    result: audio,
                                    language: d.language
                                };
                                if (callback) {
                                    callback(result);
                                }
                            }
                        });
                    }
                    resolve(datas);
                }
                else if (e.result.reason == sdk.ResultReason.NoMatch) {
                    this.handleError(new Error("speechTranslate NOMATCH: Speech could not be translated. no match"));
                    resolve(null);
                }
                else {
                    this.handleError(new Error("speechTranslate NOMATCH: Speech could not be translated. " + e.result.reason));
                    resolve(null);
                }
                translationRecognizer.stopContinuousRecognitionAsync();
            };
            translationRecognizer.canceled = (s, e) => {
                if (e.reason == sdk.CancellationReason.Error) {
                    this.handleError(new Error(`speechTranslate CANCELED: ErrorCode=${e.errorCode}`));
                    this.handleError(new Error(`speechTranslate CANCELED: ErrorDetails=${e.errorDetails}`));
                    translationRecognizer.stopContinuousRecognitionAsync();
                }
            };
            translationRecognizer.sessionStopped = (s, e) => {
                this.logDebug("speechTranslate   Session stopped event.");
                translationRecognizer.stopContinuousRecognitionAsync();
            };
            translationRecognizer.startContinuousRecognitionAsync();
        });
    }
    getLanguageConfig(language) {
        return _1.azureSpeechLangs[language] || undefined;
    }
}
exports.default = AzureService;
