import { TestBed, async } from '@angular/core/testing';
import { MaterialModule } from '@angular/material'

import { AppComponent } from './app.component';
import { FlowComponent } from 'app/components/flow.component';
import { ArgumentComponent } from 'app/components/argument.component'
import { FocusDirective } from 'app/directives/focus'

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
      FlowComponent,
      ArgumentComponent,
      FocusDirective
      ],
      imports: [
        MaterialModule
      ]
    }).compileComponents();
  }));

  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
});
