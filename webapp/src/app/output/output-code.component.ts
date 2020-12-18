import { Component, Input, OnInit } from "@angular/core";

import "../../assets/vtree.min.js";
declare var vtree: any;

export interface ITab {
    id: string,
    name: string
}

@Component({
    selector: 'output-code',
    templateUrl: './output-code.component.html'
})
export class OutputCodeComponent implements OnInit {
    @Input() language: string = '';
    @Input() highlightCode: string[] = [];
    @Input() code: string = '';
    @Input() ast: any = {};
    @Input() summary: string = '';
    @Input() summaryProbability: number = 0;
    @Input() converting: boolean = false;

    vt:any;
    tabs:ITab[] = [
        { id: 'code', name: 'Code' },
        { id: 'ast', name: 'Syntax Tree' },
        { id: 'gs', name: 'General Summary' }
    ];
    activeTab: string = this.tabs[0].id;
    analyticsChecked:boolean = true;

    hasCode(): boolean {
        if (this.code && this.code.trim() != '') {
            return true;
        }
        return false;
    }

    ngOnInit() {
        this.vt = vtree(document.getElementById('ast-container'));
        this.vt.mode(this.vt.MODE_PYTHON_AST)
            .data({})
            .conf('showArrayNode', false)
            .conf('showLinkName', false)
            .update();
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

    showCode(): boolean {
        return (!this.converting) &&
            (this.hasCode() &&
                this.isActive('code'));
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
                this.isActive('gs') &&
                this.summary?.trim() != '');
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
            this.vt = vtree(document.getElementById('ast-container'));
            this.vt.mode(this.vt.MODE_PYTHON_AST)
                .data(data)
                .conf('showArrayNode', false)
                .conf('showLinkName', false)
                .update();
        } else {
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
        const fileName = 'output.py';
        const objectUrl: string = URL.createObjectURL(blob);
        const a: HTMLAnchorElement = document.createElement('a') as HTMLAnchorElement;

        a.href = objectUrl;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();

        document.body.removeChild(a);
        URL.revokeObjectURL(objectUrl);
    }
}