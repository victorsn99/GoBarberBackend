import { container } from "tsyringe";
import HandlebarsMailTemplateProvider from "./implementation/HandleBarsMailTemplateProvider";
import IMailTemplateProvider from "./models/IMailTemplateProvider";

const providers = {
    handlebars: HandlebarsMailTemplateProvider,
}

container.registerSingleton<IMailTemplateProvider>('HandlebarsMailTemplateProvider', providers.handlebars);