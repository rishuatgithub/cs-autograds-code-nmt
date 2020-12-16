import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
    selector: 'input-code',
    templateUrl: './input-code.component.html'
})
export class InputCodeComponent {
    @Input() language: string = '';
    @Input() code: string = '';
    @Output() codeChange: EventEmitter<string> = new EventEmitter();

    codeChanged(code: any): void {
        this.codeChange.emit(code);
    }

    onFileSelected($event: { target: { files: any[]; }; }): void {
        let file = $event.target.files[0];
        console.log(file);
        if(file) {
            let ext = file.name.match('\.([^\.]+)$')[1];
            let fileReader = new FileReader();
            fileReader.onload = (e) => {
                this.code = fileReader.result.toString();
            };
            fileReader.readAsText(file);
        }
    }
}