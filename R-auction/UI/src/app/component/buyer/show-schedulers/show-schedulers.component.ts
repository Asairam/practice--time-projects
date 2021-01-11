import {
  Component,
  ChangeDetectionStrategy,
  ViewChild,
  TemplateRef,
  OnInit,
  AfterViewInit,
  ViewEncapsulation,
} from '@angular/core';
import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours,
  startOfHour,
  endOfHour,
} from 'date-fns';
import { Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarView,
} from 'angular-calendar';
import { BuyerStatusService } from '../../component-service/buyer-status.service';
import { DatePipe } from '@angular/common';
import * as routerconfig from '../../../appConfig/router.config';
const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3',
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF',
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA',
  },
};
import { AuthService } from '../../../authService/auth.service';
import { Router } from '@angular/router';
import { EmailTemplate } from '../../component-service/email.template';
import { CommonService } from 'src/app/commonService/common.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-show-schedulers',
  templateUrl: './show-schedulers.component.html',
  styleUrls: ['./show-schedulers.component.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShowSchedulersComponent implements OnInit {
  imageURL = environment.rauction;
  @ViewChild('modalContent') modalContent: TemplateRef<any>;
  emailTemplate = new EmailTemplate();
  view: CalendarView = CalendarView.Month;

  CalendarView = CalendarView;

  viewDate: Date = new Date();

  modalData: {
    action: string;
    event: CalendarEvent;
  };
  basicinfodata: any;
  refresh: Subject<any> = new Subject();

  events: CalendarEvent[] = [];
  // {
  //   start: subDays(startOfDay(new Date()), 1),
  //   end: addDays(new Date(), 1),
  //   title: 'A 3 day event',
  //   color: colors.red,
  //   allDay: true,
  //   resizable: {
  //     beforeStart: true,
  //     afterEnd: true,
  //   },
  //   draggable: false,
  // },
  // {
  //   start: startOfDay(new Date()),
  //   title: 'An event with no end date',
  //   color: colors.yellow,
  // },
  // {
  //   start: subDays(endOfMonth(new Date()), 3),
  //   end: addDays(endOfMonth(new Date()), 3),
  //   title: 'A long event that spans 2 months',
  //   color: colors.blue,
  //   allDay: true,
  // }
  // ];

  showStatusColor = [{ status: 'Published', color: '#254399' }, { status: 'Open', color: '#18ad18' }, { status: 'Paused', color: '#e8a119' }, { status: 'Closed', color: '#e21717' }, { status: 'Total Auction', color: '', value: 'totalauctions' }];

  activeDayIsOpen: boolean = false;
  calData: any;
  translateSerCommon:any;
  constructor(private modal: NgbModal, private buyerstatusService: BuyerStatusService, private authService: AuthService, private routes: Router, private commonService: CommonService, public datepipe: DatePipe) {
    this.commonService.translateSer('COMMON').subscribe(async (text: string) => {
      this.translateSerCommon = text;
    });
  }
  ngOnInit() {
    if (this.authService.hasAdminAccess()) {
      this.getAucList()
    } else {
      this.routes.navigate(['/page-not-found']);
    }
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
    console.log(this.events)
  }

  eventTimesChanged({
    event,
    newStart,
    newEnd,
  }: CalendarEventTimesChangedEvent): void {
    this.events = this.events.map((iEvent) => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd,
        };
      }
      return iEvent;
    });
    this.handleEvent('Dropped or resized', event);
  }

  handleEvent(action: string, event: CalendarEvent): void {
    console.log(event, action)
    this.modalData = { event, action };
    this.modal.open(this.modalContent, {
      size: 'lg', backdrop: 'static',
      keyboard: false,
      centered: true
    });
    this.basicinfodata = this.calData.find(obj => { return obj.auctionID == event.id });
    console.log(this.calData, this.basicinfodata)
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay(date) {
    this.activeDayIsOpen = false;
    if (date == 'today') {
      this.viewDate = new Date();
    }
    this.getAucList();
  }

  getAucList() {
    try {
      let obj = {
        "month": new Date(this.viewDate).getMonth(),
        "year": new Date(this.viewDate).getFullYear()
      }
      this.events = [];
      this.buyerstatusService.getAdminCalendarData(obj).subscribe((res: any) => {
        if (res['success']) {
          console.log(res['message'])
          this.calData = res['message'];
          res['message'].forEach(element => {
            if (element.startDate) {
              this.events.push(
                {
                  start: new Date(element.startDate),
                  end: new Date(element.endDate),
                  title: this.emailTemplate.calendarTitleView(element) + '(' + this.datepipe.transform(new Date(element.startDate), 'MM/dd/yyyy HH:mm') + ' to ' + this.datepipe.transform(new Date(element.endDate), 'MM/dd/yyyy HH:mm') + ')',
                  color: this.getColors(element),
                  id: element.auctionID,
                  // allDay: this.commonService.dateTimeFilter(new Date(element.startDate), new Date(element.endDate)).days >= 7 ? true : false,
                  cssClass: this.getBgColors(element)
                }
              );
            }
          });
          this.refresh.next();
        }
      }, error => { });
    } catch (err) { }

  }

  getColors(obj) {
    let color = {
      primary: '#e8a119',
      secondary: '#FDF1BA',
    };
    switch (obj.status) {
      case 'Paused':
        color = {
          primary: '#e8a119',
          secondary: '#FDF1BA',
        };
        break;
      case 'Closed':
        color = {
          primary: '#e21717',
          secondary: '#FDF1BA',
        };
        break;
      case 'Open':
        color = {
          primary: '#18ad18',
          secondary: '#FDF1BA',
        };
        break;
      case 'Published':
        color = {
          primary: '#254399',
          secondary: '#FDF1BA',
        };
        break;
      default:
      // code block
    }
    return color;
  }

  getBgColors(obj) {
    let color = 'my-custom-class-red';
    switch (obj.status) {
      case 'Paused':
        color = 'my-custom-class-yellow';
        break;
      case 'Closed':
        color = 'my-custom-class-red';
        break;
      case 'Open':
        color = 'my-custom-class-green';
        break;
      case 'Published':
        color = 'my-custom-class-blue';
        break;
      default:
      // code block
    }
    return color;
  }
  onRou() {
    this.commonService.buyerRedirectLanding();
  }
}
