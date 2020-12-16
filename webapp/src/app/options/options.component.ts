import { Component, OnInit, Output, EventEmitter } from "@angular/core";

import { ILanguage, INPUT_LANGUAGES, OUTPUT_LANGUAGES } from "./options.model";
import { AppService } from "../app.service";

@Component({
    selector: 'options',
    templateUrl: './options.component.html',
    styles: [`
        .enabled-language {
            color: #2e7534;
        }
    `]
})
export class OptionsComponent implements OnInit {
    inputLanguages: ILanguage[] = INPUT_LANGUAGES;
    outputLanguages: ILanguage[] = OUTPUT_LANGUAGES;

    inputLanguage: ILanguage;
    outputLanguage: ILanguage;
    
    constructor(private appSvc:AppService) {
    }

    ngOnInit() {
        this.setInputLanguage(this.inputLanguages[0]);
        this.setOutputLanguage(this.outputLanguages[0]);
    }

    setInputLanguage(lang: ILanguage) {
        if(lang.name != this.inputLanguage?.name) {
            this.inputLanguage = lang;
            this.appSvc.changeInputLanguage(lang);
        }
    }

    setOutputLanguage(lang: ILanguage) {
        if(lang.name != this.outputLanguage?.name) {
            this.outputLanguage = lang;
            this.appSvc.changeOutputLanguage(lang);
        }
    }

    generate(): void {
        if(this.inputLanguage && this.outputLanguage) {
            this.appSvc.generateCode({ 
                from: this.inputLanguage.name,
                to: this.outputLanguage.name 
            });
        }
    }

    getEnabledClass(enabled: boolean): string {
        return enabled ? 'enabled-language' : '';
    }
}