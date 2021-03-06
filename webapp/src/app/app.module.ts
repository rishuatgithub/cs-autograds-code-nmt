import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from "@angular/common/http";

import { ClipboardModule } from '@angular/cdk/clipboard';
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
import { MatDialogModule } from "@angular/material/dialog";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatRippleModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HighlightModule, HIGHLIGHT_OPTIONS } from 'ngx-highlightjs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ToolbarComponent } from "./toolbar/toolbar.component";
import { OptionsComponent } from "./options/options.component";
import { AppService } from "./app.service";
import { InputCodeComponent, GitCloneDialog } from "./input/input-code.component";
import { OutputCodeComponent, AstOutputDialog } from "./output/output-code.component";
import { AboutComponent, InferenceArchComponent, HelpComponent } from "./about/about.component";
import { StatusComponent } from "./status/status.component";
import { HttpService } from './http';
import { NCTTreeComponent } from "./nct-tree/nct-tree.component";

@NgModule({
  declarations: [
    AppComponent,
    ToolbarComponent,
    OptionsComponent,
    InputCodeComponent,
    OutputCodeComponent,
    AboutComponent,
    StatusComponent,
    NCTTreeComponent,
    GitCloneDialog,
    AstOutputDialog,
    InferenceArchComponent,
    HelpComponent
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
    MatDialogModule,
    MatSnackBarModule,
    MatRippleModule,
    MatProgressSpinnerModule,
    MatSlideToggleModule,
    HighlightModule,
    HttpClientModule,
    ClipboardModule,
    AppRoutingModule
  ],
  providers: [
    AppService,
    HttpService,
    {
      provide: HIGHLIGHT_OPTIONS,
      useValue: {
        coreLibraryLoader: () => import('highlight.js/lib/core'),
        lineNumbersLoader: () => import('highlightjs-line-numbers.js'), // for line numbers
        languages: {
          python: () => import('highlight.js/lib/languages/python'),
          java: () => import('highlight.js/lib/languages/java'),
          perl: () => import('highlight.js/lib/languages/perl'),
          cpp: () => import('highlight.js/lib/languages/cpp'),
          csharp: () => import('highlight.js/lib/languages/csharp'),
          vbnet: () => import('highlight.js/lib/languages/vbnet')
        }
      }
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
