import { Component } from "@angular/core";

export interface ICont {
    name: string,
    image: string,
    id: string
}

@Component({
    selector: 'about',
    templateUrl: './about.component.html'
})
export class AboutComponent {
    contributors: ICont[] = [
        { id: '323585', name: 'Rishu Shrivastava', image: '../../assets/rishu.jpg' },
        { id: '488620', name: 'Harish Pandya', image: '../../assets/harish.jpg' },
        { id: '361026', name: 'Prateek Panda', image: '../../assets/prateek.jpg' }
    ];
}

@Component({
    selector: 'inference-arch',
    templateUrl: './inference-arch.component.html'
})
export class InferenceArchComponent {
    url: string = '../../assets/nct-inference-arch.gif';
}

@Component({
    selector: 'help',
    templateUrl: './help.component.html'
})
export class HelpComponent {
    
}