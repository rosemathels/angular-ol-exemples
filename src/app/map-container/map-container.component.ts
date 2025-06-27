import { Component, type OnInit } from '@angular/core'
import { Map, View } from 'ol'
import { Tile as TileLayer  } from 'ol/layer'
import { XYZ } from 'ol/source'
import { MapComponent } from '../map/map.component'
import { fromLonLat, transformExtent } from 'ol/proj'

@Component({
  selector: 'app-map-container',
  templateUrl: './map-container.component.html',
  styleUrls: ['./map-container.component.scss'],
  imports: [MapComponent]
})
export class MapContainerComponent implements OnInit {
  map: Map

  ngOnInit(): void {
    const positron = new TileLayer({
      source: new XYZ({
        url: 'http://basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png'
      })
    })

    // const osm = new TileLayer({ source: new OSM() })

    this.map = new Map({
      view: new View({
        center: fromLonLat([1.91, 46.30]),
        zoom: 5
      }),
      layers: [positron]
    })
  }

  currentZoom: number | undefined

  displayZoom (): void {
    this.currentZoom = this.map.getView().getZoom()
  }

  zoomPlus1 (): void {
    this.map.getView().adjustZoom(1)
  }

  resetZoom (): void {
    this.map.getView().setZoom(5)
  }

  rotate45 (): void {
    this.map.getView().adjustRotation(-45 * Math.PI / 180)
  }

  animate (): void {
    this.map.getView().animate({
      center: fromLonLat([7.4458, 46.95]),
      zoom: 4,
      duration: 1000
    })
  }

  fit (): void {
    this.map.getView().fit(transformExtent([-2, 40, 20, 49], 'EPSG:4326', 'EPSG:3857'), { duration: 1000 })
  }
}
