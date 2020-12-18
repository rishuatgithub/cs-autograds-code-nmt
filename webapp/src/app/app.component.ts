import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { IGenerateRequest } from "./app.model";
import { AppService } from "./app.service";
import { ILanguage } from "./options/options.model";
import { HttpService, IHttpResponse } from "./http/index";

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

  constructor(private appSvc: AppService, private httpScv: HttpService, private _snackBar: MatSnackBar) {
  }

  ngOnInit() {
    this.appSvc.inputLanguageChangeEvent.subscribe((lang: ILanguage) => {
      if(lang?.name !== this.inputLanguage?.name) {
        this.setInputLanguage(lang);        
      }
    });
    this.appSvc.outputLanguageChangeEvent.subscribe((lang: ILanguage) => {
      if(lang?.name != this.outputLanguage?.name) {
        this.setOutputLanguage(lang);
      }
    });
    this.appSvc.codeGenerateRequestEvent.subscribe((request: IGenerateRequest) => {
      if(this.inputCode.trim() === '') {
        this.openSnackBar('Provide Input code !!', 1200);
      } else {
        if (!this.converted) {
          this.convertCode(request);
        } else {
          this.openSnackBar('Code already translated !!', 1200);
        }
      }
    });
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

  convertCode(request: IGenerateRequest): void {
    this.outputCode = '';
    this.converting = true;
    this.httpScv.post(CONVERSION_URL, { input: this.inputCode })
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
