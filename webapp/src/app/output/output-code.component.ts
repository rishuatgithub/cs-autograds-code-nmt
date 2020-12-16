import { Component, Input, OnInit, AfterViewInit } from "@angular/core";

import "../../assets/vtree.min.js";
declare var vtree: any;

@Component({
    selector: 'output-code',
    templateUrl: './output-code.component.html'
})
export class OutputCodeComponent implements OnInit {
    @Input() code: string = '';
    @Input() language: string = '';
    @Input() highlightCode: string[] = [];

    vt:any;
    astData:any = {};
    selectedTabIndex:number = 0;
    astTree:string = '';
    tabs: string[] = ['Code', 'AST', 'General Summary'];
    activeTab: string = this.tabs[0];

    displayCode(): boolean {
        if (this.code && this.code.trim() != '') {
            return true;
        }
        return false;
    }

    ngOnInit() {
        //this.astData = { "_PyType": "Module", "body": [{ "_PyType": "If", "test": { "_PyType": "Compare", "left": { "_PyType": "Name", "id": "a", "ctx": { "_PyType": "Load" } }, "ops": [{ "_PyType": "Eq" }], "comparators": [{ "_PyType": "Num", "n": 3 }] }, "body": [{ "_PyType": "Print", "dest": null, "values": [{ "_PyType": "Str", "s": "hello" }], "nl": true }], "orelse": [] }] };
        this.vt = vtree(document.getElementById('ast-container'));
        this.vt.mode(this.vt.MODE_PYTHON_AST)
            .data({})
            .conf('showArrayNode', false)
            .update();
    }

    showAst(): void {
        console.log('ShowAST called')
        
    }

    changeActiveTab(tab: string) {
        this.activeTab = tab;
        if(this.activeTab === 'AST') {
            this.astData = { "_PyType": "Module", "body": [{ "_PyType": "If", "test": { "_PyType": "Compare", "left": { "_PyType": "Name", "id": "a", "ctx": { "_PyType": "Load" } }, "ops": [{ "_PyType": "Eq" }], "comparators": [{ "_PyType": "Num", "n": 3 }] }, "body": [{ "_PyType": "Print", "dest": null, "values": [{ "_PyType": "Str", "s": "hello" }], "nl": true }], "orelse": [] }] };
            if(!this.vt) {
                this.vt = vtree(document.getElementById('ast-container'));
                this.vt.mode(this.vt.MODE_PYTHON_AST)
                    .data(this.astData)
                    .update();
            } else {
                (async () => {
                    await this.delay(1);
                    this.vt.data(this.astData).update();
                })();
            }
        }
    }

     delay(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    tabChanged($event: number) {
        setTimeout(() => this.selectedTabIndex = $event, 2000);
        // $event == 1 is AST tab
        if($event == 1) {
            let vtt = vtree(document.createElement('div'));
            vtt.mode(vtt.MODE_PYTHON_AST)
                .data(this.astData)
                .conf('showArrayNode', false)
                .update();
            this.astTree = vtt.innerHTML;
            // this.vt = vtree(document.getElementById('ast-container'));
            // this.vt.mode(this.vt.MODE_PYTHON_AST)
            //     .data(this.astData)
            //     .conf('showArrayNode', false)
            //     .update();
        }
    }
}