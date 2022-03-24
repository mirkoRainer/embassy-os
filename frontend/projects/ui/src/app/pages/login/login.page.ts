import { Component } from '@angular/core'
import { LoadingController, getPlatforms } from '@ionic/angular'
import { Subscription } from 'rxjs'
import { ApiService } from 'src/app/services/api/embassy-api.service'
import { AuthService } from 'src/app/services/auth.service'
import { MaskPipe } from 'src/app/pipes/mask/mask.pipe'

@Component({
  selector: 'login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  providers: [MaskPipe],
})
export class LoginPage {
  passwordInput = ''
  passwordOutput = ''
  password = ''
  masked = true
  error = ''
  loader: HTMLIonLoadingElement
  patchConnectionSub: Subscription
  maskedValue = ''

  constructor(
    private readonly authService: AuthService,
    private readonly loadingCtrl: LoadingController,
    private readonly api: ApiService,
    private readonly mask: MaskPipe,
  ) {}

  ngOnDestroy() {
    if (this.loader) {
      this.loader.dismiss()
      this.loader = undefined
    }
    if (this.patchConnectionSub) {
      this.patchConnectionSub.unsubscribe()
    }
  }

  toggleMask() {
    this.masked = !this.masked
  }

  setPassword(newValue) {
    console.log('NEW VALUE :', newValue, 'PW: ', this.password)
    let i = 0
    this.password = newValue
      .split('')
      .map(x => {
        if (x === '●') {
          return this.password[i++]
        }
        return x
      })
      .join('')
    this.passwordOutput = this.mask.transform(this.password)
  }

  async submit() {
    this.error = ''

    this.loader = await this.loadingCtrl.create({
      message: 'Logging in',
      spinner: 'lines',
      cssClass: 'loader',
    })
    await this.loader.present()

    try {
      document.cookie = ''
      await this.api.login({
        password: this.password,
        metadata: { platforms: getPlatforms() },
      })

      this.authService.setVerified()
      this.password = ''
      this.passwordOutput = ''
    } catch (e) {
      this.error = e.code === 34 ? 'Invalid Password' : e.message
    } finally {
      this.loader.dismiss()
    }
  }
}
