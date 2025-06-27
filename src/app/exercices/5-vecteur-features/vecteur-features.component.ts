import { Component, OnInit, OnDestroy } from '@angular/core'
import { Map, View, Feature } from 'ol'
import { Tile as TileLayer, Vector as VectorLayer  } from 'ol/layer'
import { OSM, Vector as VectorSource } from 'ol/source'
import { MapComponent } from '../../map/map.component'
import { GeoJSON } from 'ol/format'
import { Point } from 'ol/geom'
import { fromLonLat } from 'ol/proj'

@Component({
  selector: 'app-vecteur-features',
  templateUrl: './vecteur-features.component.html',
  styleUrls: ['./vecteur-features.component.scss'],
  imports: [MapComponent]
})
export class VecteurFeaturesComponent implements OnInit, OnDestroy {
  map: Map
  feature: Feature = new GeoJSON().readFeature({
    type: 'Feature',
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [ 5.21150, 43.82510],
          [ 5.21150, 43.39229],
          [ 5.72564, 43.39229],
          [ 5.72564, 43.82510],
          [ 5.21150, 43.82510],
        ]
      ]
    },
    properties: {
      title: 'Mon polygone'
    }
  }, {
    dataProjection: 'EPSG:4326',
    featureProjection: 'EPSG:3857'
  }) as Feature
  source = new VectorSource({ features: [this.feature] })
  features: Feature[] = []

  osm = new TileLayer({ source: new OSM() })
  layer = new VectorLayer({ source: this.source })

  ngOnInit(): void {
    this.map = new Map({
      view: new View({ center: [0, 0], zoom: 2 }),
      layers: [this.osm, this.layer]
    })
  }

  ngOnDestroy(): void {
    this.map.removeLayer(this.osm)
    this.map.removeLayer(this.layer)
    this.map.setTarget(undefined)
  }

  addFeature (): void {
    const latitude = Math.random() * 85 * (Math.random() < 0.5 ? -1 : 1)
    const longitude = Math.random() * 180 * (Math.random() < 0.5 ? -1 : 1)
    const geometry = new Point(fromLonLat([longitude, latitude]))
    const feature = new Feature({ geometry })
    this.features.push(feature)
    this.source.addFeature(feature)
  }

  removeLastFeature (): void {
    const last = this.features.pop()
    if (last) this.source.removeFeature(last)
  }

  clearFeatures (): void {
    this.source.clear()
  }

  zoomToExtent (): void {
    const extent = this.source.getExtent()
    this.map.getView().fit(extent, { padding: [20, 20] })
  }
}
