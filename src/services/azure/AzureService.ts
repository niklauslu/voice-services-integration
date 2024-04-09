// src/services/microsoft/MicrosoftService.ts
// 支持语言 https://learn.microsoft.com/zh-cn/azure/ai-services/speech-service/language-support?tabs=tts
// 语音库 https://speech.microsoft.com/portal/voicegallery
// 定价 https://azure.microsoft.com/zh-cn/pricing/details/cognitive-services/speech-services/

import * as sdk from "microsoft-cognitiveservices-speech-sdk";
import Debug from 'debug';
import { Readable } from 'stream';
import IVoiceService from '../../models/IVoiceService';
import Configuration from '../../config/Configuration';
import { AzureConfig } from '../../models/AzureConfig';
import { VoiceLanguage } from "../../models/VoiceLanguages";
import { error } from "console";
import { AzureSpeechLangData, AzureSpeechVoice, azureSpeechLangs } from ".";

const debug = Debug('voice-services:azure');



class AzureService implements IVoiceService {

    private speechConfig: sdk.SpeechConfig;
    private apiVersion: string = '2023-12-01-preview'

    constructor() {
        const config = Configuration.getInstance().getAzureConfig();

        if (config.apiVersion) {
            this.apiVersion = config.apiVersion
        }

        this.speechConfig = sdk.SpeechConfig.fromSubscription(config.key, config.region);
    }

    handleError(error: Error): void {
        // 实现错误处理逻辑
        debug('[AzureService:Error]', error);
        // 可以在这里记录错误，或者触发错误通知等
    }

    logDebug(...params: any[]) {
        debug("[AzureService:Debug]", ...params);
    };

    // 语音合成
    async textToSpeech(text: string, params: {
        language: VoiceLanguage,
        format: "mp3" | "pcm",
        voice?: AzureSpeechVoice
    }): Promise<Buffer | null> {
        const language = this.getLanguageConfig(params.language)
        if (language === undefined) {
            this.handleError(new Error(`textToSpeech no support language ${params.language}`))
            return null
        }

        this.speechConfig.speechSynthesisLanguage = language.tts
        const voices = language.voices
        if (params.voice && !voices.includes(params.voice as AzureSpeechVoice)) {
            this.handleError(new Error(`textToSpeech no support voice ${params.voice}`))
            return null
        }

        this.speechConfig.speechSynthesisVoiceName = params.voice || language.voices[0]

        this.speechConfig.speechSynthesisOutputFormat = sdk.SpeechSynthesisOutputFormat.Raw16Khz16BitMonoPcm
        if (params.format === 'mp3') {
            this.speechConfig.speechSynthesisOutputFormat = sdk.SpeechSynthesisOutputFormat.Audio16Khz128KBitRateMonoMp3
        }

        const speechSynthesizer = new sdk.SpeechSynthesizer(this.speechConfig);
        return new Promise((resolve, reject) => {
            speechSynthesizer.speakTextAsync(
                text,
                (result) => {
                    const { audioData } = result
                    if (!audioData) {
                        this.handleError(new Error("textToSpeech no audiData"))
                        resolve(null)
                    }

                    resolve(Buffer.from(audioData))
                },
                (error: string) => {
                    this.handleError(new Error(error));
                    reject(error);
                }
            );
        })

        return null
    }

    async speechRecognize(audioStream: Readable, params: {
        language: VoiceLanguage
    }, callback?: ((data: string | null) => void) | undefined): Promise<string | null> {
        const language = this.getLanguageConfig(params.language)
        if (language === undefined) return null

        this.speechConfig.speechRecognitionLanguage = language.recoginize

        let pushStream = sdk.AudioInputStream.createPushStream();

        audioStream.on('data', function (arrayBuffer: ArrayBuffer) {
            pushStream.write(arrayBuffer.slice(0));
        }).on('end', function () {
            pushStream.close();
        });
        const audioConfig = sdk.AudioConfig.fromStreamInput(pushStream)

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
                if (callback) callback(e.result.text)
            };

            speechRecognizer.sessionStopped = (s, e) => {
                this.logDebug("\n    Session stopped event.");
                speechRecognizer.stopContinuousRecognitionAsync();
            };

            speechRecognizer.recognized = (s, e) => {
                speechRecognizer.close()
                if (e.result.reason == sdk.ResultReason.RecognizedSpeech) {
                    this.logDebug(`RECOGNIZED: Text=${e.result.text}`);
                    resolve(e.result.text)
                } else if (e.result.reason == sdk.ResultReason.NoMatch) {
                    this.logDebug("NOMATCH: Speech could not be recognized.");
                    resolve(null)
                } else {
                    resolve(null)
                }

            };

            speechRecognizer.startContinuousRecognitionAsync();
        });
    }

    async speechTranslateToSpeech(
        audioStream: Readable,
        params: {
            from: VoiceLanguage,
            to: VoiceLanguage | VoiceLanguage[]
        }): Promise<Buffer | null> {

            return null
    }

    private getLanguageConfig(language: VoiceLanguage): AzureSpeechLangData | undefined {
        return azureSpeechLangs[language] || undefined
    }
}

export default AzureService;
