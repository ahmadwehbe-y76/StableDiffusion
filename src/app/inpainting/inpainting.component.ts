import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import axios from 'axios';
import * as $ from 'jquery';
import { interval } from 'rxjs';
const UndoCanvas = require('./undo-canvas');

@Component({
  selector: 'app-inpainting',
  templateUrl: './inpainting.component.html',
  styleUrls: ['./inpainting.component.css'],
})
export class InpaintingComponent implements OnInit {
  canvas_image = '';
  inpaint_images: any = [];
  progressbarValue = 100;
  loading = false;
  curSec: number = 0;
  prompt = '';
  color: any = 'white';
  stroke_size: any = 10;
  mode: any = 'normal';

  constructor(private router: Router) {}

  eraseAll() {
    var c: any = document.getElementById('canvas');
    var ctx = c.getContext('2d');
    ctx.clearRect(0, 0, 512, 512);
  }

  penClick() {
    this.mode = 'normal';
    var c: any = document.getElementById('canvas');
    var ctx = c.getContext('2d');
    ctx.globalCompositeOperation = 'source-over';
  }

  eraserClick() {
    this.mode = 'eraser';
    var c: any = document.getElementById('canvas');
    var ctx = c.getContext('2d');
    ctx.globalCompositeOperation = 'destination-out';
  }

  changeColor(event: any) {
    this.color = event.target.value;
    var c: any = document.getElementById('canvas');
    var ctx = c.getContext('2d');
    ctx.strokeStyle = this.color;
  }

  changeStrokeSize(event: any) {
    this.stroke_size = event.target.value;
    var c: any = document.getElementById('canvas');
    var ctx = c.getContext('2d');
    ctx.lineWidth = this.stroke_size;
  }
  navigateImage() {
    this.router.navigate(['image-to-image']);
  }

  navigateToText() {
    this.router.navigate(['/']);
  }

  removeImage() {
    this.canvas_image = '';
  }

  clickUpload() {
    if (!this.canvas_image) {
      $('#init-image').click();
    }
  }
  uploadImage(event: any) {
    const file = event.target.files[0];
    const reader: any = new FileReader();
    reader.onloadend = () => {
      this.canvas_image = reader.result;
    };
    reader.readAsDataURL(file);
  }

  startTimer(seconds: number) {
    const time = seconds;
    const timer$ = interval(1000);

    const sub = timer$.subscribe((sec: any) => {
      this.progressbarValue = 100 - (sec * 100) / seconds;
      this.curSec = sec;

      if (this.curSec === seconds) {
        sub.unsubscribe();
      }
    });
  }
  undo() {
    var c: any = document.getElementById('canvas');
    var ctx = c.getContext('2d');
    ctx.undo(50);
  }

  redo() {
    var c: any = document.getElementById('canvas');
    var ctx = c.getContext('2d');
    ctx.redo(50);
  }

  async canvas() {
    this.loading = true;
    this.inpaint_images = [];

    let canvas = document.getElementById('canvas') as HTMLCanvasElement;

    let mask_data_url = canvas.toDataURL();

    if (!this.prompt) {
      this.loading = false;

      alert('Please enter a prompt');
      return;
    }
    if (!mask_data_url) {
      this.loading = false;

      alert('Please choose a mask image');
      return;
    }
    if (!this.canvas_image) {
      this.loading = false;

      alert('Please choose an init image');
      return;
    } else {
      this.startTimer(16);
      await axios
        .post('http://35.209.131.22:5000/api/inpainting/', {
          prompt: this.prompt,
          mask: mask_data_url,
          init_image: this.canvas_image,
        })
        .then(async (response) => {
          this.inpaint_images = await response.data;
          this.loading = true;
        })
        .catch((error) => {
          this.loading = false;
          alert('Something went wrong!');
        });
    }
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    var c: any = document.getElementById('canvas');
    var ctx = c.getContext('2d');
    UndoCanvas.enableUndo(ctx);
  }
}
