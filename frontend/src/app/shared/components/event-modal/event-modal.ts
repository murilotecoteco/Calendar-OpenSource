import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  model,
  output,
  signal,
} from '@angular/core';
import {
  AbstractControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { AppIconComponent } from '../icon/icon';

/**
 * Static options used by the event modal.
 * API integration is intentionally out of scope for issue #206.
 */
export const EVENT_CATEGORIES = [
  { value: 'personal', label: 'Pessoal (Azul)' },
  { value: 'work', label: 'Trabalho' },
  { value: 'meeting', label: 'Reunião' },
  { value: 'study', label: 'Estudo' },
] as const;

export const EVENT_STATUSES = [
  { value: 'scheduled', label: 'Agendado' },
  { value: 'completed', label: 'Concluído' },
  { value: 'cancelled', label: 'Cancelado' },
] as const;

export const EVENT_REPEAT_OPTIONS = [
  { value: 'none', label: 'Não se repete' },
  { value: 'daily', label: 'Todos os dias' },
  { value: 'weekly', label: 'Toda semana' },
  { value: 'monthly', label: 'Todo mês' },
] as const;

export const EVENT_REMINDER_OPTIONS = [
  { value: '5', label: '5 minutos antes' },
  { value: '10', label: '10 minutos antes' },
  { value: '30', label: '30 minutos antes' },
  { value: '60', label: '1 hora antes' },
] as const;

export type EventCategory = (typeof EVENT_CATEGORIES)[number]['value'];
export type EventStatus = (typeof EVENT_STATUSES)[number]['value'];
export type EventRepeat = (typeof EVENT_REPEAT_OPTIONS)[number]['value'];
export type EventReminder = (typeof EVENT_REMINDER_OPTIONS)[number]['value'];

export interface EventFormValue {
  title: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  allDay: boolean;
  description: string;
  category: EventCategory;
  status: EventStatus;
  location: string;
  repeat: EventRepeat;
  reminder: EventReminder;
}

/** Data used to pre-fill the modal when editing an existing event. */
export interface EventModalData extends EventFormValue {
  id?: string;
}

export type EventModalField =
  | 'title'
  | 'startDate'
  | 'startTime'
  | 'endDate'
  | 'endTime'
  | 'allDay'
  | 'description'
  | 'category'
  | 'status'
  | 'location'
  | 'repeat'
  | 'reminder';

/** Ensures the end date/time is strictly later than the start date/time. */
function endTimeAfterStartTimeValidator(): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const startDate = group.get('startDate')?.value;
    const startTime = group.get('startTime')?.value;
    const endDate = group.get('endDate')?.value;
    const endTime = group.get('endTime')?.value;

    if (!startDate || !startTime || !endDate || !endTime) {
      return null;
    }

    const start = new Date(`${startDate}T${startTime}`);
    const end = new Date(`${endDate}T${endTime}`);

    return end.getTime() > start.getTime() ? null : { endTimeBeforeStart: true };
  };
}

/**
 * Static modal for creating and editing events.
 *
 * Usage:
 *   <app-event-modal [(open)]="isModalOpen" [event]="eventToEdit" (save)="onSave($event)" />
 *
 * The component only handles UI state and validation. Persisting the event is
 * the responsibility of the parent component.
 */
