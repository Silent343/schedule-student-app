import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

/** App footer shown at the bottom of the content area. */
@Component({
  selector: 'app-footer-content',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './footer-content.html',
  styleUrl: './footer-content.css',
})
export class FooterContent {
  readonly year = new Date().getFullYear();
}
