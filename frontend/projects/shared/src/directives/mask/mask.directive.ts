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
  @Input() unmasked: boolean

  constructor(private elementRef: ElementRef) // private ogValue: string
  {}

  ngOnInit(): void {
    this.elementRef.nativeElement.value = this.transform(
      this.elementRef.nativeElement.value,
    )
  }

  transform(val: string, max = 16): string {
    // console.log(this.unmasked, val)
    if (!val) return val
    // if (unmasked) return val
    const times = val.length <= max ? val.length : max
    return '●'.repeat(times)
  }

  @HostListener('ngModelChange', ['$event'])
  ngOnChanges() {
    console.log(this.unmasked, this.elementRef.nativeElement.value)
    // this.ogValue = this.elementRef.nativeElement.value
    this.elementRef.nativeElement.value = this.unmasked
      ? this.elementRef.nativeElement.value
      : this.transform(this.elementRef.nativeElement.value)
  }
}
