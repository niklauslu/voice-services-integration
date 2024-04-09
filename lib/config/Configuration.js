"use strict";
// src/config/Configuration.ts
Object.defineProperty(exports, "__esModule", { value: true });
class Configuration {
    static instance;
    microsoftConfig;
    iFlyTekConfig;
    constructor() {
        this.microsoftConfig = {
            key: process.env.AZURE_KEY || "",
            region: process.env.AZURE_REGION || "",
        };
        this.iFlyTekConfig = {
            appid: process.env.IFEYTEK_APPID || "",
            ttsKey: process.env.IFEYTK_TTS_KEY || "",
            ttsSecret: process.env.IFEYTK_TTS_SECRET || "",
            asrKey: process.env.IFEYTK_ASR_KEY || ""
        };
    }
    static getInstance() {
        if (!Configuration.instance) {
            Configuration.instance = new Configuration();
        }
        return Configuration.instance;
    }
    setAzureConfig(config) {
        this.microsoftConfig = config;
    }
    getAzureConfig() {
        return this.microsoftConfig;
    }
    setIFlyTekConfig(config) {
        this.iFlyTekConfig = config;
    }
    getIFlyTekConfig() {
        return this.iFlyTekConfig;
    }
}
exports.default = Configuration;
