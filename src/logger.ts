export interface Logger {
  log(message: string, ...args: any[]): void;
  error(message: string, ...args: any[]): void;
}
