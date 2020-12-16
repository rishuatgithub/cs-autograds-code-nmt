export interface ILanguage {
    name: string,
    icon?: string,
    enabled: boolean,
    highlightCode?: string
}

export const INPUT_LANGUAGES: ILanguage[] = [
    { 
        name: 'Java', 
        icon: '../assets/java-brands.svg',
        enabled: true
    },
    { 
        name: 'VB .Net',
        icon: '../assets/java-brands.svg',
        enabled: false
    }
];

export const OUTPUT_LANGUAGES: ILanguage[] = [
    { 
        name: 'Python', 
        icon: '../assets/python-brands.svg',
        enabled: true,
        highlightCode: 'python'
    },
    { 
        name: 'C#', 
        icon: '../assets/python-brands.svg',
        enabled: false,
        highlightCode: 'csharp'
    }
];