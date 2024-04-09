// src/config/Configuration.ts

import { AzureConfig } from '../models/AzureConfig';
import { IFlyTekConfig } from '../models/IFlyTekConfig';

class Configuration {
    private static instance: Configuration;
    private microsoftConfig: AzureConfig;
    private iFlyTekConfig: IFlyTekConfig;

    private constructor() {
        this.microsoftConfig = {
            key: process.env.AZURE_KEY || "",
            region: process.env.AZURE_REGION || "",
        };

        this.iFlyTekConfig = {
            appid: process.env.IFEYTEK_APPID || "",
            ttsKey: process.env.IFEYTK_TTS_KEY || "",
            ttsSecret: process.env.IFEYTK_TTS_SECRET || "",
            asrKey: process.env.IFEYTK_ASR_KEY || ""
        }
    }

    public static getInstance(): Configuration {
        if (!Configuration.instance) {
            Configuration.instance = new Configuration();
        }
        return Configuration.instance;
    }

    public setAzureConfig(config: AzureConfig): void {
        this.microsoftConfig = config;
    }

    public getAzureConfig(): AzureConfig {
        return this.microsoftConfig;
    }

    public setIFlyTekConfig(config: IFlyTekConfig): void {
        this.iFlyTekConfig = config;
    }

    public getIFlyTekConfig(): IFlyTekConfig {
        return this.iFlyTekConfig;
    }
}

export default Configuration;

