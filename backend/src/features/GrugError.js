
export class GrugError extends Error {
  error;

  constructor(error, message) {
    super(message);
    this.error = error;
  }
}