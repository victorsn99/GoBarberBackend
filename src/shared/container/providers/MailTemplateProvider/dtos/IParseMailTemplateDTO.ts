interface ITemplateVariables {
    [key: string]: string | number; //criar uma variavel sem um padrão específico
}

export default interface IParseMailTemplateDTO {
    file: string;
    variables: ITemplateVariables;
}