import { Component } from '@angular/core'
import { AlertController, LoadingController, ModalController, NavController, ToastController } from '@ionic/angular'
import { ApiService } from 'src/app/services/api/embassy-api.service'
import { ActivatedRoute } from '@angular/router'
import { ErrorToastService } from 'src/app/services/error-toast.service'
import { PatchDbService } from 'src/app/services/patch-db/patch-db.service'
import { GenericInputComponent } from 'src/app/modals/generic-input/generic-input.component'

@Component({
  selector: 'server-show',
  templateUrl: 'server-show.page.html',
  styleUrls: ['server-show.page.scss'],
})
export class ServerShowPage {
  settings: ServerSettings = { }

  constructor (
    private readonly alertCtrl: AlertController,
    private readonly loadingCtrl: LoadingController,
    private readonly modalCtrl: ModalController,
    private readonly toastCtrl: ToastController,
    private readonly errToast: ErrorToastService,
    private readonly embassyApi: ApiService,
    private readonly navCtrl: NavController,
    private readonly route: ActivatedRoute,
    public readonly patch: PatchDbService,
  ) { }

  ngOnInit () {
    this.setButtons()
  }

  async presentAlertRestart () {
    const alert = await this.alertCtrl.create({
      header: 'Confirm',
      message: `Are you sure you want to restart your Embassy?`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Restart',
          handler: () => {
            this.restart()
          },
          cssClass: 'enter-click',
        },
      ],
    })
    await alert.present()
  }

  async presentAlertShutdown () {
    const alert = await this.alertCtrl.create({
      header: 'Warning',
      message: `Embassy will remain off. To power back on, you will need to unplug the device and plug it back in.`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Shutdown',
          handler: () => {
            this.shutdown()
          },
          cssClass: 'enter-click',
        },
      ],
    })
    await alert.present()
  }

  private async restart () {
    const loader = await this.loadingCtrl.create({
      spinner: 'lines',
      message: 'Restarting...',
      cssClass: 'loader',
    })
    await loader.present()

    try {
      await this.embassyApi.restartServer({ })
    } catch (e) {
      this.errToast.present(e)
    } finally {
      loader.dismiss()
    }
  }

  private async shutdown () {
    const loader = await this.loadingCtrl.create({
      spinner: 'lines',
      message: 'Shutting down...',
      cssClass: 'loader',
    })
    await loader.present()

    try {
      await this.embassyApi.shutdownServer({ })
    } catch (e) {
      this.errToast.present(e)
    } finally {
      loader.dismiss()
    }
  }

  private async presentModalEmail (): Promise<void> {
    const { name, description } = emailSpec

    const modal = await this.modalCtrl.create({
      component: GenericInputComponent,
      componentProps: {
        title: name,
        message: description,
        label: name,
        useMask: false,
        nullable: true,
        value: this.patch.data['server-info'].email,
        buttonText: 'Save',
        loadingText: 'Saving',
        submitFn: (email: string) => this.saveEmail(email),
      },
      cssClass: 'alertlike-modal',
    })

    modal.onDidDismiss().then(res => {
      if (res.role === 'success') this.presentToastEmailSent()
    })

    await modal.present()
  }

  private async saveEmail (email: string): Promise<void> {
    await this.embassyApi.updateEmail({ email })
  }

  private async presentToastEmailSent (): Promise<void> {
    const toast = await this.toastCtrl.create({
      header: 'Email Sent!',
      message: 'Check your spam folder and mark as not spam.',
      position: 'bottom',
      duration: 4000,
      cssClass: 'success-toast',
      buttons: [
        {
          side: 'end',
          icon: 'close',
          handler: () => {
            return true
          },
        },
      ],
    })
    await toast.present()
  }

  private setButtons (): void {
    this.settings = {
      'Backups': [
        {
          title: 'Create Backup',
          description: 'Back up your Embassy and all its services',
          icon: 'save-outline',
          action: () => this.navCtrl.navigateForward(['backup'], { relativeTo: this.route }),
          detail: true,
        },
      ],
      'Insights': [
        {
          title: 'About',
          description: 'Basic information about your Embassy',
          icon: 'information-circle-outline',
          action: () => this.navCtrl.navigateForward(['specs'], { relativeTo: this.route }),
          detail: true,
        },
        {
          title: 'Monitor',
          description: 'CPU, disk, memory, and other useful metrics',
          icon: 'pulse',
          action: () => this.navCtrl.navigateForward(['metrics'], { relativeTo: this.route }),
          detail: true,
        },
        {
          title: 'Logs',
          description: 'Raw, unfiltered device logs',
          icon: 'newspaper-outline',
          action: () => this.navCtrl.navigateForward(['logs'], { relativeTo: this.route }),
          detail: true,
        },
      ],
      'Settings': [
        {
          title: 'Preferences',
          description: 'Device name, background tasks',
          icon: 'options-outline',
          action: () => this.navCtrl.navigateForward(['preferences'], { relativeTo: this.route }),
          detail: true,
        },
        {
          title: 'LAN',
          description: 'Access your Embassy on the Local Area Network',
          icon: 'home-outline',
          action: () => this.navCtrl.navigateForward(['lan'], { relativeTo: this.route }),
          detail: true,
        },
        {
          title: 'SSH',
          description: 'Access your Embassy from the command line',
          icon: 'terminal-outline',
          action: () => this.navCtrl.navigateForward(['ssh'], { relativeTo: this.route }),
          detail: true,
        },
        {
          title: 'WiFi',
          description: 'Add or remove WiFi networks',
          icon: 'wifi',
          action: () => this.navCtrl.navigateForward(['wifi'], { relativeTo: this.route }),
          detail: true,
        },
        {
          title: 'Active Sessions',
          description: 'View and manage device access',
          icon: 'desktop-outline',
          action: () => this.navCtrl.navigateForward(['sessions'], { relativeTo: this.route }),
          detail: true,
        },
        {
          title: 'Email',
          description: 'Receive email notifications from your Embassy',
          icon: 'mail-outline',
          action: () => this.presentModalEmail(),
          detail: true,
        },
      ],
      'Power': [
        {
          title: 'Restart',
          description: '',
          icon: 'reload',
          action: () => this.presentAlertRestart(),
          detail: false,
        },
        {
          title: 'Shutdown',
          description: '',
          icon: 'power',
          action: () => this.presentAlertShutdown(),
          detail: false,
        },
      ],
    }
  }

  asIsOrder () {
    return 0
  }
}

interface ServerSettings {
  [key: string]: {
    title: string
    description: string
    icon: string
    action: Function
    detail: boolean
  }[]
}

const emailSpec = {
  type: 'string',
  name: 'Email Address',
  description: 'Enter a valid email address to receive critical alerts from your Embassy. Leave blank to disable email alerts.',
  nullable: true,
  // @TODO regex for SSH Key
  // pattern: '',
  'pattern-description': 'Must be a valid email address',
  masked: false,
  copyable: false,
}
