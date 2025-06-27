import { Component, OnDestroy, OnInit } from '@angular/core'
import { Map, View } from 'ol'
import { Tile as TileLayer } from 'ol/layer'
import { fromLonLat, transformExtent } from 'ol/proj'
import { OSM } from 'ol/source'
// import proj4 from 'proj4'
// import { register } from 'ol/proj/proj4'
import { MapComponent } from '../../map/map.component'

@Component({
  selector: 'app-manipuler-view',
  templateUrl: './manipuler-view.component.html',
  styleUrls: ['./manipuler-view.component.scss'],
  imports: [MapComponent]
})
export class ManipulerViewComponent implements OnInit, OnDestroy {
  map: Map
  view : View
  osm: TileLayer = new TileLayer({ source: new OSM() })

  ngOnInit(): void {
    /* proj4.defs("EPSG:2154","+proj=lcc +lat_0=46.5 +lon_0=3 +lat_1=49 +lat_2=44 +x_0=700000 +y_0=6600000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs");
    register(proj4) */

    this.view = new View({
      center: fromLonLat([1.91, 46.30]),
      zoom: 5,
      constrainRotation: 4,
      maxZoom: 4,
      // projection: 'EPSG:2154'
    })

    this.map = new Map({
      view: this.view,
      layers: [this.osm],
      
    })
  }

  ngOnDestroy(): void {
    this.map.removeLayer(this.osm)
    this.map.setTarget(undefined)
  }

  currentZoom: number | undefined

  displayZoom (): void {
    this.currentZoom = this.view.getZoom()
  }

  zoomPlus1 (): void {
    this.view.adjustZoom(1)
  }

  resetZoom (): void {
    this.view.setZoom(5)
    this.view.setCenter(fromLonLat([1.91, 46.30]))
  }

  rotate45 (): void {
    this.view.adjustRotation(-45 * Math.PI / 180)
  }

  animate (): void {
    this.view.animate({
      center: fromLonLat([7.4458, 46.95]),
      zoom: 4,
      duration: 1000
    })
  }

  fit (): void {
    this.view.fit(transformExtent([-2, 40, 20, 49], 'EPSG:4326', 'EPSG:3857'), { duration: 1000 })
  }
}
