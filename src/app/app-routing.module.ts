import { ImageToImageComponent } from './image-to-image/image-to-image.component';
import { InpaintingComponent } from './inpainting/inpainting.component';
import { AppComponent } from './app.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TextToImageComponent } from './text-to-image/text-to-image.component';

const routes: Routes = [
  {
    path: '',
    component: TextToImageComponent,
  },
  {
    path: 'inpainting',
    component: InpaintingComponent,
  },
  {
    path: 'image-to-image',
    component: ImageToImageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
