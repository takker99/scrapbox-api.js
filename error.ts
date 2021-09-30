export class HTTPError extends Error {
  constructor(message: string | Response) {
    super(typeof message === "string" ? message : JSON.stringify(message));
    this.name = "HTTPError";
    if (typeof message !== "string") this.response = message;
  }
  public response?: Response;
}
