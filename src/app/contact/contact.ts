import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Header } from '../shared/header/header';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, Header],
  templateUrl: './contact.html',
  styleUrls: ['./contact.css']
})
export class Contact {}
