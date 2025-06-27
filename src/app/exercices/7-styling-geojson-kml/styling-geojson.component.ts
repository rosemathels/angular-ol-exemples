import { Component, type OnInit } from '@angular/core'
import { Map, View } from 'ol'
import { GeoJSON, KML } from 'ol/format'
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer'
import { OSM, Vector as VectorSource } from 'ol/source'
import { Circle, Fill, Stroke, Style } from 'ol/style'
import { MapComponent } from '../../map/map.component'

@Component({
  selector: 'app-styling-geojson',
  templateUrl: './styling-geojson.component.html',
  styleUrls: ['./styling-geojson.component.scss'],
  imports: [MapComponent]
})
export class StylingGeoJsonComponent implements OnInit {
  map: Map

  osmLayer = new TileLayer({ source: new OSM() })

  countriesSource = new VectorSource({
    url: 'countries.geojson',
    format: new GeoJSON()
  })

  countriesLayer = new VectorLayer({
    source: this.countriesSource,
    style: new Style({
      fill: new Fill({ color: 'rgba(255, 255, 255, 0.5)' }),
      stroke: new Stroke({ color: 'black', width: 1 })
    })
  })

  earthquakesSource = new VectorSource({
    url: '2012_Earthquakes_Mag5.kml',
    format: new KML({ extractStyles: false })
  })

  earthquakesLayer = new VectorLayer({
    source: this.earthquakesSource,
    style: new Style({
      image: new Circle({
        radius: 4,
        fill: new Fill({ color: 'orange' })
      })
    })
  })

  ngOnInit(): void {
    this.map = new Map({
      view: new View({ center: [0, 0], zoom: 2 }),
      layers: [this.osmLayer, this.countriesLayer, this.earthquakesLayer]
    })
  }

  ngOnDestroy(): void {
    this.map.removeLayer(this.osmLayer)
    this.map.removeLayer(this.countriesLayer)
    this.map.removeLayer(this.earthquakesLayer)
    this.map.setTarget(undefined)
  }
}
