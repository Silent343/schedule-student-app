/**
 * Shared-kernel concept: the academic subject ("materia") that every bounded
 * context agrees on. Modelled as a closed union so forms, color-coding and
 * filtering stay type-safe across contexts.
 */
export type Subject = 'math' | 'physics' | 'language' | 'cs' | 'other';

/** Catalog used to populate <select> controls. Labels resolve via i18n. */
export const SUBJECTS: ReadonlyArray<{ value: Subject; labelKey: string }> = [
  { value: 'math', labelKey: 'subject.math' },
  { value: 'physics', labelKey: 'subject.physics' },
  { value: 'language', labelKey: 'subject.language' },
  { value: 'cs', labelKey: 'subject.cs' },
  { value: 'other', labelKey: 'subject.other' },
];
