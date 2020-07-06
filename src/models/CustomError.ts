class CustomError extends Error {
  statusCode: number;

  constructor(args: any, statusCode: number) {
    super(args);
    this.statusCode = statusCode;
  }
}

export default CustomError;
