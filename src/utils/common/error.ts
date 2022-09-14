export class CommonError extends Error {}

export class ExhaustiveCheckError extends CommonError {
  constructor(val: never) {
    super(`[ExhaustiveCheckError] with nonexhaustive value: ${val}`);
  }
}
