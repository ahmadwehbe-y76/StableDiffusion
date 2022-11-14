import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import axios from 'axios';
import * as $ from 'jquery';
import { interval } from 'rxjs';

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

  constructor(private router: Router) {}

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
  async canvas() {
    this.loading = true;
    this.inpaint_images = false;

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
}
