import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Login } from './login/login';
import { Register } from './register/register';
import { AdminDashboard } from './admin/admin-dashboard/admin-dashboard';
import { AddBus } from './admin/add-bus/add-bus';
import { AddRoute } from './admin/add-route/add-route';
import { AddSchedule } from './admin/add-schedule/add-schedule';
import { BusList } from './admin/bus-list/bus-list';
import { RouteListComponent } from './admin/route-list/route-list';
import { ScheduleListComponent } from './admin/schedule-list/schedule-list';
import { Search } from './search/search';
import { Seat } from './seat/seat';
import { BookTicket } from './book-ticket/book-ticket';
import { ConfirmBooking } from './confirm-booking/confirm-booking';
import { BookingSuccess } from './booking-success/booking-success';
import { Contact } from './contact/contact';
import { UpdateBus } from './admin/update-bus/update-bus'; // adjust path as needed
import { UpdateRoute } from './admin/update-route/update-route';
import { UpdateSchedule } from './admin/update-schedule/update-schedule';
import { Bookings } from './bookings/bookings';
import { FAQ } from './faq/faq';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'home', component: Home },
  { path: 'faq', component: FAQ },
  { path: 'contact', component: Contact },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'search', component: Search },
  { path: 'seat', component: Seat },
  { path: 'book-ticket', component: BookTicket },
  { path: 'confirm-booking', component: ConfirmBooking },
  { path: 'booking-success', component: BookingSuccess },
  { path: 'bookings', component: Bookings },

  {
    path: 'admin',
    component: AdminDashboard,
    children: [
      { path: 'add-bus', component: AddBus },
      { path: 'update-bus/:id', component: UpdateBus },
      { path: 'add-route', component: AddRoute },
      { path: 'add-schedule', component: AddSchedule },
      { path: 'bus-list', component: BusList },
      { path: 'routes', component: RouteListComponent },
      { path: 'update-route/:id', component: UpdateRoute },
      { path: 'schedules', component: ScheduleListComponent },
      { path: 'update-schedule/:id', component: UpdateSchedule },
      { path: '', redirectTo: 'bus-list', pathMatch: 'full' } // ✅ fixed redirect
    ]
  }
];
