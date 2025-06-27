import { Component, OnInit, type OnDestroy } from '@angular/core'
import { Map, View } from 'ol'
import { Control, MousePosition, ScaleLine, ZoomSlider, defaults as defaultControls } from 'ol/control'
import { format, Coordinate } from 'ol/coordinate'
import { DragRotateAndZoom, Interaction, defaults as defaultInteractions }  from 'ol/interaction'
import { Tile as TileLayer } from 'ol/layer'
import { OSM } from 'ol/source'
import { MapComponent } from '../../map/map.component'

@Component({
  selector: 'app-controls-interactions',
  templateUrl: './controls-interactions.component.html',
  styleUrls: ['./controls-interactions.component.scss'],
  imports: [MapComponent]
})
export class ControlsInteractionsComponent implements OnInit, OnDestroy {
  map: Map
  osm = new TileLayer({ source: new OSM() })

  zoomSlider: Control = new ZoomSlider()
  dragRotateAndZoom: Interaction = new DragRotateAndZoom()

  ngOnInit(): void {
    const scaleline = new ScaleLine()
    const mousePosition = new MousePosition({
      target: 'id-mouse-position',
      projection: 'EPSG:4326',
      coordinateFormat: (coordonnees: Coordinate | undefined) => coordonnees ? format(coordonnees, '{x}, {y}', 5) : '?'
    })

    this.map = new Map({
      controls: defaultControls().extend([scaleline, mousePosition]),
      interactions: defaultInteractions({ altShiftDragRotate: false }),
      view: new View({ center: [0, 0], zoom: 2 }),
      layers: [this.osm]
    })
  }

  ngOnDestroy(): void {
    this.map.removeLayer(this.osm)
    this.map.setTarget(undefined)
  }

  addZoomSlider (): void {
    this.map.addControl(this.zoomSlider)
  }

  removeZoomSlider (): void {
    this.map.removeControl(this.zoomSlider)
  }

  addDragRotateAndZoom (): void {
    this.map.addInteraction(this.dragRotateAndZoom)
  }

  removeDragRotateAndZoom (): void {
    this.map.removeInteraction(this.dragRotateAndZoom)
  }
}
