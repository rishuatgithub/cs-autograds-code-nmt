import { Component, EventEmitter, Input, Output, ViewChild, ElementRef } from "@angular/core";
import { MatDialog } from '@angular/material/dialog';

import { ITreeNode } from "../nct-tree/nct-tree.model";
import { TEXT_MODE, FILE_MODE } from "../app.contant";
import { AppService } from "../app.service";

@Component({
    selector: 'input-code',
    templateUrl: './input-code.component.html'
})
export class InputCodeComponent {
    @Input() language: string = '';
    @Input() extension: string = '';
    @Input() code: string = '';
    @Input() highlightCode: string[] = ['java'];
    @Input() editCode: boolean = true;
    @Input() converting: boolean = false;
    @Output() codeChange: EventEmitter<string> = new EventEmitter();
    @Output() editCodeChanged: EventEmitter<void> = new EventEmitter();
    @Output() modeChanged: EventEmitter<string> = new EventEmitter();
    @Output() inputFileNodeChanged: EventEmitter<ITreeNode> = new EventEmitter();

    @ViewChild("inputCode", { static: false }) inputCode: ElementRef;
    fileName: string = '';
    mode: string = TEXT_MODE;
    rootNode: ITreeNode = {};

    constructor(private appSvc: AppService, public dialog: MatDialog) {
    }

    codeChanged(code: any): void {
        this.codeChange.emit(code);
    }

    enableCodeEdit(): void {
        this.editCode = true;
        this.editCodeChanged.emit();
        this.focusInputCode();
    }

    clearInput(): void {
        this.rootNode.name = '';
        this.rootNode.childs = [];
        this.code = '';
        this.codeChange.emit('');
        this.setMode();
        this.appSvc.clearInput();
        this.enableCodeEdit();
    }

    isTextMode(): boolean {
        return this.mode === TEXT_MODE;
    }

    isFileMode(): boolean {
        return this.mode === FILE_MODE;
    }

    setMode(): void {
        if (this.rootNode && this.rootNode.childs && this.rootNode.childs.length > 0) {
            this.setAndEmitMode(FILE_MODE);
        } else {
            this.setAndEmitMode(TEXT_MODE);
        }
    }

    setAndEmitMode(mode: string): void {
        if(!(this.mode === mode)) {
            this.mode = mode;
            this.modeChanged.emit(mode);
        }
    }

    treeNodeSelected($event: ITreeNode): void {
        this.fileName = $event.name;
        this.code = $event.data;
    }

    onFileSelected($event: { target: { files: any[]; }; }): void {
        this.clearInput();

        let file = $event.target.files[0];
        if(file) {
            let ext = file.name.match('\.([^\.]+)$')[1];
            if (this.extension && this.extension.length > 0 && !(this.extension === ext)) {
                this.appSvc.incorrectInputDetected('File format not supported. Exptected *.' + this.extension + ' !!');
                this.focusInputCode();
                return;
            }
            let fileReader = new FileReader();
            fileReader.onload = (e) => {
                this.code = fileReader.result.toString();
                this.codeChange.emit(this.code);
            };
            fileReader.readAsText(file);
        }

        this.setMode();
    }

    onFolderSelected(event: any): void {
        this.clearInput();

        if (event.target.files.length > 0) {
            let files = event.target.files;
            this.rootNode.name = files[0].webkitRelativePath.split('/')[0];
            for (var i = 0; i < files.length; ++i) {
                let arr = files[i].webkitRelativePath.split('/');
                if (!(arr.length > 2)) {
                    let ext = files[i].name.match('\.([^\.]+)$')[1];
                    if (this.extension && this.extension.length > 0 && this.extension === ext) {
                        let node: ITreeNode = { name: arr[1], active: false, converted: false };
                        let fileReader = new FileReader();

                        fileReader.onload = (e) => {
                            if (this.rootNode && this.rootNode.childs && this.rootNode.childs.length > 0 && !(this.fileName && this.code)) {
                                this.treeNodeSelected(this.rootNode.childs[0]);
                                this.rootNode.childs[0].active = true;
                            }

                            node.data = fileReader.result.toString();
                        };

                        fileReader.readAsText(files[i]);
                        this.rootNode.childs.push(node);
                    }
                }
            }

            if(this.rootNode.childs && this.rootNode.childs.length == 0) {
                this.appSvc.incorrectInputDetected('No files found with supported format(*.' + this.extension +') !!');
                this.focusInputCode();
            }
            this.setMode();
        }

        this.inputFileNodeChanged.emit(this.rootNode);
    }

    opeGitCloneDialogue(): void {
        const dialogRef = this.dialog.open(GitCloneDialog);
        dialogRef.afterClosed().subscribe(result => {
            this.appSvc.gitFetchRequested();
        });
    }

    focusInputCode(): void {
        setTimeout(() => {
            this.inputCode.nativeElement.focus();
        }, 1);
    }
}

@Component({
    selector: 'git-clone-input',
    templateUrl: './git-clone-input.html',
    styles: [`
        .input-group-text {
            font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol";
        }
    `]
})
export class GitCloneDialog { }