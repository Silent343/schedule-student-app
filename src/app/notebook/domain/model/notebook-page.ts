/** A single page inside a notebook (value object within the Notebook aggregate). */
export class NotebookPage {
  readonly id: string;
  readonly heading: string;
  readonly content: string;

  constructor(props: { id: string; heading: string; content: string }) {
    this.id = props.id;
    this.heading = props.heading;
    this.content = props.content;
  }

  /** Rough reading size, used for the "N min" hint on the card. */
  get wordCount(): number {
    return this.content.trim() ? this.content.trim().split(/\s+/).length : 0;
  }
}
