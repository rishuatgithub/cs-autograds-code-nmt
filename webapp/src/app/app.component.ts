import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { IGenerateRequest } from "./app.model";
import { AppService } from "./app.service";
import { ILanguage } from "./options/options.model";
import { HttpService, IHttpResponse } from "./http/index";

import { TEXT_MODE, FILE_MODE } from "./app.contant";
import { ITreeNode } from './nct-tree/nct-tree.model';
import { VirtualTimeScheduler } from 'rxjs';

const CONVERSION_URL: string = 'https://p6n1tgxkci.execute-api.us-east-1.amazonaws.com/dev/';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  inputCode: string = '';
  inputLanguage: ILanguage;
  highlightIntputCode: string[] = [];
  editInput: boolean = true;

  outputCode: string = '';
  outputLanguage: ILanguage;
  highlightOutputCode: string[] = [];
  summary:any[] = [];
  summaryProbability: number = 0;
  astData:any = {};
  converting:boolean = false;
  converted:boolean = false;
  mode: string = TEXT_MODE;
  inputFileNode: ITreeNode = {};
  outputFileNode: ITreeNode = {};

  constructor(private appSvc: AppService, private httpScv: HttpService, private _snackBar: MatSnackBar) {
  }

  ngOnInit() {
    this.appSvc.inputLanguageChangeEvent.subscribe((lang: ILanguage) => {
      if (lang?.name !== this.inputLanguage?.name) {
        this.setInputLanguage(lang);
      }
    });
    this.appSvc.outputLanguageChangeEvent.subscribe((lang: ILanguage) => {
      if (lang?.name != this.outputLanguage?.name) {
        this.setOutputLanguage(lang);
      }
    });
    this.appSvc.codeGenerateRequestEvent.subscribe((request: IGenerateRequest) => {
      if (this.mode === TEXT_MODE) {
        this.convertInTextMode(request);
      } else if (this.mode === FILE_MODE) {
        this.convertInFileNode(request);
      }
    });
    this.appSvc.gitFetchEvent.subscribe(() => {
      this.openSnackBar('Git fetch feature is still in progress. Please use a different input method !!', 3000);
    });
    this.appSvc.incorrectInputEvent.subscribe((message: string) => {
      this.openSnackBar(message, 3000);
    });
    this.appSvc.codeCopiedEvent.subscribe(() => {
      this.openSnackBar('Output code copied to clipboard !!', 1200);
    });
  }

  convertInTextMode(request: IGenerateRequest): void {
    if (this.inputCode.trim() === '') {
      this.openSnackBar('Provide Input code !!', 1200);
    } else {
      if (!this.converted) {
        this.convertCodeInTextMode(request);
      } else {
        this.openSnackBar('Code already translated !!', 1200);
      }
    }
  }

  convertInFileNode(request: IGenerateRequest): void {
    if (!this.inputFileNode || !this.inputFileNode.childs || this.inputFileNode.childs.length < 1) {
      this.openSnackBar('There is no file to translate !!', 1200);
    } else {
      if(this.inputFileNode.childs.find(node=> !node.converted)) {
        this.convertCodeInFileMode(request);
      } else {
        this.openSnackBar('All files already translated !!', 1200);
      }
    }
  }

  setInputLanguage(lang: ILanguage): void {
    this.inputLanguage = lang;
    this.inputCode = '';
    this.outputCode = '';
    this.editInput = true;
    
    if (this.highlightIntputCode.length > 0)
      this.highlightIntputCode.pop();
    
      if (lang.highlightCode)
      this.highlightIntputCode.push(lang.highlightCode);
  }

  setOutputLanguage(lang: ILanguage): void {
    this.outputLanguage = lang;
    this.outputCode = '';
    this.converted = false;

    if (this.highlightOutputCode.length > 0)
      this.highlightOutputCode.pop();
    
      if (lang.highlightCode)
      this.highlightOutputCode.push(lang.highlightCode);
  }

  convertCodeInFileMode(request: IGenerateRequest): void {
    this.outputFileNode = { name: this.inputFileNode.name, childs: [] };
    this.converting = true;
    this.inputFileNode.childs.forEach(node => {
      let ext = node.name.match('\.([^\.]+)$')[1];
      let outputNode: ITreeNode = {
        name: node.name.replace(ext, this.outputLanguage.extension)
      };
      this.httpScv.post(CONVERSION_URL, { from: request.from, to: request.to, input: node.data })
        .subscribe((res: IHttpResponse) => {
          if (res.success) {
            outputNode.converted = true;
            outputNode.data = {
              code: res.data.output,
              ast: res.data.ast,
              summary: res.data.summary,
              summaryProbability: this.getMaxSummaryProbability(res.data.summary)
            };
            node.converted = true;
          } else {
            outputNode.converted = false;
            outputNode.data = res.message;
            this.openSnackBar('Translation failed for ' + node.name + '!!', 4000);
          }

          if (node.name === this.inputFileNode.childs[this.inputFileNode.childs.length - 1].name) {
            this.converting = false;
            this.appSvc.filesTranslated();
            this.openSnackBar('Files translated successfully !!');
          }
        });

      this.outputFileNode.childs.push(outputNode);
    });
  }

  convertCodeInTextMode(request: IGenerateRequest): void {
    this.outputCode = '';
    this.converting = true;
    this.httpScv.post(CONVERSION_URL, { from: request.from, to: request.to, input: this.inputCode })
      .subscribe((res: IHttpResponse) => {
        console.log(res);
        if (res.success) {
          if (res.data?.errorMessage || res.data?.errorType) {
            this.openSnackBar(res.data?.errorType + (res.data?.errorType ? ' : ' : '') + res.data?.errorMessage, 4000);
          } else {
            this.outputCode = res.data.output;
            this.astData = res.data.ast;
            this.parseSummary(res.data.summary);
            this.editInput = false;
            this.converted = true;
            this.openSnackBar('Code translated successfully !!');
          }
        } else {
          this.outputCode = '';
          this.openSnackBar('Code translation failed !!', 4000);
        }
        this.converting = false;
      });
  }
  
  getMaxSummaryProbability(summary: any[]): any {
    let summaryProbability = 0.0;

    for (let i = 0; i < summary.length; i++) {
      if (summary[i].probability > summaryProbability) {
        summaryProbability = summary[i].probability;
      }
    }

    return summaryProbability;
  }

  parseSummary(summary: any[]): void {
    this.summaryProbability = 0;
    for (let j = 0; j < this.summary.length; j++)
      this.summary.pop();

    if (summary && summary.length > 0) {
      this.summary = summary;
      for (let i = 0; i < summary.length; i++) {
        if (summary[i].probability > this.summaryProbability) {
          this.summaryProbability = summary[i].probability;
        }
      }
    } else {
      this.summaryProbability = 0;
    }
  }

  inputModeChanged($event: string): void {
    this.mode = $event;
  }

  inputFileNodeChanged($event: any): void {
    this.inputFileNode = $event;
    this.outputFileNode = {};
  }

  inputCodeEditChange(): void {
    this.editInput = true;
  }

  inputCodeChange(code: string): void {
    if (this.inputCode != code) {
      this.inputCode = code;
      this.converted = false;
    }
  }

  openSnackBar(message: string, delay: number = 2000) {
    this._snackBar.open(message, 'OK', {
      duration: delay,
    });
  }
}
