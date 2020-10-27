import IParseMailTemplateDTO from "../dtos/IParseMailTemplateDTO";
import IMailTemplateProvider from "../models/IMailTemplateProvider";
import handlebars from 'handlebars';
import fs from 'fs';

class HandlebarsMailTemplateProvider implements IMailTemplateProvider {
    public async parse({file, variables}: IParseMailTemplateDTO): Promise<string>{
        const templateFile = await fs.promises.readFile(file, {encoding: 'utf-8'});

        const parseTemplate = handlebars.compile(templateFile);

        return parseTemplate(variables);
    }
}

export default HandlebarsMailTemplateProvider;