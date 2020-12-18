import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
    selector: 'input-code',
    templateUrl: './input-code.component.html'
})
export class InputCodeComponent {
    @Input() language: string = '';
    @Input() code: string = '';
    @Input() highlightCode: string[] = ['java'];
    @Input() editCode: boolean = true;
    @Input() converting: boolean = false;
    @Output() codeChange: EventEmitter<string> = new EventEmitter();
    @Output() editCodeChanged: EventEmitter<void> = new EventEmitter();

    codeChanged(code: any): void {
        this.codeChange.emit(code);
    }

    enableCodeEdit(): void {
        this.editCode = true;
        this.editCodeChanged.emit();
    }

    onFileSelected($event: { target: { files: any[]; }; }): void {
        let file = $event.target.files[0];
        if(file) {
            let ext = file.name.match('\.([^\.]+)$')[1];
            let fileReader = new FileReader();
            fileReader.onload = (e) => {
                this.code = fileReader.result.toString();
                this.codeChange.emit(this.code);
            };
            fileReader.readAsText(file);
        }
    }
}