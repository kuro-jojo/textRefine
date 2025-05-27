import { Component, OnInit, HostListener } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidatorFn, AbstractControl } from '@angular/forms';
import { Editor, Toolbar, Validators } from 'ngx-editor';
import { EvaluationService } from '../../services/evaluation.service';
import { EvaluationGlobalScore } from '../../models/evaluation';
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
    MIN_WORDS = 20;
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
    info: string = '';

    form = new FormGroup({
        editorContent: new FormControl('', [Validators.required(), this.minWordsValidator(this.MIN_WORDS)])
    });

    wordCount: number = 0;
    charCount: number = 0;
    isEvaluating: boolean = false;
    progress: number = 0;
    currentStep: string = '';
    steps: string[] = [
        '🔍 Evaluating precision...',
        '✅ Checking correctness...',
        '🎨 Analyzing style...',
        '📊 Calculating scores...',
        '✨ Finalizing results...'
    ];

    private timeouts: { [key: string]: ReturnType<typeof setTimeout> } = {};
    private evaluationStartTime: number = 0;

    private clearAllTimeouts(): void {
        Object.values(this.timeouts).forEach(timeout => clearTimeout(timeout));
        this.timeouts = {};
    }

    private addTimeout(key: string, callback: () => void, delay: number): void {
        if (this.timeouts[key]) {
            clearTimeout(this.timeouts[key]);
        }
        this.timeouts[key] = setTimeout(callback, delay);
    }

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

    // Custom validator for minimum words
    private minWordsValidator(minWords: number): ValidatorFn {
        return (control: AbstractControl) => {
            const value = control.value as string;
            if (!value) {
                return null;
            }
            return this.getWordCount(value) >= minWords ?
                null :
                { minWords: { required: minWords, actual: this.getWordCount(value) } };
        };
    }


    private getWordCount(content: string): number {
        const paragraphs = content.split('</p>').map(p => {
            // Remove HTML tags from paragraph
            const text = p.replace(/<[^>]*>/g, '');
            // Split paragraph into words
            return text.trim().split(/\s+/).filter(Boolean);
        });

        // Flatten array of paragraphs and count words
        const words = paragraphs.flat();
        return words.length;
    }

    private updateCounts(content: string): void {
        const words = this.getWordCount(content);
        const text = content.replace(/<[^>]*>/g, '');
        const chars = text.replace(/\s/g, ''); // Remove all whitespace

        this.wordCount = words;
        this.charCount = chars.length;
    }

    @HostListener('window:keydown', ['$event'])
    handleKeyboardEvent(event: KeyboardEvent): void {
        if (event.ctrlKey && event.key === 'Enter') {
            event.preventDefault();
            if (this.isEvaluating) {
                this.info = 'Evaluation in progress... Please wait.';
                return;
            }
            this.onSubmit();
        }
    }

    onSubmit(): void {
        if (!this.form.value.editorContent || this.charCount === 0) {
            console.error('No content provided');
            this.error = 'No content provided';
            this.isEvaluating = false;
            return;
        }
        this.error = '';
        this.info = '';

        this.isEvaluating = true;
        this.progress = 0;
        this.currentStep = '🔍 Initializing evaluation...';
        this.evaluationStartTime = Date.now();

        // Start tracking progress based on elapsed time
        const progressInterval = this.setProgession();
        const editorContent = this.form.value.editorContent;
        this.evaluationService.evaluateText(editorContent).subscribe(
            {
                next: (response: EvaluationGlobalScore) => {
                    // Add cleanup timeout
                    this.addTimeout('cleanup', () => {
                        this.currentStep = '🎉 Evaluation complete!';
                        clearInterval(progressInterval);
                        this.progress = 100;
                    }, 2000);

                    // Add navigation timeout
                    this.addTimeout('navigate', () => {
                        this.isEvaluating = false;
                        this.evaluationResultService.setEvaluationResult(response);
                        this.evaluationResultService.setEditorContent(editorContent);
                        this.router.navigate(['/result']);
                    }, 3000);
                },
                error: (error) => {
                    const errorMessage = error.status === 0
                        ? 'Evaluation failed. Cannot connect to server. Please try again.'
                        : error.error.detail;

                    console.error(errorMessage);
                    // Add error cleanup timeout
                    this.addTimeout('errorCleanup', () => {
                        clearInterval(progressInterval);
                        this.currentStep = '❌ Evaluation failed. Please try again in a few seconds.';
                        this.progress = 0;
                    }, 2000);
                    
                    this.addTimeout('errorStep', () => {
                        this.error = errorMessage;
                        this.info = '';
                        this.isEvaluating = false;
                    }, 3000);
                }
            }
        );

        // Add a timeout to check if evaluation is taking too long
        this.addTimeout('longEvaluation', () => {
            if (this.progress < 100 && this.isEvaluating) {
                this.currentStep = '⏳ Taking longer than expected... Please wait.';
            }
        }, 5000); // Check after 5 seconds
    }

    private setProgession() {
        const startTime = Date.now();
        const progressInterval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            // Update progress based on elapsed time (capped at 100%)
            this.progress = Math.min(95, Math.floor((elapsed / 2000) * 100)); // 2 seconds per 100%

            // Update the current step based on progress
            const progressPerStep = 100 / this.steps.length;
            const currentStepIndex = Math.floor(this.progress / progressPerStep);
            this.currentStep = this.steps[currentStepIndex];

            // Clear interval when progress reaches 100%
            if (this.progress >= 95) {
                clearInterval(progressInterval);
            }
        }, 200); // Update every 500ms for smoother transitions

        return progressInterval;
    }

    ngOnDestroy() {
        this.editor.destroy();
        this.clearAllTimeouts();
    }
}
