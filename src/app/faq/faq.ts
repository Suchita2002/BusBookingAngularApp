import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Header } from '../shared/header/header';

interface FAQItem {
  question: string;
  answer: string;
}

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [CommonModule, Header],
  templateUrl: './faq.html',
  styleUrls: ['./faq.css']
})
export class FAQ {
  faqList: FAQItem[] = [
    {
      question: 'Q1. I could not register my User Id, so what can I do?',
      answer:
        'Check that all mandatory fields are filled properly. Only use A–Z, a–z, or 0–9 in your User ID and password.'
    },
    {
      question: 'Q2. How many days before can I reserve e-ticket?',
      answer:
        'You can book up to 60 days before your journey. Booking closes 1 hour before the departure time.'
    },
    {
      question: 'Q3. What are the e-ticket booking hours?',
      answer: 'You can book or cancel tickets between 00:05 and 23:30 IST.'
    },
    {
      question: 'Q4. How can I search Boarding/Destination name or code?',
      answer:
        'Enter at least three letters of the stop name and click the search icon to see matching results.'
    },
    {
      question: 'Q5. I do not know bus station names for big cities like Mumbai or Pune. What can I do?',
      answer:
        'Enter the city name only — the system will display all stations in that city.'
    },
    {
      question: 'Q6. Can I book concessional e-ticket?',
      answer:
        'Yes, concessions are available for senior citizens, disabled passengers, and others. Bring a valid photo ID.'
    },
    {
      question: 'Q7. Till when can I cancel my e-ticket?',
      answer:
        'You can cancel your ticket up to 4 hours before the bus departure. After that, no refund is allowed.'
    },
    {
      question: 'Q8. What are the cancellation charges?',
      answer:
        '10% if canceled 24 hours before, 25% if canceled 12 hours before, 50% if canceled 4 hours before departure. Taxes are non-refundable.'
    },
    {
      question: 'Q9. Can I get refund of fare in case of non performance of journey?',
      answer: 'No refund will be given in that case.'
    },
    {
      question: 'Q10. How can I get refund if bus service is cancelled or changed?',
      answer:
        'Refund will be processed automatically to your bank account within 7 days after submitting your ticket at the depot.'
    },
    {
      question: 'Q11. How refund will be done for cancellation of e-ticket?',
      answer:
        'Refund will be made to your bank account only. No cash refund is allowed.'
    },
    {
      question: 'Q12. Can I change journey details after booking?',
      answer:
        'No. You must cancel the ticket and rebook with the desired date/time.'
    },
    {
      question:
        'Q13. What if my payment was deducted but I did not receive the ticket?',
      answer:
        'If your ticket is not visible under "My Tickets", the refund will be credited automatically within 7–14 working days.'
    }
  ];
}
