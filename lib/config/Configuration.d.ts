import { AzureConfig } from '../models/AzureConfig';
import { IFlyTekConfig } from '../models/IFlyTekConfig';
declare class Configuration {
    private static instance;
    private microsoftConfig;
    private iFlyTekConfig;
    private constructor();
    static getInstance(): Configuration;
    setAzureConfig(config: AzureConfig): void;
    getAzureConfig(): AzureConfig;
    setIFlyTekConfig(config: IFlyTekConfig): void;
    getIFlyTekConfig(): IFlyTekConfig;
}
export default Configuration;
