import { Component } from '@angular/core';
import {
  LucideCalendar,
  LucideBell,
  LucideSearch,
  LucideChevronLeft,
  LucideChevronRight,
} from '@lucide/angular';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [LucideCalendar, LucideBell, LucideSearch, LucideChevronLeft, LucideChevronRight],
  templateUrl: './toolbar.html',
})
export class ToolbarComponent {}
