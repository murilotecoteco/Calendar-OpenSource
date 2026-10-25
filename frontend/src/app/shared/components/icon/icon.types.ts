/**
 * Union type of all icon names supported by the application.
 *
 * Feature and page components should reference these names via AppIconComponent
 * instead of importing Lucide icons directly.
 */
export type AppIconName =
  // Navigation / UI — mapped to Lucide
  | 'calendar'
  | 'bell'
  | 'search'
  | 'chevron-left'
  | 'chevron-right'
  | 'chevron-down'
  | 'plus'
  | 'x'
  | 'mail'
  | 'lock'
  | 'eye'
  | 'eye-off'
  | 'user'
  | 'alert-circle'
  | 'check-circle'
  | 'menu'
  | 'sparkles'
  | 'zap'
  | 'loader-circle'
  | 'clock'
  | 'map-pin'
  | 'repeat'
  | 'save'
  // Sidebar navigation — custom SVGs (no Lucide equivalent)
  | 'dashboard'
  | 'upcoming'
  | 'history'
  | 'settings'
  | 'study-planner'
  | 'sharing';
