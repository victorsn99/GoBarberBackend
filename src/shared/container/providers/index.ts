import { container } from 'tsyringe';
import DiskStorageProvider from './StorageProvider/implementation/DiskStorageProvider';
import IStorageProvider from './StorageProvider/models/IStorageProvider';

import IMailProvider from './MailProvider/models/IMailProvider';
import EtherealMailProvider from './MailProvider/implementations/EtherealMailProvider';
import IMailTemplateProvider from './MailTemplateProvider/models/IMailTemplateProvider';
import HandlebarsMailTemplateProvider from './MailTemplateProvider/implementation/HandleBarsMailTemplateProvider';

container.registerSingleton<IStorageProvider>('StorageProvider', DiskStorageProvider);
container.registerSingleton<IMailTemplateProvider>('HandlebarsMailTemplateProvider', HandlebarsMailTemplateProvider);
container.registerInstance<IMailProvider>('MailProvider', container.resolve(EtherealMailProvider));


