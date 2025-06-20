import { Component, OnInit, HostListener } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidatorFn, AbstractControl } from '@angular/forms';
import { Editor, Toolbar, Validators } from 'ngx-editor';
import { EvaluationService } from '../../services/evaluation.service';
import { EvaluationGlobalScore, EvaluationRequest } from '../../models/evaluation';
import { NgxEditorComponent, NgxEditorMenuComponent } from 'ngx-editor';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { WordCounterComponent } from '../word-counter/word-counter.component';
import { EvaluationResultService } from '../../services/evaluation-result.service';
import { TooltipComponent } from "../tooltip/tooltip.component";

@Component({
    selector: 'app-text-editor',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        WordCounterComponent,
        NgxEditorComponent,
        NgxEditorMenuComponent,
        TooltipComponent
    ],
    templateUrl: './text-editor.component.html',
    styleUrls: ['./text-editor.component.css']
})
export class TextEditorComponent implements OnInit {
    MIN_WORDS = 20;

    audienceOptions: AudienceOption[] = [
        { value: 'children', label: 'Children' },
        { value: 'teenagers', label: 'Teenagers' },
        { value: 'young_adults', label: 'Young Adults' },
        { value: 'general', label: 'General Audience' },
        { value: 'business', label: 'Business/Corporate' },
        { value: 'professional', label: 'Professional/Technical' },
        { value: 'academic', label: 'Academic/Researcher' },
    ];
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
    errors: { [key: string]: string } = {};
    info: string = '';
    errorTimeout: number = 10000;
    
    form = new FormGroup({
        editorContent: new FormControl('', [Validators.required(), this.minWordsValidator(this.MIN_WORDS)]),
        useTopic: new FormControl(false),
        topic: new FormControl({ value: '', disabled: true }),
        enableAudience: new FormControl(false),
        audience: new FormControl({ value: null, disabled: true })
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

    @HostListener('window:keydown', ['$event'])
    handleKeyboardEvent(event: KeyboardEvent): void {
        if (event.ctrlKey && event.key === 'Enter') {
            event.preventDefault();
            this.onSubmit();
        }
    }

    onTopicToggle(event: Event): void {
        const checked = (event.target as HTMLInputElement).checked;
        const topicControl = this.form.get('topic');
        if (checked) {
            topicControl?.enable();
            topicControl?.setValidators([Validators.required()]);
        } else {
            topicControl?.disable();
            topicControl?.clearValidators();
        }
        topicControl?.updateValueAndValidity();
    }

    onAudienceToggle(event: Event): void {
        const checked = (event.target as HTMLInputElement).checked;
        const audienceControl = this.form.get('audience');
        if (checked) {
            audienceControl?.enable();
            audienceControl?.setValidators([Validators.required()]);
        } else {
            audienceControl?.disable();
            audienceControl?.clearValidators();
            audienceControl?.setValue(null);
        }
        audienceControl?.updateValueAndValidity();
    }

    onSubmit(): void {
        this.info = '';

        if (this.isEvaluating) {
            this.info = 'Evaluation is already in progress... Please wait.';
            return;
        }

        if (!this.form.value.editorContent || this.charCount === 0) {
            this.errors = {};
            console.error('No content provided');
            this.errors['emptyContent'] = 'No content provided';
            this.isEvaluating = false;
            this.addTimeout('errorTimeout', () => {
                delete this.errors['emptyContent'];
            }, this.errorTimeout); // 10 seconds
            return;
        } else {
            delete this.errors['emptyContent'];
        }

        if (this.form.invalid) {
            if (this.form.get('topic')!.invalid) {
                if (this.errors['topic'] === '' || this.errors['topic'] === undefined) {
                    this.errors['topic'] = 'The topic option is enabled but no topic is selected';
                    this.addTimeout('topicErrorTimeout', () => {
                        delete this.errors['topic'];
                    }, this.errorTimeout);
                }
            } else {
                delete this.errors['topic'];
            }
            if (this.form.get('audience')!.invalid) {
                if (this.errors['audience'] === '' || this.errors['audience'] === undefined) {
                    this.errors['audience'] = 'The audience option is enabled but no audience is selected';
                    this.addTimeout('audienceErrorTimeout', () => {
                        delete this.errors['audience'];
                    }, this.errorTimeout);
                }
            } else {
                delete this.errors['audience'];
            }
            if (this.form.get('editorContent')!.invalid) {
                if (this.errors['editorContent'] === '' || this.errors['editorContent'] === undefined) {
                    this.errors['editorContent'] = 'Make sure you have at least 20 words in the text.';
                    this.addTimeout('editorContentErrorTimeout', () => {
                        delete this.errors['editorContent'];
                    }, this.errorTimeout);
                }
            } else {
                delete this.errors['editorContent'];
            }
            this.isEvaluating = false;
            return;
        }

        this.isEvaluating = true;
        this.progress = 0;
        this.currentStep = '🔍 Initializing evaluation...';

        // Start tracking progress based on elapsed time
        const progressInterval = this.setProgession();
        const editorContent = this.form.value.editorContent;
        const request: EvaluationRequest = {
            text: editorContent,
            topic: this.form.value.topic || undefined,
            audience: this.form.value.enableAudience ? (this.form.value.audience || undefined) : undefined
        };

        this.evaluationService.evaluateText(request).subscribe(
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
                    let errorMessage;

                    if (error.status === 0) {
                        errorMessage = 'Evaluation failed. Cannot connect to server. Please try again.';
                    } else if (error.error) {
                        if (error.error.detail) {
                            errorMessage = error.error.detail;
                        } else {
                            errorMessage = error.error;
                        }
                    } else {
                        errorMessage = 'Evaluation failed. Please try again.';
                    }
                    console.error(error, errorMessage);
                    // Add error cleanup timeout
                    this.addTimeout('errorCleanup', () => {
                        clearInterval(progressInterval);
                        this.currentStep = '❌ Evaluation failed. Please try again in a few seconds.';
                        this.progress = 0;
                    }, 2000);

                    this.addTimeout('errorStep', () => {
                        this.errors['errorStep'] = errorMessage;
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

    private timeouts: { [key: string]: ReturnType<typeof setTimeout> } = {};

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


    // Custom validator for minimum words
    private minWordsValidator(minWords: number): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } | null => {
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


interface AudienceOption {
    value: string;
    label: string;
}