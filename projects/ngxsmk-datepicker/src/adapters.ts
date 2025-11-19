/**
 * Optional date adapters entry point
 * 
 * Import adapters separately to avoid bundling unused dependencies.
 * Only import the adapter you need:
 * 
 * @example
 * ```typescript
 * import { DateFnsAdapter } from 'ngxsmk-datepicker/adapters';
 * import { DayjsAdapter } from 'ngxsmk-datepicker/adapters';
 * import { LuxonAdapter } from 'ngxsmk-datepicker/adapters';
 * ```
 */

export { DateFnsAdapter } from './lib/adapters/date-fns-adapter';
export { DayjsAdapter } from './lib/adapters/dayjs-adapter';
export { LuxonAdapter } from './lib/adapters/luxon-adapter';

