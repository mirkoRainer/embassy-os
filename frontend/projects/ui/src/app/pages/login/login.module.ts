import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { IonicModule } from '@ionic/angular'
import { LoginPage } from './login.page'
import { SharedPipesModule } from '@start9labs/shared'
import { MaskPipeModule } from 'src/app/pipes/mask/mask.module'
import { MaskInputModule } from '../../../../../shared/src/directives/mask/mask.module'
import { NgxMaskModule } from 'ngx-mask'

const routes: Routes = [
  {
    path: '',
    component: LoginPage,
  },
]

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    SharedPipesModule,
    MaskPipeModule,
    MaskInputModule,
    NgxMaskModule,
  ],
  declarations: [LoginPage],
})
export class LoginPageModule {}
