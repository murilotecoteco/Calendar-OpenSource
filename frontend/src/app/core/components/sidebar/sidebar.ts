import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { AppIconComponent } from '../../../shared/components/icon/icon';
import type { AppIconName } from '../../../shared/components/icon/icon.types';
import { EventModalComponent } from '../../../shared/components/event-modal/event-modal';

interface SidebarNavItem {
  id: string;
  label: string;
  icon: AppIconName;
}

interface SidebarUtilityItem {
  id: string;
  label: string;
  icon: AppIconName;
}

interface SidebarUser {
  name: string;
  email: string;
  initials: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [AppIconComponent, EventModalComponent],
  templateUrl: './sidebar.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Sidebar {
  protected readonly navItems: SidebarNavItem[] = [
    { id: 'dashboard', label: 'Painel', icon: 'dashboard' },
    { id: 'calendar', label: 'Calendário', icon: 'calendar' },
    { id: 'upcoming', label: 'Próximos', icon: 'upcoming' },
    { id: 'history', label: 'Histórico', icon: 'history' },
    { id: 'settings', label: 'Configurações', icon: 'settings' },
  ];

  protected readonly utilityItems: SidebarUtilityItem[] = [
    { id: 'study-planner', label: 'Planejador de Estudos', icon: 'study-planner' },
    { id: 'sharing', label: 'Compartilhamento', icon: 'sharing' },
  ];

  protected readonly user: SidebarUser = {
    name: 'Estefânio',
    email: 'estefaniossi@gmail.com',
    initials: 'E',
  };

  // Static navigation: routes are not wired yet, so the active item is local state.
  protected readonly activeItemId = signal('upcoming');
  protected readonly isOpen = signal(false);
  protected readonly isEventModalOpen = signal(false);

  protected toggleSidebar(): void {
    this.isOpen.update((v) => !v);
  }

  protected openEventModal(): void {
    this.isOpen.set(false); // Avoid stacking the mobile sidebar over the modal.
    this.isEventModalOpen.set(true);
  }

  protected onNavClick(event: Event, id: string): void {
    event.preventDefault();
    this.activeItemId.set(id);
    this.isOpen.set(false); // Close sidebar on mobile after clicking a link
  }

  protected onUtilityClick(event: Event, id: string): void {
    event.preventDefault();
    this.activeItemId.set(id);
    this.isOpen.set(false);
  }
}
