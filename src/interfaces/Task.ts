export class Task {
  protected _name: string;

  protected _description: string;

  get name(): string {
    return this._name;
  }

  get description(): string {
    return this._description;
  }

  constructor(name: string, description: string) {
    if (!name || description) {
      throw new Error("Name and description are required");
    }

    this._name = name;
    this._description = description;
  }
}
