// src/services/VoiceServiceFactory.ts

import IVoiceService from '../models/IVoiceService';
import { VoiceServiceProvider } from '../models/VoiceServiceProvider';
import AzureService from './azure/AzureService';

// import other services...


export class VoiceServiceFactory {
    static getService(provider: VoiceServiceProvider): IVoiceService {
        switch (provider) {
            case "azure":
                return new AzureService();
            // case other providers...
            default:
                throw new Error(`Provider ${provider} is not supported.`);
        }
    }
}

