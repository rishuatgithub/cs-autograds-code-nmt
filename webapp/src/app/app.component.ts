import { Component } from '@angular/core';
declare const hljs: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styles: [`
    
  `]
})
export class AppComponent {
  lines:boolean = true;
  languages:string[] = ['python'];
  code: string = '';

  generateCode() {
    this.code = `def countFromArray(target, array):
    count = 0
    for str in array:
      if target==str:
        count+=1
    return count`;
  }

  onHighlight(e:any) {
    hljs.initLineNumbersOnLoad();
  }
}
