import { Component, OnDestroy, OnInit } from '@angular/core'
import { Map, View } from 'ol'
import { Tile as TileLayer  } from 'ol/layer'
import { OSM } from 'ol/source'
import { MapComponent } from '../../map/map.component'

@Component({
  selector: 'app-hello-world',
  templateUrl: './hello-world.component.html',
  styleUrls: ['./hello-world.component.scss'],
  imports: [MapComponent]
})
export class HelloWorldComponent implements OnInit, OnDestroy {
  map: Map
  osm: TileLayer = new TileLayer({ source: new OSM() })

  ngOnInit (): void {
    this.map = new Map({
      view: new View({
        center: [0, 0],
        zoom: 2
      }),
      layers: [this.osm]
    })
  }

  ngOnDestroy (): void {
    this.map.removeLayer(this.osm)
    this.map.setTarget(undefined)
  }
}
