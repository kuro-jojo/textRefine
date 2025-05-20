import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VocabularyResult, SophisticationLevel, WordFrequencyGroup } from '../../_models/evaluation';

@Component({
  selector: 'app-result',
  imports: [CommonModule],
  templateUrl: './result.component.html',
  styleUrl: './result.component.css'
})
export class ResultComponent {
  overallScore = 88;
  overallScoreText = 'Strong';

  vocabulary: VocabularyResult = {
    score: 0.891,
    sophistication: {
      score: 0.688,
      word_count: 5,
      common_count: 1,
      mid_count: 1,
      rare_count: 2,
      level: SophisticationLevel.ADVANCED,
      breakdown: [
        { group: WordFrequencyGroup.COMMON, words: ['light'] },
        { group: WordFrequencyGroup.MID, words: ['hello'] },
        { group: WordFrequencyGroup.RARE, words: ['propagation', 'gibberish'] },
        { group: WordFrequencyGroup.UNKNOWN, words: ['aworldd'] }
      ]
    },
    precision: {
      score: 1.0,
      word_count: 16,
      normalized_penalty: 0.0,
      issues: [],
      breakdown: [],
      original_text: ''
    },
    lexical_diversity: {
      ttr: 1.0,
      word_count: 5,
      unique_count: 5
    }
  };

}
