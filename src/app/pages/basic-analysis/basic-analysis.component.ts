import { Component, OnInit } from '@angular/core';
import { TextEditorComponent } from '../../components/text-editor/text-editor.component';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [TextEditorComponent],
    templateUrl: './basic-analysis.component.html',
})
export class BasicAnalysisComponent implements OnInit {
    wordCount = 0;
    charCount = 0;
    editorContent = 'Start typing or paste your text here for analysis...';
    isInfoExpanded = false;

    constructor() {
    }

    ngOnInit(): void {
        this.setupEventListeners();
    }

    private setupEventListeners(): void {
        // Toggle info section
        const infoHeader = document.getElementById("info-header");
        if (infoHeader) {
            infoHeader.addEventListener("click", () => this.toggleInfo());
        }
    }

    private toggleInfo(): void {
        const content = document.getElementById("info-content");
        const icon = document.getElementById("toggle-icon");

        if (content && icon) {
            this.isInfoExpanded = !this.isInfoExpanded;
            content.classList.toggle("hidden", !this.isInfoExpanded);
            icon.classList.toggle("fa-chevron-down", !this.isInfoExpanded);
            icon.classList.toggle("fa-chevron-up", this.isInfoExpanded);
        }
    }

}
