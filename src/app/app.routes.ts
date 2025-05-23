import { Routes } from '@angular/router';
import {GenerateVideoComponent} from "./features/generate-video/generate-video.component";
import {CaptionsAddComponent} from "./features/captions-add/captions-add.component";
import {MainPageComponent} from "./features/main-page/main-page.component";

export const routes: Routes = [
  {
    path: '',
    component: MainPageComponent,

  },
  {
    path: 'captions',
    component: CaptionsAddComponent,
  },
];
