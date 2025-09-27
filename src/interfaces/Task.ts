export class Task {
  protected name: string;

  protected description: string;

  constructor(name: string, description: string) {
    if (!name || description) {
      throw new Error("Name and description are required");
    }

    this.name = name;
    this.description = description;
  }
}
