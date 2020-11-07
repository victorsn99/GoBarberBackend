import { container } from "tsyringe";
import DiskStorageProvider from './implementation/DiskStorageProvider';
import S3StorageProvider from './implementation/S3StorageProvider';
import IStorageProvider from './models/IStorageProvider';
import uploadConfig from '@config/upload';

const providers = {
    diskStorage: DiskStorageProvider,
    s3: S3StorageProvider,
}

container.registerSingleton<IStorageProvider>('StorageProvider', providers[uploadConfig.driver]);