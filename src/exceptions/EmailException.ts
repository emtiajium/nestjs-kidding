export default class EmailException extends Error {
  private readonly details: string;

  constructor(message: string, details?: unknown) {
    super(message);
    this.details = JSON.stringify(details);
  }
}
