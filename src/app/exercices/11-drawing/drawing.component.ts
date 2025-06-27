import { Component, OnDestroy, OnInit } from '@angular/core'
import { Collection, Map, View, Feature } from 'ol'
import { unByKey } from 'ol/Observable'
import { EventsKey } from 'ol/events'
import { Draw, Modify, Snap } from 'ol/interaction'
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer'
import { OSM, Vector as VectorSource } from 'ol/source'
import { Circle, Fill, Stroke, Style } from 'ol/style'
import { MapComponent } from '../../map/map.component'

@Component({
  selector: 'app-drawing',
  templateUrl: './drawing.component.html',
  styleUrls: ['./drawing.component.scss'],
  imports: [MapComponent]
})
export class DrawingComponent implements OnInit, OnDestroy {
  map: Map
  draw: Draw
  modify: Modify
  snap: Snap

  drawing = false
  feature: Feature

  styleCouche = new Style({
    stroke: new Stroke({ color: 'orange', width: 3 }),
    fill: new Fill({ color: 'rgba(255, 255, 255, 0.3)' })
  })
  styleDessin = new Style({
    stroke: new Stroke({ color: 'white', width: 2, lineDash: [5, 10] }),
    image: new Circle({
      radius: 5,
      fill: new Fill({ color: 'orange' }),
      stroke: new Stroke({ color: 'white', width: 1 })
    })
  })

  osm = new TileLayer({ source: new OSM() })
  vectorSource = new VectorSource({})
  vectorLayer = new VectorLayer({ source: this.vectorSource, style: this.styleCouche })

  keyClick: EventsKey
  keyHover: EventsKey

  ngOnInit(): void {
    this.map = new Map({
      view: new View({ center: [0, 0], zoom: 2 }),
      layers: [this.osm, this.vectorLayer]
    })

    this.draw = new Draw({ type: 'Polygon', source: this.vectorSource, style: [this.styleCouche, this.styleDessin] })
    this.snap = new Snap({ source: this.vectorSource })

    this.map.addInteraction(this.draw)
    this.draw.setActive(false)
    this.map.addInteraction(this.snap)

    this.keyClick = this.map.on('click', (e) => {
      if (!this.drawing) {
        if (this.modify) {
          this.feature.setStyle(undefined)
          this.map.removeInteraction(this.modify)
        }
  
        this.map.forEachFeatureAtPixel(e.pixel, (feature) => {
          this.feature = feature as Feature
          this.feature.setStyle([this.styleCouche, this.styleDessin])
          this.modify = new Modify({
            features: new Collection([this.feature]),
            style: [this.styleCouche, this.styleDessin]
          })
          this.map.addInteraction(this.modify)
          this.map.removeInteraction(this.snap)
          this.map.addInteraction(this.snap)
          return true
        }, { hitTolerance: 5 })
      }
    })

    this.keyHover = this.map.on('pointermove', (e) => {
      let hit = false
        this.map.forEachFeatureAtPixel(e.pixel, (feature) => {
        hit = true
        return true
      }, { hitTolerance: 5 })
      const target = e.map.getTarget() as HTMLElement
      target.style.cursor = hit ? 'pointer' : ''
    })
  }

  ngOnDestroy(): void {
    this.map.removeLayer(this.osm)
    this.map.removeLayer(this.vectorLayer)
    unByKey(this.keyClick)
    unByKey(this.keyHover)
    this.map.setTarget(undefined)
  }

  startDrawing (): void {
    if (this.modify) {
      this.feature.setStyle(undefined)
      this.map.removeInteraction(this.modify)
    }
    this.draw.setActive(true)
    this.drawing = true
  }

  stopDrawing (): void {
    this.draw.setActive(false)
    this.drawing = false
  }
}
