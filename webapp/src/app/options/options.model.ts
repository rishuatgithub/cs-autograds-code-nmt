export interface ILanguage {
    name: string,
    icon?: string,
    enabled: boolean,
    extension: string,
    highlightCode?: string
}

export const INPUT_LANGUAGES: ILanguage[] = [
    { 
        name: 'Java', 
        icon: '../assets/java-brand.png',
        enabled: true,
        highlightCode: 'java',
        extension: 'java'
    },
    {
        name: 'COBOL',
        icon: '../assets/cobol-brand.png',
        enabled: true,
        highlightCode: 'perl',
        extension: 'cob'
    },
    {
        name: 'C++',
        icon: '../assets/cpp-brand.png',
        enabled: true,
        highlightCode: 'cpp',
        extension: 'cpp'
    },
    { 
        name: 'VB .Net',
        icon: '../assets/vb-net-brand.png',
        enabled: false,
        highlightCode: 'vbnet',
        extension: 'vb'
    },
    {
        name: 'PERL',
        icon: '../assets/perl-brand.png',
        enabled: false,
        highlightCode: 'perl',
        extension: 'perl'
    },
    {
        name: 'C#',
        icon: '../assets/csharp-brand.png',
        enabled: false,
        highlightCode: 'csharp',
        extension: 'cs'
    }
];

export const OUTPUT_LANGUAGES: ILanguage[] = [
    { 
        name: 'Python', 
        icon: '../assets/python-brand.png',
        enabled: true,
        highlightCode: 'python',
        extension: 'py'
    },
    { 
        name: 'C#', 
        icon: '../assets/csharp-brand.png',
        enabled: false,
        highlightCode: 'csharp',
        extension: 'cs'
    },
    {
        name: 'Java',
        icon: '../assets/java-brand.png',
        enabled: false,
        highlightCode: 'java',
        extension: 'java'
    },
    {
        name: 'C++',
        icon: '../assets/cpp-brand.png',
        enabled: false,
        highlightCode: 'cpp',
        extension: 'cpp'
    }
];