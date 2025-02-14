import { Component, Input } from '@angular/core'
import {
  PrimaryRendering,
  PrimaryStatus,
  StatusRendering,
} from 'src/app/services/pkg-status-rendering.service'

@Component({
  selector: 'status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.scss'],
})
export class StatusComponent {
  PS = PrimaryStatus
  PR = PrimaryRendering

  @Input() rendering: StatusRendering
  @Input() size?: string
  @Input() style?: string = 'regular'
  @Input() weight?: string = 'normal'
  @Input() disconnected?: boolean = false
  @Input() installProgress?: number
  @Input() sigtermTimeout?: string
}
