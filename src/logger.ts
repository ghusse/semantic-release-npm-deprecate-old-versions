/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Logger {
  log(message: string, ...args: any[]): void;
  error(message: string, ...args: any[]): void;
}
