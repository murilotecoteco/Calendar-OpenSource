import { describe, it, expect, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { EventModalComponent, type EventFormValue } from './event-modal';

describe('EventModalComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventModalComponent],
    }).compileComponents();
  });

  function createComponent(open = false) {
    const fixture = TestBed.createComponent(EventModalComponent);
    fixture.componentRef.setInput('open', open);
    fixture.detectChanges();
    return fixture;
  }

  it('should not render the dialog while closed', () => {
    const fixture = createComponent();

    expect(fixture.nativeElement.querySelector('[role="dialog"]')).toBeNull();
  });

  it('should render every event field when open', () => {
    const fixture = createComponent(true);
    const element = fixture.nativeElement as HTMLElement;

    expect(element.querySelector('[role="dialog"]')).toBeTruthy();
    expect(element.querySelector('#event-title')).toBeTruthy();
    expect(element.querySelector('#event-start-date')).toBeTruthy();
    expect(element.querySelector('#event-start-time')).toBeTruthy();
    expect(element.querySelector('#event-end-date')).toBeTruthy();
    expect(element.querySelector('#event-end-time')).toBeTruthy();
    expect(element.querySelector('[role="switch"]')).toBeTruthy();
    expect(element.querySelector('#event-description')).toBeTruthy();
    expect(element.querySelector('#event-category')).toBeTruthy();
    expect(element.querySelector('#event-status')).toBeTruthy();
    expect(element.querySelector('#event-location')).toBeTruthy();
    expect(element.querySelector('#event-repeat')).toBeTruthy();
    expect(element.querySelector('#event-reminder')).toBeTruthy();
    expect(element.textContent).toContain('Salvar Evento');
    expect(element.textContent).toContain('Cancelar');
  });

  it('should start with the prototype default values', () => {
    const fixture = createComponent(true);
    const element = fixture.nativeElement as HTMLElement;

    expect((element.querySelector('#event-category') as HTMLSelectElement).value).toBe('personal');
    expect((element.querySelector('#event-status') as HTMLSelectElement).value).toBe('scheduled');
    expect((element.querySelector('#event-repeat') as HTMLSelectElement).value).toBe('none');
    expect((element.querySelector('#event-reminder') as HTMLSelectElement).value).toBe('5');
    expect(element.querySelector('[role="switch"]')?.getAttribute('aria-checked')).toBe('false');
  });

  it('should show inline required errors after an invalid submit', () => {
    const fixture = createComponent(true);
    const component = fixture.componentInstance as any;

    component.form.patchValue({
      title: '',
      startDate: '',
      startTime: '',
      endDate: '',
      endTime: '',
    });
    component.onSubmit();
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('#event-title-error')).toBeTruthy();
    expect(element.querySelector('#event-start-date-error')).toBeTruthy();
    expect(element.querySelector('#event-start-time-error')).toBeTruthy();
    expect(element.querySelector('#event-end-date-error')).toBeTruthy();
    expect(element.querySelector('#event-end-time-error')).toBeTruthy();
  });

  it('should show an inline error when the end time is not after the start time', () => {
    const fixture = createComponent(true);
    const component = fixture.componentInstance as any;

    component.form.patchValue({
      title: 'Planejamento',
      startDate: '2026-10-24',
      startTime: '14:00',
      endDate: '2026-10-24',
      endTime: '13:00',
    });
    component.onSubmit();
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    expect(component.form.hasError('endTimeBeforeStart')).toBe(true);
    expect(element.querySelector('#event-end-time-order-error')).toBeTruthy();
  });

  it('should accept an end date/time on a later day', () => {
    const fixture = createComponent(true);
    const component = fixture.componentInstance as any;
    const saved: EventFormValue[] = [];

    fixture.componentInstance.save.subscribe((value) => saved.push(value));

    component.form.patchValue({
      title: 'Planejamento',
      startDate: '2026-10-24',
      startTime: '14:00',
      endDate: '2026-10-25',
      endTime: '10:00',
    });
    component.onSubmit();
    fixture.detectChanges();

    expect(saved).toHaveLength(1);
    expect(fixture.nativeElement.querySelector('[role="dialog"]')).toBeNull();
  });

  it('should emit the normalized values and close when the form is valid', () => {
    const fixture = createComponent(true);
    const component = fixture.componentInstance as any;
    const saved: EventFormValue[] = [];

    fixture.componentInstance.save.subscribe((value) => saved.push(value));

    component.form.setValue({
      title: '  Planejamento  ',
      startDate: '2026-10-24',
      startTime: '09:00',
      endDate: '2026-10-24',
      endTime: '10:00',
      allDay: false,
      description: '  Revisar metas  ',
      category: 'work',
      status: 'scheduled',
      location: '  Sala 1  ',
      repeat: 'weekly',
      reminder: '30',
    });

    component.onSubmit();
    fixture.detectChanges();

    expect(saved).toHaveLength(1);
    expect(saved[0]).toEqual({
      title: 'Planejamento',
      startDate: '2026-10-24',
      startTime: '09:00',
      endDate: '2026-10-24',
      endTime: '10:00',
      allDay: false,
      description: 'Revisar metas',
      category: 'work',
      status: 'scheduled',
      location: 'Sala 1',
      repeat: 'weekly',
      reminder: '30',
    });
    expect(fixture.nativeElement.querySelector('[role="dialog"]')).toBeNull();
  });

  it('should toggle the all day switch', () => {
    const fixture = createComponent(true);
    const element = fixture.nativeElement as HTMLElement;
    const switchButton = element.querySelector('[role="switch"]') as HTMLButtonElement;

    expect(switchButton.getAttribute('aria-checked')).toBe('false');

    switchButton.click();
    fixture.detectChanges();

    expect(switchButton.getAttribute('aria-checked')).toBe('true');
  });

  it('should emit cancel and close when the cancel button is clicked', () => {
    const fixture = createComponent(true);
    const element = fixture.nativeElement as HTMLElement;
    let cancelled = false;

    fixture.componentInstance.cancel.subscribe(() => {
      cancelled = true;
    });

    const cancelButton = Array.from(element.querySelectorAll('button')).find((button) =>
      button.textContent?.includes('Cancelar'),
    );

    cancelButton?.click();
    fixture.detectChanges();

    expect(cancelled).toBe(true);
    expect(fixture.componentInstance.open()).toBe(false);
    expect(element.querySelector('[role="dialog"]')).toBeNull();
  });

  it('should close when Escape is pressed', () => {
    const fixture = createComponent(true);
    const element = fixture.nativeElement as HTMLElement;
    const dialog = element.querySelector('[role="dialog"]') as HTMLElement;

    dialog.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    fixture.detectChanges();

    expect(fixture.componentInstance.open()).toBe(false);
    expect(element.querySelector('[role="dialog"]')).toBeNull();
  });

  it('should pre-fill the form when an event is provided', () => {
    const fixture = TestBed.createComponent(EventModalComponent);
    fixture.componentRef.setInput('event', {
      id: 'event-1',
      title: 'Reunião de equipe',
      startDate: '2026-11-05',
      startTime: '08:30',
      endDate: '2026-11-05',
      endTime: '09:30',
      allDay: false,
      description: 'Alinhamento semanal',
      category: 'meeting',
      status: 'scheduled',
      location: 'Sala 2',
      repeat: 'none',
      reminder: '5',
    });
    fixture.componentRef.setInput('open', true);
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    const title = element.querySelector('#event-title') as HTMLInputElement;
    const startDate = element.querySelector('#event-start-date') as HTMLInputElement;
    const endDate = element.querySelector('#event-end-date') as HTMLInputElement;
    const category = element.querySelector('#event-category') as HTMLSelectElement;
    const status = element.querySelector('#event-status') as HTMLSelectElement;
    const repeat = element.querySelector('#event-repeat') as HTMLSelectElement;
    const reminder = element.querySelector('#event-reminder') as HTMLSelectElement;

    expect(element.querySelector('#event-modal-title')?.textContent).toContain('Editar Evento');
    expect(title.value).toBe('Reunião de equipe');
    expect(startDate.value).toBe('2026-11-05');
    expect(endDate.value).toBe('2026-11-05');
    expect(category.value).toBe('meeting');
    expect(status.value).toBe('scheduled');
    expect(repeat.value).toBe('none');
    expect(reminder.value).toBe('5');
  });
});
