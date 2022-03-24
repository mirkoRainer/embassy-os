import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  OnInit,
} from '@angular/core'

@Directive({
  selector: '[maskInput]',
})
export class MaskInputDirective implements OnInit {
  // @Input() unmasked: boolean

  constructor(private elementRef: ElementRef) {}

  ngOnInit(): void {
    this.elementRef.nativeElement.value = this.transform(
      this.elementRef.nativeElement.value,
    )
  }

  transform(val: string, max = 16): string {
    if (!val) return val
    const times = val.length <= max ? val.length : max
    return '●'.repeat(times)
  }

  @HostListener('keypress', ['$event'])
  ngOnChanges() {
    this.elementRef.nativeElement.value = this.transform(
      this.elementRef.nativeElement.value,
    )
  }
}
