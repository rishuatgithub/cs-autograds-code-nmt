export interface ILanguage {
    name:string,
    icon?:string,
    enabled:boolean
}

export const inputLanguages:ILanguage[] = [
    { name: 'Java', enabled: true },
    { name: 'VB .Net', enabled: false }
];

export const outputLanguages: ILanguage[] = [
    { name: 'Python', enabled: true },
    { name: 'C#', enabled: false }
];
