import { Component } from '@angular/core'
import { Metrics } from 'src/app/services/api/api.types'
import { ApiService } from 'src/app/services/api/embassy-api.service'
import { pauseFor, ErrorToastService } from '@start9labs/shared'

@Component({
  selector: 'server-metrics',
  templateUrl: './server-metrics.page.html',
  styleUrls: ['./server-metrics.page.scss'],
})
export class ServerMetricsPage {
  loading = true
  going = false
  metrics: Metrics = {}

  constructor(
    private readonly errToast: ErrorToastService,
    private readonly embassyApi: ApiService,
  ) {}

  async ngOnInit() {
    await this.getMetrics()
    let headersCount = 0
    let rowsCount = 0
    Object.values(this.metrics).forEach(groupVal => {
      headersCount++
      Object.keys(groupVal).forEach(_ => {
        rowsCount++
      })
    })
    const height = headersCount * 54 + rowsCount * 50 + 24 // extra 24 for room at the bottom
    const elem = document.getElementById('metricSection')
    elem.style.height = `${height}px`
    this.startDaemon()
    this.loading = false
  }

  ngOnDestroy() {
    this.stopDaemon()
  }

  private async startDaemon(): Promise<void> {
    this.going = true
    while (this.going) {
      const startTime = Date.now()
      await this.getMetrics()
      await pauseFor(4000 - Math.max(Date.now() - startTime, 0))
    }
  }

  private stopDaemon() {
    this.going = false
  }

  private async getMetrics(): Promise<void> {
    try {
      this.metrics = await this.embassyApi.getServerMetrics({})
    } catch (e) {
      this.errToast.present(e)
      this.stopDaemon()
    }
  }

  asIsOrder(a: any, b: any) {
    return 0
  }
}
