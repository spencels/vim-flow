import { Directive, Inject, Input, ElementRef, OnChanges } from '@angular/core'

@Directive({
    selector: '[focus]'
})
export class FocusDirective implements OnChanges {
    @Input() focus: boolean;

    constructor(@Inject(ElementRef) private element: ElementRef) {}
    ngOnChanges() {
        if (this.focus) {
          this.element.nativeElement.focus()
          this.element.nativeElement.select()
        }
    }
}
