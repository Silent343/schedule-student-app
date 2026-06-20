import { Subject } from '../../domain/model/subject';

interface SubjectStyle {
  /** CSS custom property holding the subject's accent color. */
  colorVar: string;
  /** i18n key for the human label. */
  labelKey: string;
}

const STYLES: Record<Subject, SubjectStyle> = {
  math:     { colorVar: 'var(--subject-math)',    labelKey: 'subject.math' },
  physics:  { colorVar: 'var(--subject-physics)', labelKey: 'subject.physics' },
  language: { colorVar: 'var(--subject-lang)',    labelKey: 'subject.language' },
  cs:       { colorVar: 'var(--subject-cs)',      labelKey: 'subject.cs' },
  other:    { colorVar: 'var(--subject-other)',   labelKey: 'subject.other' },
};

/** Presentation helper mapping a domain Subject to its color token + label key. */
export function subjectStyle(subject: Subject): SubjectStyle {
  return STYLES[subject] ?? STYLES.other;
}
