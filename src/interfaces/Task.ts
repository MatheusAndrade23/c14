export class Task {
  constructor(props?: Partial<Task>) {
    Object.assign(this, props);
  }

  name!: string;

  description!: string;
}
