import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MatToolbarModule } from "@angular/material/toolbar";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatTabsModule } from "@angular/material/tabs";
import { MatMenuModule } from "@angular/material/menu";
import { MatTooltipModule } from "@angular/material/tooltip";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HighlightModule, HIGHLIGHT_OPTIONS } from 'ngx-highlightjs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ToolbarComponent } from "./toolbar/toolbar.component";
import { OptionsComponent } from "./options/options.component";
import { CodeGenService } from "./code-generation/code-generation.service";
import { AppService } from "./app.service";
import { InputCodeComponent } from "./input/input-code.component";
import { OutputCodeComponent } from "./output/output-code.component";

@NgModule({
  declarations: [
    AppComponent,
    ToolbarComponent,
    OptionsComponent,
    InputCodeComponent,
    OutputCodeComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTabsModule,
    MatMenuModule,
    MatTooltipModule,
    HighlightModule,
    AppRoutingModule
  ],
  providers: [
    AppService,
    CodeGenService,
    {
      provide: HIGHLIGHT_OPTIONS,
      useValue: {
        coreLibraryLoader: () => import('highlight.js/lib/core'),
        lineNumbersLoader: () => import('highlightjs-line-numbers.js'), // Optional, only if you want the line numbers
        languages: {
          python: () => import('highlight.js/lib/languages/python')
        }
      }
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
