import { Component, OnInit, OnDestroy } from '@angular/core';
import { Editor, NgxEditorComponent, NgxEditorMenuComponent, toDoc, Toolbar, Validators } from 'ngx-editor';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormGroup, FormControl } from '@angular/forms';
import { EditorContent, RawTextResult } from './editor';
import { EvaluatorService } from '../../_services/evaluator.service';
import { EvaluationGlobalScore } from '../../_models/evaluation';

@Component({
    selector: 'app-editor',
    imports: [NgxEditorComponent, NgxEditorMenuComponent, FormsModule, ReactiveFormsModule],
    templateUrl: './editor.component.html',
    styleUrl: './editor.component.css'
})
export class EditorComponent implements OnInit, OnDestroy {
    editor!: Editor;
    jsonData: Record<string, unknown> | null = null;
    toolbar: Toolbar = [
        ['bold', 'italic'],
        // ['underline', 'strike'],
        [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
        ['text_color'],
        ['align_left', 'align_center', 'align_right', 'align_justify'],
        ['horizontal_rule', 'format_clear'],
        ['undo', 'redo'],
    ];

    form = new FormGroup({
        editorContent: new FormControl('', [Validators.required()]),
    });
    constructor(
        private evaluatorService: EvaluatorService
    ) { }

    ngOnInit(): void {
        this.editor = new Editor();
    }

    ngOnDestroy(): void {
        this.editor.destroy();
    }

    onSubmit(): void {
        if (!this.form.value.editorContent) {
            console.error('No content provided');
            return;
        }
        this.jsonData = toDoc(this.form.value.editorContent);
        const { text: rawText, lengthTable } = this.getRawText();
        this.evaluatorService.evaluateText(rawText).subscribe(
            {
                next: (response: EvaluationGlobalScore) => {
                    console.log(response.correctness.issues);
                },
                error: (error) => {
                    console.error(error.error.detail);
                }
            }
        );
    }

    getRawText(): RawTextResult {
        if (!this.jsonData?.['content']) {
            console.error('Invalid JSON data structure');
            return { text: '', lengthTable: [] };
        }

        const content = this.jsonData['content'] as Array<EditorContent['content'][number]>;
        const lengthTable: number[] = [];
        let rawText = '';
        let currentLength = 0;

        content.forEach((paragraph, index) => {
            const paragraphContent = paragraph['content'] as Array<EditorContent['content'][number]['content'][number]>;
            if (!paragraphContent) {
                console.warn(`Paragraph at index ${index} has no content`);
                lengthTable.push(currentLength);
                rawText += '\n';
                return;
            }

            paragraphContent.forEach((textElement) => {
                if (textElement['text']) {
                    currentLength += textElement['text'].length;
                    rawText += textElement['text'];
                }
            });

            lengthTable.push(currentLength);
            rawText += '\n';
        });

        return { text: rawText, lengthTable };
    }

}