import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AiAutocompleteComponent } from './ai-autocomplete.component';

describe('AiAutocompleteComponent', () => {
  let component: AiAutocompleteComponent;
  let fixture: ComponentFixture<AiAutocompleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AiAutocompleteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AiAutocompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
