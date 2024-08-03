export class MaxDistanceError extends Error {
  constructor() {
    super('The user is too distant from the gym to check-in');
  }
}
