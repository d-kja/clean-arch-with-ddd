export class Slug {
  private constructor(private slug: string) {}

  static create(text: string) {
    return new Slug(text)
  }

  static fromText(text: string): Slug {
    const slugText = text
      .normalize('NFKD')
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '')
      .replace(/_/g, '-')
      .replace(/--+/g, '-')
      .replace(/-$/g, '')

    return new Slug(slugText)
  }

  get value() {
    return this.slug
  }
}
