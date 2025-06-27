import { Component, OnDestroy, OnInit } from '@angular/core'
import { Map, View } from 'ol'
import { GeoJSON, KML } from 'ol/format'
import { Tile as TileLayer, Vector as VectorLayer  } from 'ol/layer'
import { OSM, Vector as VectorSource } from 'ol/source'
import { MapComponent } from '../../map/map.component'

@Component({
  selector: 'app-vecteur-geojson',
  templateUrl: './vecteur-geojson.component.html',
  styleUrls: ['./vecteur-geojson.component.scss'],
  imports: [MapComponent]
})
export class VecteurGeoJsonComponent implements OnInit, OnDestroy {
  map: Map

  osmLayer = new TileLayer({ source: new OSM() })

  countriesSource = new VectorSource({
    url: 'countries.geojson',
    format: new GeoJSON()
  })

  countriesLayer = new VectorLayer({ source: this.countriesSource })

  earthquakesSource = new VectorSource({
    url: '2012_Earthquakes_Mag5.kml',
    format: new KML({ extractStyles: false })
  })

  earthquakesLayer = new VectorLayer({ source: this.earthquakesSource })

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
