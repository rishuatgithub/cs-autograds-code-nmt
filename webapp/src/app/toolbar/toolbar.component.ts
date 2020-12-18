import { Component } from "@angular/core";
import { MatDialog } from '@angular/material/dialog';
import { AboutComponent } from "../about/about.component";

@Component({
    selector: 'toolbar',
    templateUrl: './toolbar.component.html'
})
export class ToolbarComponent {

    constructor(public dialog: MatDialog) { }

    openAbout(): void {
        this.dialog.open(AboutComponent);
    }
}