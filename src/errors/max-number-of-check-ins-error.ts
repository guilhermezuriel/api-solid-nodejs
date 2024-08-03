export class MaxNumberOfCheckInsError extends Error {
  constructor() {
    super('The max number of check-ins was reached');
  }
}
