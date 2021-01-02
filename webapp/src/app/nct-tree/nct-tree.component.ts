import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { ITreeNode } from "./nct-tree.model";

@Component({
    selector: 'nct-tree',
    templateUrl: './nct-tree.component.html',
    styleUrls: ['./nct-tree.component.css']
})
export class NCTTreeComponent implements OnInit {
    @Input() rootNode: ITreeNode = {};
    @Input() expanded: boolean = false;
    @Input() active: boolean = false;
    @Output() nodeSelected: EventEmitter<ITreeNode> = new EventEmitter();

    ngOnInit() {
    }

    getIcon(): string {
        if(!this.rootNode.childs) {
            if(this.active)
                return 'double_arrow';

            return 'description';
        }

        if (this.expanded)
            return 'folder_open';
        return 'folder';
    }

    expandTree(): void {
        if (this.rootNode.childs)
            this.expanded = !this.expanded;
    }

    selectNode(node: ITreeNode): void {
        this.active = true;
        if (this.rootNode.childs)
            this.expandTree();
        else
            this.nodeSelected.emit(node);
    }

    childNodeSelected($event: ITreeNode) {
        for (let i = 0; i < this.rootNode.childs.length; i++) {
            if (this.rootNode.childs[i].name === $event.name) {
                this.rootNode.childs[i].active = true;
                this.nodeSelected.emit(this.rootNode.childs[i]);
            } else {
                this.rootNode.childs[i].active = false;
            }
        }
    }   
}