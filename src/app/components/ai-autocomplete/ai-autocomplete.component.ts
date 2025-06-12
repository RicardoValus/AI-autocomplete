import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Pipeline, pipeline } from '@xenova/transformers';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

// Configuração do Transformers.js
Pipeline.allowLocalModels = false;
Pipeline.allowRemoteModels = true;

@Component({
  selector: 'app-ai-autocomplete',
  templateUrl: './ai-autocomplete.component.html',
  styleUrls: ['./ai-autocomplete.component.scss']
})
export class AiAutocompleteComponent implements OnInit {
  textInput = new FormControl('');
  suggestions: string[] = [];
  private model: any;
  isModelLoading = false;
  loadingProgress = 0;

  constructor() {}

  async ngOnInit() {
    this.loadModel();
    this.setupTextInputListener();
  }

  private async loadModel() {
    try {
      this.isModelLoading = true;
      this.loadingProgress = 0;
      
      // Carregando o modelo GPT-2 para geração de texto
      this.model = await pipeline('text-generation', 'Xenova/gpt2', {
        quantized: true,
        progress_callback: (progress: number) => {
          if (typeof progress === 'number' && !isNaN(progress)) {
            this.loadingProgress = Math.round(progress * 100);
            console.log(`Carregando modelo: ${this.loadingProgress}%`);
          }
        }
      });
      
      this.isModelLoading = false;
      this.loadingProgress = 100;
    } catch (error) {
      console.error('Erro ao carregar o modelo:', error);
      this.isModelLoading = false;
      this.loadingProgress = 0;
    }
  }

  private setupTextInputListener() {
    this.textInput.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(async (text) => {
        if (text && text.length > 0) {
          await this.generateSuggestions(text);
        } else {
          this.suggestions = [];
        }
      });
  }

  private async generateSuggestions(text: string) {
    if (!this.model || this.isModelLoading) return;

    try {
      // Gerando múltiplas sugestões usando chamadas separadas
      const suggestions = await Promise.all([
        this.model(text, {
          max_length: 50,
          num_return_sequences: 1,
          temperature: 0.7,
          do_sample: true
        }),
        this.model(text, {
          max_length: 50,
          num_return_sequences: 1,
          temperature: 0.8,
          do_sample: true
        }),
        this.model(text, {
          max_length: 50,
          num_return_sequences: 1,
          temperature: 0.9,
          do_sample: true
        })
      ]);

      this.suggestions = suggestions.map(result => result[0].generated_text);
    } catch (error) {
      console.error('Erro ao gerar sugestões:', error);
    }
  }

  selectSuggestion(suggestion: string) {
    this.textInput.setValue(suggestion);
    this.suggestions = [];
  }
}
