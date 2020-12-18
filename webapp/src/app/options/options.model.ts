export interface ILanguage {
    name: string,
    icon?: string,
    enabled: boolean,
    highlightCode?: string
}

//VB, COBOL, SQL, C++ JAVA, PYTHON
export const INPUT_LANGUAGES: ILanguage[] = [
    { 
        name: 'Java', 
        icon: '../assets/java-brands.svg',
        enabled: true,
        highlightCode: 'java'
    },
    {
        name: 'C++',
        icon: '../assets/cpp-brands.svg',
        enabled: false,
        highlightCode: 'cpp'
    },
    { 
        name: 'VB .Net',
        icon: '../assets/vb-brands.svg',
        enabled: false,
        highlightCode: 'vb'
    },
    {
        name: 'PERL',
        icon: '../assets/perl-brands.svg',
        enabled: false,
        highlightCode: 'perl'
    },
    {
        name: 'C#',
        icon: '../assets/csharp-brands.svg',
        enabled: false,
        highlightCode: 'csharp'
    },
    {
        name: 'COBOL',
        icon: '../assets/cobol-brands.svg',
        enabled: false,
        highlightCode: 'cobol'
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
        icon: '../assets/csharp-brands.svg',
        enabled: false,
        highlightCode: 'csharp'
    },
    {
        name: 'Java',
        icon: '../assets/java-brands.svg',
        enabled: false,
        highlightCode: 'java'
    },
    {
        name: 'Kotlin',
        icon: '../assets/kotlin-brands.svg',
        enabled: false,
        highlightCode: 'kotlin'
    },
    {
        name: 'C++',
        icon: '../assets/cpp-brands.svg',
        enabled: false,
        highlightCode: 'cpp'
    }
];