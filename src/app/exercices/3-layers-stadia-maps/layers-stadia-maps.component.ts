import { Component, OnDestroy, OnInit } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { Map, View } from 'ol'
import { Group as LayerGroup, Tile as TileLayer } from 'ol/layer'
import BaseLayer from 'ol/layer/Base'
import { StadiaMaps } from 'ol/source'
import { MapComponent } from '../../map/map.component'

@Component({
  selector: 'app-layers-stadia-maps',
  templateUrl: './layers-stadia-maps.component.html',
  styleUrls: ['./layers-stadia-maps.component.scss'],
  imports: [
    FormsModule,
    MapComponent
  ]
})
export class LayersStadiaMapsComponent implements OnInit, OnDestroy {
  map: Map

  layers: { [key: string]: BaseLayer } = {
    ['watercolor']: new LayerGroup({
      layers: [
        new TileLayer({ source: new StadiaMaps({ layer: 'stamen_watercolor' }) }),
        new TileLayer({ source: new StadiaMaps({ layer: 'stamen_terrain_labels' }) })
      ]
    }),
    ['dark']: new TileLayer({ source: new StadiaMaps({ layer: 'alidade_smooth_dark' }) }),
    ['toner']: new TileLayer({ source: new StadiaMaps({ layer: 'stamen_toner' }) })
  }

  currentLayer: string = 'watercolor'

  ngOnInit(): void {
    this.map = new Map({
      view: new View({ center: [0, 0], zoom: 2 }),
      layers: [this.layers['watercolor']]
    })
  }

  ngOnDestroy(): void {
    this.map.removeLayer(this.layers[this.currentLayer])
    this.layers = {}
    this.map.setTarget(undefined)
  }

  selectLayer (idLayer: string): void {
    if (idLayer !== this.currentLayer) {
      this.map.removeLayer(this.layers[this.currentLayer])
      this.map.addLayer(this.layers[idLayer])
      this.currentLayer = idLayer
    }
    console.log(this.map.getLayers())
  }
}
