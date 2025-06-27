import { Component, OnDestroy, OnInit } from '@angular/core'
import { Map, View } from 'ol'
import { FeatureLike } from 'ol/Feature'
import { MVT } from 'ol/format'
import { Tile as TileLayer, VectorTile as VectorTileLayer } from 'ol/layer'
import { fromLonLat } from 'ol/proj'
import { VectorTile, XYZ } from 'ol/source'
import { Fill, Icon, Stroke, Style, Text } from 'ol/style'
import { StyleFunction, StyleLike } from 'ol/style/Style'
import { MapComponent } from '../../map/map.component'

@Component({
  selector: 'app-styling-bdtopo',
  templateUrl: './styling-bdtopo.component.html',
  styleUrls: ['./styling-bdtopo.component.scss'],
  imports: [MapComponent]
})
export class StyleComponent implements OnInit, OnDestroy {
  map: Map

  positron = new TileLayer({
    source: new XYZ({ url: 'http://basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png' })
  })

  bdTopo = new VectorTileLayer({
    source: new VectorTile({
      url: 'https://data.geopf.fr/tms/1.0.0/BDTOPO/{z}/{x}/{y}.pbf',
      format: new MVT()
    })
  })

  ngOnInit (): void {
    this.map = new Map({
      view: new View({ center: fromLonLat([5.43, 43.53]), zoom: 16 }),
      layers: [this.positron, this.bdTopo]
    })

    const styleBatiment = new Style({ fill: new Fill({ color: 'white' }) })

    const styleAutoroute = [
      new Style({ stroke: new Stroke({ color: '#555555', width: 4 })}),
      new Style({ stroke: new Stroke({ color: 'white', width: 3, lineDash: [5, 10] })})
    ]

    const styleRoute = new Style({ stroke: new Stroke({ color: '#aaaaaa', width: 1 })})

    const styleConstruction = new Style({ image: new Icon({ src: 'building.svg', scale: 0.03 }) })
    const styleConstructionLabel = new Style({
      text: new Text({
        font: 'bold 12px sans-serif',
        placement: 'point',
        offsetY: -20,
        fill: new Fill({ color: '#555555'}),
        stroke: new Stroke({ color: 'white', width: 3 }),
      })
    })

    const styleFn = (feature: FeatureLike): StyleLike | null => {
      const layer = feature.get('layer')
      if (layer === 'batiment') {
        const nombreEtages = feature.get('nombre_d_etages')
        if (nombreEtages === undefined || nombreEtages === 0) {
          styleBatiment.getFill()?.setColor('#577590')
        } else if (nombreEtages === 1) {
          styleBatiment.getFill()?.setColor('#43aa8b')
        } else if (nombreEtages === 2) {
          styleBatiment.getFill()?.setColor('#90be6d')
        } else if (nombreEtages === 3) {
          styleBatiment.getFill()?.setColor('#f9c74f')
        } else if (nombreEtages <= 7) {
          styleBatiment.getFill()?.setColor('#f8961e')
        } else if (nombreEtages <= 19) {
          styleBatiment.getFill()?.setColor('#f3722c')
        } else {
          styleBatiment.getFill()?.setColor('#f94144')
        }
        return styleBatiment
      }
      if (layer === 'troncon_de_route') {
        const nature = feature.get('nature')
        if (['Type autoroutier', 'Bretelle'].includes(nature)) {
          return styleAutoroute
        } else {
          return styleRoute
        }
      }
      if (layer === 'construction_ponctuelle') {
        const nature = feature.get('nature')
        styleConstructionLabel.getText()?.setText(nature)
        return [styleConstruction, styleConstructionLabel]
      }
      return null
    }

    this.bdTopo.setStyle(styleFn as StyleFunction)
  }

  ngOnDestroy(): void {
    this.map.removeLayer(this.positron)
    this.map.removeLayer(this.bdTopo)
    this.map.setTarget(undefined)
  }
}
