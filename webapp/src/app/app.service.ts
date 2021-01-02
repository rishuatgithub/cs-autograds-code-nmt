import { EventEmitter, Injectable } from "@angular/core";
import { IGenerateRequest } from "./app.model";
import { ILanguage } from "./options/options.model";

@Injectable()
export class AppService {
    inputLanguageChangeEvent: EventEmitter<ILanguage> = new EventEmitter();
    outputLanguageChangeEvent: EventEmitter<ILanguage> = new EventEmitter();
    codeGenerateRequestEvent: EventEmitter<IGenerateRequest> = new EventEmitter();
    clearInputEvent: EventEmitter<void> = new EventEmitter();
    gitFetchEvent: EventEmitter<void> = new EventEmitter();
    filesTranslatedEvent: EventEmitter<void> = new EventEmitter();
    incorrectInputEvent: EventEmitter<string> = new EventEmitter();

    generateCode(request: IGenerateRequest): void {
        this.codeGenerateRequestEvent.emit(request);
    }

    changeInputLanguage(lang: ILanguage): void {
        this.inputLanguageChangeEvent.emit(lang);
    }

    changeOutputLanguage(lang: ILanguage): void {
        this.outputLanguageChangeEvent.emit(lang);
    }

    clearInput(): void {
        this.clearInputEvent.emit();
    }

    gitFetchRequested(): void {
        this.gitFetchEvent.emit();
    }

    filesTranslated(): void {
        this.filesTranslatedEvent.emit();
    }

    incorrectInputDetected(message: string): void {
        this.incorrectInputEvent.emit(message);
    }
}