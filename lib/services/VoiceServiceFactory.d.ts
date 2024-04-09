import IVoiceService from '../models/IVoiceService';
import { VoiceServiceProvider } from '../models/VoiceServiceProvider';
export declare class VoiceServiceFactory {
    static getService(provider: VoiceServiceProvider): IVoiceService;
}
