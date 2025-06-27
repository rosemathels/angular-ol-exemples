import { Component, OnDestroy, OnInit } from '@angular/core'
import { Map, View } from 'ol'
import { GeoJSON, KML } from 'ol/format'
import { Heatmap, Tile as TileLayer, Vector as VectorLayer  } from 'ol/layer'
import { Cluster as ClusterSource, OSM, Vector as VectorSource } from 'ol/source'
import { MapComponent } from '../../map/map.component'

@Component({
  selector: 'app-vecteur-astuces',
  templateUrl: './vecteur-astuces.component.html',
  styleUrls: ['./vecteur-astuces.component.scss'],
  imports: [MapComponent]
})
export class VecteurAstucesComponent implements OnInit, OnDestroy {
  map: Map

  osmLayer = new TileLayer({ source: new OSM() })

  countriesSource = new VectorSource({
    url: 'countries.geojson',
    format: new GeoJSON()
  })

  countriesLayer = new VectorLayer({ source: this.countriesSource })

  earthquakesSource = new VectorSource({
    url: '2012_Earthquakes_Mag5.kml',
    format: new KML()
  })

  clusterSource = new ClusterSource({ source: this.earthquakesSource })

  earthquakesLayer = new VectorLayer({ source: this.clusterSource })

  earthquakesHeatmap = new Heatmap({ source: this.earthquakesSource })

  ngOnInit (): void {
    this.map = new Map({
      view: new View({ center: [0, 0], zoom: 2 }),
      layers: [this.osmLayer, this.earthquakesHeatmap, this.countriesLayer, this.earthquakesLayer]
    })
  }

  ngOnDestroy (): void {
    this.map.removeLayer(this.osmLayer)
    this.map.removeLayer(this.earthquakesHeatmap)
    this.map.removeLayer(this.countriesLayer)
    this.map.removeLayer(this.earthquakesLayer)
    this.map.setTarget(undefined)
  }
}
