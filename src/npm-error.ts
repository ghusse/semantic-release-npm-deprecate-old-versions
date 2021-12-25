export class NpmError extends Error {
  constructor(public readonly code: string, message: string, error: Error) {
    super(message);
    this.name = "NpmError";
    this.stack = error.stack;
  }
}
