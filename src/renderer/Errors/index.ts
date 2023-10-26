/* eslint-disable @typescript-eslint/lines-between-class-members */
/* eslint-disable max-classes-per-file */
// Default Error to abstract name, context & originalError properties

class BazecorErrors extends Error {
  name: string;
  context: object;
  originalError: Error;

  constructor(message: string, context: object, oError: Error) {
    super(message);
    this.name = this.constructor.name;
    this.context = context;
    this.originalError = oError;
  }
}

// Flashing procedure errors

export class RestoringError extends BazecorErrors {
  constructor(message: string, originalError: Error, path: string, deviceInfo: object) {
    super(message, { path, deviceInfo }, originalError); // (1)
  }
}
