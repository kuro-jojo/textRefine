import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-word-counter',
  templateUrl: './word-counter.component.html',
})
export class WordCounterComponent {
  @Input() wordCount: number = 0;
  @Input() charCount: number = 0;

  get wordCountText(): string {
    return `${this.wordCount} ${this.wordCount === 1 ? 'word' : 'words'}`;
  }

  get charCountText(): string {
    return `${this.charCount} ${this.charCount === 1 ? 'character' : 'characters'}`;
  }
}
