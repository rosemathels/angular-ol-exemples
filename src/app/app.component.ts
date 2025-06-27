import { Component } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { HelloWorldComponent } from './exercices/1-hello-world/hello-world.component'
import { MapEventsComponent } from './exercices/10-map-events/map-events.component'
import { DrawingComponent } from './exercices/11-drawing/drawing.component'
import { VecteurAstucesComponent } from './exercices/12-vecteur-astuces/vecteur-astuces.component'
import { ManipulerViewComponent } from './exercices/2-manipuler-view/manipuler-view.component'
import { LayersStadiaMapsComponent } from './exercices/3-layers-stadia-maps/layers-stadia-maps.component'
import { LayersIgnComponent } from './exercices/4-layers-ign/layers-ign.component'
import { VecteurFeaturesComponent } from './exercices/5-vecteur-features/vecteur-features.component'
import { VecteurGeoJsonComponent } from './exercices/6-vecteur-geojson/vecteur-geojson.component'
import { StylingGeoJsonComponent } from './exercices/7-styling-geojson-kml/styling-geojson.component'
import { StyleComponent as StylingBdTopoComponent } from './exercices/8-styling-bdtopo/styling-bdtopo.component'
import { ControlsInteractionsComponent } from './exercices/9-controls-interactions/controls-interactions.component'

@Component({
  selector: 'app-root',
  imports: [
    FormsModule,
    HelloWorldComponent,
    LayersStadiaMapsComponent,
    LayersIgnComponent,
    ManipulerViewComponent,
    VecteurGeoJsonComponent,
    VecteurFeaturesComponent,
    StylingBdTopoComponent,
    ControlsInteractionsComponent,
    MapEventsComponent,
    DrawingComponent,
    VecteurAstucesComponent,
    StylingGeoJsonComponent
],
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  exempleActif = Exemples.HELLO_WORLD
  Exemples = Exemples
}

export enum Exemples {
  HELLO_WORLD = 'HELLO_WORLD',
  MANIPULER_VIEW = 'MANIPULER_VIEW',
  LAYERS_STADIA_MAPS = 'LAYER_STADIA_MAPS',
  LAYERS_IGN = 'LAYER_IGN',
  VECTEUR_FEATURES = 'VECTEUR_FEATURES',
  VECTEUR_GEOJSON = 'VECTEUR_GEOJSON',
  STYLING_GEOJSON = 'STYLING_GEOJSON',
  STYLING_BDTOPO = 'STYLING_BDTOPO',
  CONTROLS_INTERACTIONS = 'CONTROLS_INTERACTIONS',
  MAP_EVENTS = 'MAP_EVENTS',
  DRAWING = 'DRAWING',
  VECTEUR_ASTUCES = 'VECTEUR_ASTUCES'
}
