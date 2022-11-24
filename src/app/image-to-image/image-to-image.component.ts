import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import axios from 'axios';
import { interval } from 'rxjs';
import * as $ from 'jquery';
const UndoCanvas = require('./undo-canvas');

@Component({
  selector: 'app-image-to-image',
  templateUrl: './image-to-image.component.html',
  styleUrls: ['./image-to-image.component.css'],
})
export class ImageToImageComponent implements OnInit {
  canvas_image = '';
  inpaint_images: any = [];
  progressbarValue = 100;
  loading = false;
  curSec: number = 0;
  prompt = '';
  color: any = 'black';
  stroke_size: any = 10;
  mode: any = 'normal';
  advanced = false;
  samples = 1;
  steps = 45;
  scale = 7.5;
  seed = 1486868319;
  init_image: any = {};
  files: any = [];
  strength: any = 0.8;

  constructor(private router: Router) {}

  toggleAdvanced() {
    this.advanced = !this.advanced;
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

  colorBackground() {
    var canvas: any = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = this.color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
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
    } else {
      this.startTimer(16);
      await axios
        .post('http://35.209.131.22:5000/api/imgtoimg', {
          prompt: this.prompt,
          init_image: mask_data_url,
          steps: this.steps,
          seed: this.seed,
          scale: this.scale,
          strength: this.strength,
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

  navigateToText() {
    this.router.navigate(['/']);
  }

  removeImage() {
    this.canvas_image = '';
  }

  clickUpload() {
    $('#init-image').click();
  }
  uploadImage(event: any) {
    const file = event.target.files[0];
    const reader: any = new FileReader();
    reader.onloadend = () => {
      this.canvas_image = reader.result;
      var background = new Image();
      background.src = this.canvas_image;
      var c: any = document.getElementById('canvas');
      var ctx = c.getContext('2d');

      background.onload = function () {
        ctx.drawImage(background, 0, 0);
      };
    };
    reader.readAsDataURL(file);
  }

  eraseAll() {
    var c: any = document.getElementById('canvas');
    var ctx = c.getContext('2d');
    ctx.clearRect(0, 0, 512, 512);
  }
  navigateToInpaint() {
    this.router.navigate(['inpainting']);
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

  ngOnInit(): void {}

  editClick() {
    var background = new Image();
    background.src = 'data:image/jpeg;base64,' + this.inpaint_images[0];
    var c: any = document.getElementById('canvas');
    var ctx = c.getContext('2d');

    background.onload = function () {
      ctx.drawImage(background, 0, 0);
    };
  }

  ngAfterViewInit(): void {
    var c: any = document.getElementById('canvas');
    var ctx = c.getContext('2d');
    ctx.strokeStyle = 'black';
    UndoCanvas.enableUndo(ctx);
  }
}
