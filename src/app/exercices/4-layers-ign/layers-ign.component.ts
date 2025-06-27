import { Component, type OnDestroy, type OnInit } from '@angular/core'
import { Map, View } from 'ol'
import { getTopLeft, getWidth } from 'ol/extent'
import { GeoJSON, MVT } from 'ol/format'
import {
  Image as ImageLayer,
  Tile as TileLayer,
  Vector as VectorLayer,
  VectorTile as VectorTileLayer
} from 'ol/layer'
import { bbox as bboxStrategy } from 'ol/loadingstrategy'
import { fromLonLat, get } from 'ol/proj'
import { ImageWMS, TileWMS, Vector as VectorSource, VectorTile, WMTS } from 'ol/source'
import { Stroke, Style } from 'ol/style'
import WMTSTileGrid from 'ol/tilegrid/WMTS'
import { MapComponent } from '../../map/map.component'

@Component({
  selector: 'app-layers-ign',
  templateUrl: './layers-ign.component.html',
  styleUrls: ['./layers-ign.component.scss'],
  imports: [MapComponent]
})
export class LayersIgnComponent implements OnInit, OnDestroy {
  map: Map

  communesImage = new ImageLayer({
    source: new ImageWMS({
      url: 'https://data.geopf.fr/wms-v/wms',
      params: { LAYERS: 'CADASTRALPARCELS.COMMUNES' }
    })
  })

  communesTile = new TileLayer({
    source: new TileWMS({
      url: 'https://data.geopf.fr/wms-v/wms',
      params: { LAYERS: 'CADASTRALPARCELS.COMMUNES', TILED: true }
    })
  })

  planIgnWMSTile = new TileLayer({
    source: new TileWMS({
      url: 'https://data.geopf.fr/wms-r/wms',
      params: { LAYERS: 'GEOGRAPHICALGRIDSYSTEMS.PLANIGNV2', TILED: true },
      transition: 0
    })
  })

  planIgnWMTS = new TileLayer({
    source: new WMTS({
      url: 'https://data.geopf.fr/wmts',
      layer: 'GEOGRAPHICALGRIDSYSTEMS.PLANIGNV2',
      format: 'image/png',
      style: 'normal',
      tileGrid: this.calculerTileGrid('EPSG:3857'),
      matrixSet: 'PM_0_19'
    })
  })

  bdTopo = new VectorTileLayer({
    source: new VectorTile({
      url: 'https://data.geopf.fr/tms/1.0.0/BDTOPO/{z}/{x}/{y}.pbf',
      format: new MVT()
    }),
    style: new Style({ stroke: new Stroke({ color: 'red' }) })
  })
  
  water = new VectorLayer({
    source : new VectorSource({
      format: new GeoJSON(),
      url: (extent) => {
        let url = 'https://data.geopf.fr/wfs/ows?SERVICE=WFS&VERSION=2.0.0'
        url += '&request=GetFeature'
        url += '&typename=BDCARTO_V5:cours_d_eau'
        url += '&outputFormat=application/json'
        url += '&srsname=EPSG:4326'
        url += `&bbox=${extent.join(',')},EPSG:3857`
        return url
      },
      strategy: bboxStrategy
    }),
    style: new Style({ stroke: new Stroke({ color: 'blue', width: 3 }) })
  })

  ngOnInit(): void {
    this.map = new Map({
      view: new View({ center: fromLonLat([5.43, 43.53]), zoom: 16 }),
      layers: [this.planIgnWMTS, this.communesTile, this.water]
    })

    // apply(this.map, 'https://data.geopf.fr/annexes/ressources/vectorTiles/styles/BDTOPO/bati_date.json')
  }

  ngOnDestroy (): void {
    this.map.removeLayer(this.planIgnWMTS)
    this.map.removeLayer(this.communesTile)
    this.map.removeLayer(this.water)
    this.map.setTarget(undefined)
  }

  calculerTileGrid (projection: string): WMTSTileGrid {
    const extent = get(projection)!.getExtent()
    const maxResolution = getWidth(extent) / 256
    const origin = getTopLeft(extent)
    const resolutions = []
    const matrixIds = []
    for (let i = 0; i < 20; i++) {
      resolutions[i] = maxResolution / Math.pow(2, i)
      matrixIds[i] = i.toString()
    }
    return new WMTSTileGrid({ origin, resolutions, matrixIds })
  }
}
