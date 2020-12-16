import { Injectable, Output, EventEmitter } from "@angular/core";
import { IGenerateRequest } from "../app.model";

@Injectable()
export class CodeGenService {
    @Output() generateCodeEvent: EventEmitter<IGenerateRequest> = new EventEmitter<IGenerateRequest>();

    generateCode(request: IGenerateRequest): void {
        this.generateCodeEvent.emit(request);
    }
}