@Component({
  selector: 'app-event-modal',
  standalone: true,
  imports: [ReactiveFormsModule, AppIconComponent],
  templateUrl: './event-modal.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventModalComponent {
  private readonly formBuilder = inject(NonNullableFormBuilder);

  /** Two-way binding that controls whether the modal is visible. */
  readonly open = model(false);

  /** When provided, the modal opens in edit mode pre-filled with this data. */
  readonly event = input<EventModalData | null>(null);

  /** Emits the normalized form value when a valid event is saved. */
  readonly save = output<EventFormValue>();

  /** Emits when the user dismisses the modal without saving. */
  readonly cancel = output<void>();

  /** Tracks whether the form has been submitted at least once. */
  protected readonly submitted = signal(false);

  protected readonly categories = EVENT_CATEGORIES;
  protected readonly statuses = EVENT_STATUSES;
  protected readonly repeatOptions = EVENT_REPEAT_OPTIONS;
  protected readonly reminderOptions = EVENT_REMINDER_OPTIONS;

  protected readonly isEditing = computed(() => this.event() !== null);

  protected readonly form = this.formBuilder.group(
    {
      title: ['', [Validators.required, Validators.pattern(/\S/), Validators.maxLength(120)]],
      startDate: ['', [Validators.required]],
      startTime: ['', [Validators.required]],
      endDate: ['', [Validators.required]],
      endTime: ['', [Validators.required]],
      allDay: [false],
      description: ['', [Validators.maxLength(500)]],
      category: ['personal' as EventCategory],
      status: ['scheduled' as EventStatus],
      location: ['', [Validators.maxLength(120)]],
      repeat: ['none' as EventRepeat],
      reminder: ['5' as EventReminder],
    },
    { validators: endTimeAfterStartTimeValidator() },
  );

  constructor() {
    // Reset the form every time the modal is opened.
    effect(() => {
      if (this.open()) {
        this.fillForm(this.event());
        this.submitted.set(false);
      }
    });

    // Prevent the page behind the modal from scrolling while it is open.
    effect((onCleanup) => {
      if (typeof document === 'undefined' || !this.open()) {
        return;
      }

      const previousOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';

      onCleanup(() => {
        document.body.style.overflow = previousOverflow;
      });
    });
  }

  /** Returns true when a field error should be displayed. */
  protected showError(field: EventModalField, errorCode: string): boolean {
    const control = this.form.controls[field];
    return (control.touched || this.submitted()) && control.hasError(errorCode);
  }

  /** Returns true when any of the provided errors should be displayed for a field. */
  protected hasFieldError(field: EventModalField, ...errorCodes: string[]): boolean {
    return errorCodes.some((errorCode) => this.showError(field, errorCode));
  }

  protected hasTitleError(): boolean {
    return this.hasFieldError('title', 'required', 'pattern');
  }

  protected hasStartError(): boolean {
    return (
      this.hasFieldError('startDate', 'required') || this.hasFieldError('startTime', 'required')
    );
  }

  protected hasEndError(): boolean {
    return (
      this.hasFieldError('endDate', 'required') ||
      this.hasFieldError('endTime', 'required') ||
      this.showEndTimeOrderError()
    );
  }

  /** Returns true when the end date/time is not later than the start date/time. */
  protected showEndTimeOrderError(): boolean {
    const endDate = this.form.controls.endDate;
    const endTime = this.form.controls.endTime;
    const shouldEvaluate = endDate.touched || endTime.touched || this.submitted();

    return (
      shouldEvaluate &&
      !!endDate.value &&
      !!endTime.value &&
      this.form.hasError('endTimeBeforeStart')
    );
  }

  protected toggleAllDay(): void {
    const control = this.form.controls.allDay;
    control.setValue(!control.value);
    control.markAsDirty();
  }

  protected onSubmit(): void {
    this.submitted.set(true);

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const raw = this.form.getRawValue();

    this.save.emit({
      title: raw.title.trim(),
      startDate: raw.startDate,
      startTime: raw.startTime,
      endDate: raw.endDate,
      endTime: raw.endTime,
      allDay: raw.allDay,
      description: raw.description.trim(),
      category: raw.category,
      status: raw.status,
      location: raw.location.trim(),
      repeat: raw.repeat,
      reminder: raw.reminder,
    });

    this.close();
  }

  protected onCancel(): void {
    this.cancel.emit();
    this.close();
  }

  private close(): void {
    this.open.set(false);
    this.submitted.set(false);
  }

  private fillForm(event: EventModalData | null): void {
    const today = this.today();

    this.form.reset({
      title: event?.title ?? '',
      startDate: event?.startDate ?? today,
      startTime: event?.startTime ?? '',
      endDate: event?.endDate ?? today,
      endTime: event?.endTime ?? '',
      allDay: event?.allDay ?? false,
      description: event?.description ?? '',
      category: event?.category ?? 'personal',
      status: event?.status ?? 'scheduled',
      location: event?.location ?? '',
      repeat: event?.repeat ?? 'none',
      reminder: event?.reminder ?? '5',
    });
  }

  /** Returns today's date in the local timezone as YYYY-MM-DD. */
  private today(): string {
    const now = new Date();
    const localTime = new Date(now.getTime() - now.getTimezoneOffset() * 60_000);

    return localTime.toISOString().slice(0, 10);
  }
}
