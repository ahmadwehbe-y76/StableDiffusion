import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Route, Router, Routes } from '@angular/router';
import axios from 'axios';
import { interval } from 'rxjs';

@Component({
  selector: 'app-text-to-image',
  templateUrl: './text-to-image.component.html',
  styleUrls: ['./text-to-image.component.css'],
})
export class TextToImageComponent implements OnInit {
  title = 'StableDiffusion';
  prompt = '';
  loading = false;
  images = [];
  progressbarValue = 100;
  curSec: number = 0;
  advanced = false;
  samples = 1;
  steps = 45;
  scale = 7.5;
  seed = 1486868319;
  init_image: any = {};
  files: any = [];
  strength: any = 0.8;
  canvas_image = '';
  inpaint_images = [];
  constructor(private http: HttpClient, private router: Router) {}
  toggleAdvanced() {
    this.advanced = !this.advanced;
  }

  navigateToInpaint() {
    this.router.navigate(['inpainting']);
  }

  navigateImage() {
    this.router.navigate(['image-to-image']);
  }

  imageUpload(event: any) {
    this.init_image = event.target.files[0];
  }

  blobToDataURL(blob: any, callback: any) {
    var a = new FileReader();
    a.onload = function (e: any) {
      callback(e.target.result);
    };
    a.readAsDataURL(blob);
  }

  uploadImage(event: any) {
    const file = event.target.files[0];
    const reader: any = new FileReader();
    reader.onloadend = () => {
      this.canvas_image = reader.result;
    };
    reader.readAsDataURL(file);
  }

  canvas() {
    let canvas = document.getElementById('canvas') as HTMLCanvasElement;

    let mask_data_url = canvas.toDataURL();

    axios
      .post('http://35.209.131.22:5000/api/inpainting/', {
        mask: mask_data_url,
        init_image: this.canvas_image,
      })
      .then((response) => {
        this.inpaint_images = response.data;
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  async getUserData() {
    this.loading = true;

    console.log(this.init_image);

    // try {
    //   const response = await axios.get('http://35.209.131.22:5000', {
    //     params: { prompt: this.prompt },
    //   });
    //   this.images = response.data;
    //   console.log(response.data);
    //   this.loading = false;
    // } catch (error) {
    //   console.log(error);
    //   this.loading = false;
    //   alert('Something went wrong!');
    // }

    let formData: FormData = new FormData();
    const data = {
      prompt: this.prompt,
      samples: this.samples,
      steps: this.steps,
      scale: this.scale,
      seed: this.seed,
      strength: this.strength,
    };

    formData.append('init_image', this.init_image);
    formData.append('data', JSON.stringify(data));

    return await this.http
      .post('http://35.209.131.22:5000/api/', formData)
      .subscribe(
        async (data: any) => {
          this.images = await data;
        },
        (err) => {
          this.loading = false;
          alert('Something went wrong!');
        }
      );
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

  generateClick() {
    if (!this.prompt) {
      alert('Please enter a prompt !');
    } else {
      if (this.samples === 1) {
        this.startTimer(16);
      } else {
        this.startTimer(45);
      }
      this.getUserData();
    }
  }

  ngOnInit(): void {}
}
