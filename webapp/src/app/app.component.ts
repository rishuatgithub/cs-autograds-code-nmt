import { Component, OnInit } from '@angular/core';

import { IGenerateRequest } from "./app.model";
import { AppService } from "./app.service";
import { ILanguage } from "./options/options.model";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  inputCode: string = '';
  inputLanguage: ILanguage;

  outputCode: string = '';
  outputLanguage: ILanguage;
  highlightCode: string[] = [];

  constructor(private appSvc: AppService) {
  }

  ngOnInit() {
    this.appSvc.inputLanguageChangeEvent.subscribe((lang: ILanguage) => {
      if(lang?.name !== this.inputLanguage?.name) {
        this.inputLanguage = lang;
        this.inputCode = '';
        this.outputCode = '';
      }
    });
    this.appSvc.outputLanguageChangeEvent.subscribe((lang: ILanguage) => {
      if(lang?.name != this.outputLanguage?.name) {
        this.outputLanguage = lang;
        this.outputCode = '';
        if (this.highlightCode.length > 0)
          this.highlightCode.pop();
        if (lang.highlightCode)
          this.highlightCode.push(lang.highlightCode);
      }
    });
    this.appSvc.codeGenerateRequestEvent.subscribe((request: IGenerateRequest) => {
      this.outputCode = '';
      // http call 
      this.outputCode = `def countFromArray(target, array):
      count = 0
      for str in array:
        if target==str:
          count+=1
      return count`;
      this.appSvc.displayAst('');
    });
  }

  inputCodeChange(code: string): void {
    this.inputCode = code;
  }
}
