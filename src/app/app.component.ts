import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import axios from 'axios';
import { interval } from 'rxjs';
import * as https from 'https';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
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

  constructor(private http: HttpClient) {}

  toggleAdvanced() {
    this.advanced = !this.advanced;
  }

  imageUpload(event: any) {
    this.init_image = event.target.files[0];
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

  async test() {
    var header = {
      headers: new HttpHeaders().set(
        'Authorization',
        `Token 4f1edc5f6a4349eef48c1fe8c8e32023846cb71b`
      ),
    };

    axios
      .post('https://api.replicate.com/v1/predictions', {
        input: {
          prompt: 'dog',
        },
      })
      .then((data) => {
        console.log(data);
      });
  }

  generateClick() {
    if (!this.prompt) {
      alert('Please enter a prompt !');
    } else {
      if (this.samples === 1) {
        this.startTimer(16);
      } else {
        this.startTimer(38);
      }
      this.getUserData();
    }
  }
  ngOnInit(): void {
    this.test();
  }
}
