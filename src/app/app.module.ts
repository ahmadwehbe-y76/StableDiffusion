import { CanvasComponent } from './canvas.component';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSliderModule } from '@angular/material/slider';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { InpaintingComponent } from './inpainting/inpainting.component';
import { TextToImageComponent } from './text-to-image/text-to-image.component';
import { ImageToImageComponent } from './image-to-image/image-to-image.component';

@NgModule({
  declarations: [
    AppComponent,
    CanvasComponent,
    InpaintingComponent,
    TextToImageComponent,
    ImageToImageComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    MatProgressBarModule,
    HttpClientModule,
    MatSliderModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
