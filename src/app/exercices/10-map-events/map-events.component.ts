import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core'
import { Feature, Map, Overlay, View } from 'ol'
import { FeatureLike } from 'ol/Feature'
import { unByKey } from 'ol/Observable'
import { toStringXY } from 'ol/coordinate'
import { EventsKey } from 'ol/events'
import { GeoJSON } from 'ol/format'
import { Geometry } from 'ol/geom'
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer'
import { toLonLat } from 'ol/proj'
import { OSM, Vector as VectorSource } from 'ol/source'
import { getArea } from 'ol/sphere'
import { Fill, Stroke, Style } from 'ol/style'
import { MapComponent } from '../../map/map.component'

@Component({
  selector: 'app-map-events',
  templateUrl: './map-events.component.html',
  styleUrls: ['./map-events.component.scss'],
  imports: [MapComponent]
})
export class MapEventsComponent implements OnInit, OnDestroy {
  map: Map
  overlay: Overlay

  nomPays: string | undefined = undefined
  airePays: number | undefined = undefined
  coordonnees: string | undefined = undefined

  keyClick: EventsKey

  hovered: Feature | undefined

  keyHover: EventsKey

  moving = false

  keyMoveStart: EventsKey
  keyMoveEnd: EventsKey

  osm = new TileLayer({ source: new OSM() })

  countriesLayer = new VectorLayer({
    source: new VectorSource({ url: 'countries.geojson', format: new GeoJSON() })
  })

  constructor (private elementRef: ElementRef) {}

  ngOnInit (): void {
    const basic = new Style({
      stroke: new Stroke({ color: 'black'}),
      fill: new Fill({ color: 'rgba(0, 0, 0, 0)' })
    })
    const highlight = new Style({
      stroke: new Stroke({ color: 'red', width: 3 }),
      fill: new Fill({ color: 'rgba(0, 0, 0, 0)' }),
      zIndex: 2
    })

    this.countriesLayer.setStyle((feature) => feature.get('highlight') ? highlight : basic)

    this.map = new Map({
      view: new View({ center: [0, 0], zoom: 2 }),
      layers: [this.osm, this.countriesLayer]
    })

    this.overlay = new Overlay({
      element: this.elementRef.nativeElement.querySelector('.popup'),
      positioning: 'bottom-center'
    })
    this.map.addOverlay(this.overlay)

    this.keyClick = this.map.on('click', (e) => {
      const position = this.map.getCoordinateFromPixel(e.pixel)
      this.coordonnees = toStringXY(toLonLat(position), 5)
      this.nomPays = undefined
      this.airePays = undefined
      this.map.forEachFeatureAtPixel(e.pixel, (feature) => {
        this.nomPays = feature.get('name')
        this.airePays = Math.floor(getArea(feature.getGeometry() as Geometry) / 1_000_000)
        return true
      }, { hitTolerance: 5 })
      this.overlay.setPosition(position)
    })

    this.keyHover = this.map.on('pointermove', (e) => {
      let hit = false
      this.hovered?.set('highlight', false)
      this.map.forEachFeatureAtPixel(e.pixel, (feature: FeatureLike) => {
        hit = true
        this.hovered = feature as Feature
        this.hovered.set('highlight', true)
        return true
      }, { hitTolerance: 5 })
      const target = e.map.getTarget() as HTMLElement
      target.style.cursor = hit ? 'pointer' : ''
    })

    this.keyMoveStart = this.map.on('movestart', () => this.moving = true)
    this.keyMoveEnd = this.map.on('moveend', () => this.moving = false)
  }

  closeOverlay (): void {
    this.overlay.setPosition(undefined)
  }

  ngOnDestroy(): void {
    this.map.removeLayer(this.osm)
    this.map.removeLayer(this.countriesLayer)
    this.map.removeOverlay(this.overlay)
    unByKey(this.keyClick)
    unByKey(this.keyHover)
    unByKey(this.keyMoveStart)
    unByKey(this.keyMoveEnd)
    this.map.setTarget(undefined)
  }
}
