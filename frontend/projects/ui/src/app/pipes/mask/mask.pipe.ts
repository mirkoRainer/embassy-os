import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
  name: 'mask',
})
export class MaskPipe implements PipeTransform {
  transform(val: string, max = 16): string {
    console.log(val)
    if (!val) return val
    const times = val.length <= max ? val.length : max
    return '●'.repeat(times)
  }
}
