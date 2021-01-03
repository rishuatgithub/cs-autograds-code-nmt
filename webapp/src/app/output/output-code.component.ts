import { Component, Input, OnInit, Inject } from "@angular/core";
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { TEXT_MODE, FILE_MODE } from "../app.contant";

import "../../assets/vtree.min.js";
import { ITreeNode } from "../nct-tree/nct-tree.model";
import { AppService } from "../app.service";
declare var vtree: any;

export interface ITab {
    id: string,
    name: string
}

@Component({
    selector: 'output-code',
    templateUrl: './output-code.component.html',
    styles: [`
        .text-mode {
            top: 80%;
            left: 0%;
            position: relative;
        }
        .file-mode {
            top: 47%;
            left: 47%;
            position: absolute;
        }
    `]
})
export class OutputCodeComponent implements OnInit {
    @Input() mode: string = TEXT_MODE;
    @Input() language: string = '';
    @Input() extension: string = '';
    @Input() highlightCode: string[] = [];
    @Input() code: string = '';
    @Input() ast: any = {};
    @Input() summary: any[] = [];
    @Input() summaryProbability: number = 0;
    @Input() converting: boolean = false;
    @Input() rootNode:ITreeNode = {};
    @Input() translated: boolean = true;

    vt:any;
    tabs:ITab[] = [
        { id: 'code', name: 'Code' },
        { id: 'ast', name: 'Syntax Tree' },
        { id: 'gs', name: 'General Summary' }
    ];
    activeTab: string = this.tabs[0].id;
    analyticsChecked:boolean = true;
    fileName: string = '';

    constructor(private appSvc: AppService, public dialog: MatDialog) {
    }

    ngOnInit() {
        this.vt = vtree(document.getElementById('ast-container'), 545, 900);
        this.vt.mode(this.vt.MODE_PYTHON_AST)
            .data({})
            .conf('showArrayNode', false)
            .conf('showLinkName', false)
            .update();

        this.appSvc.filesTranslatedEvent.subscribe(() => {
            if (this.rootNode && this.rootNode.childs && this.rootNode.childs.length > 0) {
                this.rootNode.childs[0].active = true;
                (async () => {
                    await this.delay(1);
                    this.treeNodeSelected(this.rootNode.childs[0]);
                })();
            }
        });
        this.appSvc.clearInputEvent.subscribe(() => {
            this.code = '';
        });
    }

    hasCode(): boolean {
        if (this.code && !(this.code.trim() === '')) {
            return true;
        }
        return false;
    } 
    
    isTextMode(): boolean {
        return this.mode === TEXT_MODE;
    }

    isFileMode(): boolean {
        return this.mode === FILE_MODE;
    }

    isActive(code: string) {
        return this.activeTab === code;
    }

    analyticsCheckChanged($event:any): void {
        if(!$event) {
            this.activeTab = this.tabs[0].id;
        }
    }

    disableOptions(tab: string): boolean {
        return this.converting || !this.hasCode() || (
            !this.analyticsChecked && tab != 'code'
        );
    }

    analyticsNotAvailable(): boolean {
        if ((!this.ast || !this.ast._PyType || !this.ast.body) && (!this.summary || this.summary.length == 0))
            return true;
        return false;
    }

    showMessage(): boolean {
        return (!this.converting) &&
            (this.hasCode() &&
                this.isActive('code')) && !this.translated;
    }

    showCode(): boolean {
        return (!this.converting) &&
            (this.hasCode() &&
                this.isActive('code')) && this.translated;
    }

    showAST(): boolean {
        return (!this.converting) &&
            (this.analyticsChecked &&
                this.hasCode() &&
                this.isActive('ast') &&
                this.ast);
    }

    showGS(): boolean {
        return (!this.converting) &&
            (this.analyticsChecked &&
                this.hasCode() &&
                this.isActive('gs'));
    }

    showProgressSpinner(): boolean {
        return this.converting;
    }

    changeActiveTab(tab: string) {
        if (this.activeTab != tab) {
            this.activeTab = tab;
            if (this.isActive('ast')) {
                this.updateAST();
            }
        }
    }

    getSummaryClass(): string {
        if(!this.summary || this.summary.length == 0) {
            return 'alert-secondary';
        }
        
        return this.summaryProbability ? (
            this.summaryProbability > 80 ? 'alert-success' : (
                this.summaryProbability > 65 ? 'alert-info' : (
                    this.summaryProbability > 45 ? 'alert-warning' : (
                        this.summaryProbability > 30 ? 'alert-danger' : 'alert-secondary'
                    )
                )
            )
        ) : 'alert-primary';
    }

    updateAST(): void {
        let data = JSON.parse(JSON.stringify(this.ast));
        if (!this.vt) {
            this.vt = vtree(document.getElementById('ast-container'), 545, 900);
            this.vt.mode(this.vt.MODE_PYTHON_AST)
                .data(data)
                .conf('showArrayNode', false)
                .conf('showLinkName', false)
                .update();
        } else {
            if(this.mode === FILE_MODE && this.vt.width > 700) {
                this.vt = vtree(document.getElementById('ast-container'), 545, 700);
                this.vt.mode(this.vt.MODE_PYTHON_AST)
                    .data(data)
                    .conf('showArrayNode', false)
                    .conf('showLinkName', false)
                    .update();
            }
            (async () => {
                await this.delay(1);
                this.vt.data(data).update();
            })();
        }
    }

    delay(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    downloadCode(): void {
        const blob: Blob = new Blob([this.code], { type: 'text' });
        const fileName = (this.isFileMode() && this.fileName) ? this.fileName : ('output' + (this.extension ? '.' + this.extension : ''));
        const objectUrl: string = URL.createObjectURL(blob);
        const a: HTMLAnchorElement = document.createElement('a') as HTMLAnchorElement;

        a.href = objectUrl;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();

        document.body.removeChild(a);
        URL.revokeObjectURL(objectUrl);
    }

    treeNodeSelected($event: ITreeNode): void {
        if ($event.data) {
            this.code = $event.data.code;
            this.ast = $event.data.ast;
            this.summary = $event.data.summary;
            this.summaryProbability = $event.data.summaryProbability;
            this.fileName = $event.name;
            this.translated  = $event.converted;
            if (this.isActive('ast')) {
                this.updateAST();
            }
        }
    }

    opeAstDialogue(): void {
        this.dialog.open(AstOutputDialog, {
            data: this.ast
        });
    }

    codeCopied(): void {
        this.appSvc.codeCopied();
    }
}

@Component({
    selector: 'ast-output',
    templateUrl: './ast-output.html',
    styles: [`
        
    `]
})
export class AstOutputDialog implements OnInit { 
    vt: any;

    constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }

    ngOnInit() {
        this.vt = vtree(document.getElementById('ast-output-container'), 700, 1050);
        this.vt.mode(this.vt.MODE_PYTHON_AST)
            .data(this.data)
            .conf('showArrayNode', false)
            .conf('showLinkName', false)
            .update();
    }
}