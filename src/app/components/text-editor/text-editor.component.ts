import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidatorFn, AbstractControl } from '@angular/forms';
import { Editor, toDoc, Toolbar, Validators } from 'ngx-editor';
import { EvaluationService } from '../../services/evaluation.service';
import { EvaluationGlobalScore } from '../../models/evaluation';
import { EditorContent, RawTextResult } from '../../models/editor';
import { NgxEditorComponent, NgxEditorMenuComponent } from 'ngx-editor';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { WordCounterComponent } from '../word-counter/word-counter.component';
import { EvaluationResultService } from '../../services/evaluation-result.service';

@Component({
    selector: 'app-text-editor',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        WordCounterComponent,
        NgxEditorComponent,
        NgxEditorMenuComponent
    ],
    templateUrl: './text-editor.component.html',
    styleUrls: ['./text-editor.component.css']
})
export class TextEditorComponent implements OnInit {
    editor: Editor = new Editor({
        history: true
    });
    toolbar: Toolbar = [
        ['bold', 'italic'],
        [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
        ['text_color'],
        ['align_left', 'align_center', 'align_right', 'align_justify'],
        ['horizontal_rule', 'format_clear'],
        ['undo', 'redo'],
    ];
    error: string = '';

    // Custom validator for minimum words
    private minWordsValidator(minWords: number): ValidatorFn {
        return (control: AbstractControl) => {
            const value = control.value as string;
            if (!value) {
                return null;
            }
            const words = value.trim().split(/\s+/).filter((word: string) => word.length > 0);
            return words.length >= minWords ? null : { minWords: { required: minWords, actual: words.length } };
        };
    }

    form = new FormGroup({
        editorContent: new FormControl('', [Validators.required(), this.minWordsValidator(100)])
    });

    wordCount: number = 0;
    charCount: number = 0;
    isEvaluating: boolean = false;
    progress: number = 0;
    currentStep: string = '';
    steps: string[] = [
        'Evaluating precision...',
        'Checking correctness...',
        'Analyzing style...',
        'Calculating scores...',
        'Finalizing results...'
    ];

    constructor(
        private evaluationService: EvaluationService,
        private router: Router,
        private evaluationResultService: EvaluationResultService
    ) {
    }

    ngOnInit(): void {
        this.form.get('editorContent')!.valueChanges.subscribe((value) => {
            this.updateCounts(value || '');
        });
    }

    updateCounts(content: string): void {
        // Split content into paragraphs and clean each paragraph
        const paragraphs = content.split('</p>').map(p => {
            // Remove HTML tags from paragraph
            const text = p.replace(/<[^>]*>/g, '');
            // Split paragraph into words
            return text.trim().split(/\s+/).filter(Boolean);
        });

        // Flatten array of paragraphs and count words
        const words = paragraphs.flat();
        const text = content.replace(/<[^>]*>/g, '');
        const chars = text.replace(/\s/g, ''); // Remove all whitespace

        this.wordCount = words.length;
        this.charCount = chars.length;
    }

    onSubmit(): void {
        if (!this.form.value.editorContent || this.charCount === 0) {
            console.error('No content provided');
            this.error = 'No content provided';
            this.isEvaluating = false;
            return;
        }
        this.error = '';

        this.isEvaluating = true;
        this.progress = 0;
        this.currentStep = 'Initializing evaluation...';

        // Start tracking progress based on elapsed time
        const startTime = Date.now();
        const progressInterval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            // Update progress based on elapsed time (capped at 95%)
            this.progress = Math.min(95, Math.floor((elapsed / 2000) * 100)); // 2 seconds per 100%

            // Update the current step based on progress
            const currentStepIndex = Math.floor(this.progress / (100 / this.steps.length));
            this.currentStep = this.steps[currentStepIndex];
        }, 100); // Update every 100ms

        const { text: rawText, lengthTable } = this.getRawText(this.form.value.editorContent!);
        this.evaluationService.evaluateText(rawText).subscribe(
            {
                next: (response: EvaluationGlobalScore) => {
                    console.log(response);
                    // Ensure progress bar animation is visible
                    setTimeout(() => {
                        clearInterval(progressInterval);
                        this.isEvaluating = false;
                        this.progress = 100;
                        this.currentStep = 'Evaluation complete!';
                        this.evaluationResultService.setEvaluationResult(response);
                        this.evaluationResultService.setRawText(rawText);
                        this.router.navigate(['/result']);
                    }, 3000);
                },
                error: (error) => {
                    if (error.status === 0) {
                        console.error('No connection to server');
                        this.error = 'Evaluation failed. Please try again.';
                        this.currentStep = 'Evaluation failed. Please try again.';
                    } else {
                        console.error(error.error.detail);
                        this.error = error.error.detail;
                        this.currentStep = 'Evaluation failed. Please try again.';
                    }
                    setTimeout(() => {
                        clearInterval(progressInterval);
                        this.isEvaluating = false;
                        this.progress = 0;
                    }, 2000);
                }
            }
        );
    }

    getRawText(htmlContent: string): RawTextResult {
        const jsonData = toDoc(htmlContent);
        if (!jsonData?.['content']) {
            console.error('Invalid JSON data structure');
            return { text: '', lengthTable: [] };
        }

        const content = jsonData['content'] as Array<EditorContent['content'][number]>;
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

    ngOnDestroy() {
        this.editor.destroy();
    }
}
