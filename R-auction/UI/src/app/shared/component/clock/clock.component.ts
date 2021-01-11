import { Component } from "@angular/core";

@Component({
  selector: "app-clock",
  templateUrl: "./clock.component.html",
  styleUrls: ["./clock.component.css"]
})
export class ClockComponent {
  hours: string;
  minutes: string;
  seconds: string;
  time: any;
  private timerId = null;

  ngOnInit() {
    this.setCurrentTime();
    this.timerId = this.updateTime();
  }

  ngOnDestroy() {
    clearInterval(this.timerId);
  }

  private setCurrentTime() {
    this.time = new Date(Date.now());
    this.hours = this.leftPadZero(this.time.getHours());
    this.minutes = this.leftPadZero(this.time.getMinutes());
    this.seconds = this.leftPadZero(this.time.getSeconds());
  }

  private updateTime() {
    let id = setInterval(() => {
      this.setCurrentTime();
    }, 1000);
    return id;
  }

  private leftPadZero(value: number) {
    return value < 10 ? `0${value}` : value.toString();
  }
}
