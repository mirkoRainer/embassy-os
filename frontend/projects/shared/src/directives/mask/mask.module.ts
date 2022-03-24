import { NgModule } from '@angular/core'

import { MaskInputDirective } from './mask.directive'

@NgModule({
  declarations: [MaskInputDirective],
  exports: [MaskInputDirective],
})
export class MaskInputModule {}
