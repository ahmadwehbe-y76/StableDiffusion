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

  constructor(private http: HttpClient) {}

  toggleAdvanced() {
    this.advanced = !this.advanced;
  }

  async getUserData() {
    this.loading = true;

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

    return await this.http
      .post('http://35.209.131.22:5000/api/', {
        prompt: this.prompt,
        samples: this.samples,
        steps: this.steps,
        scale: this.scale,
        seed: this.seed,
      })
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
    return await this.http
      .post(
        'http://35.209.131.22:5000/predictions',
        {
          input: {
            prompt: 'ahmad',
          },
        },
        { headers: { 'Access-Control-Allow-Origin': '*' } }
      )
      .subscribe(
        async (data: any) => {
          if (data.status && data.status === 'succeeded') {
            this.images = await data.output;
          }
        },
        (err) => {
          this.loading = false;
          alert('Something went wrong!');
        }
      );
  }

  generateClick() {
    if (!this.prompt) {
      alert('Please enter a prompt !');
    } else {
      if (this.samples === 1) {
        this.startTimer(16);
      } else {
        this.startTimer(30);
      }
      this.getUserData();
    }
  }
  ngOnInit(): void {
    this.test();
  }
}
