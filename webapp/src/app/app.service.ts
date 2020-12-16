import { EventEmitter, Injectable } from "@angular/core";
import { IGenerateRequest } from "./app.model";
import { ILanguage } from "./options/options.model";

@Injectable()
export class AppService {
    inputLanguageChangeEvent: EventEmitter<ILanguage> = new EventEmitter();
    outputLanguageChangeEvent: EventEmitter<ILanguage> = new EventEmitter();
    codeGenerateRequestEvent: EventEmitter<IGenerateRequest> = new EventEmitter();
    astDisplayRequestEvent: EventEmitter<string> = new EventEmitter();

    generateCode(request: IGenerateRequest): void {
        this.codeGenerateRequestEvent.emit(request);
    }

    changeInputLanguage(lang: ILanguage): void {
        this.inputLanguageChangeEvent.emit(lang);
    }

    changeOutputLanguage(lang: ILanguage): void {
        this.outputLanguageChangeEvent.emit(lang);
    }

    displayAst(astContent: string): void {
        this.astDisplayRequestEvent.emit(astContent);
    }
}