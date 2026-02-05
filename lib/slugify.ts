export function slugify(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric characters with dashes
      .replace(/^-+|-+$/g, '') // Trim dashes from start and end
      .substring(0, 50); // Limit slug length
  }
  