import { ChangeDetectionStrategy, Component, ElementRef, Input } from '@angular/core'
import { Map } from 'ol'

@Component({
  selector: 'app-map',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MapComponent {
  @Input() map: Map

  constructor (
    private elementRef: ElementRef
  ) {}

  ngOnInit (): void {
    this.map.setTarget(this.elementRef.nativeElement)
  }
}
