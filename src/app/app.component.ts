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

  constructor(private http: HttpClient) {}

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
      .post('http://35.209.131.22:5000/api/', { prompt: this.prompt })
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
      this.startTimer(16);
      this.getUserData();
    }
  }
  ngOnInit(): void {}
}
