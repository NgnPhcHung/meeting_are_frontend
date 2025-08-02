import { ServerError, ServerParseError } from "@apollo/client";

export enum HttpStatus {
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  PAYMENT_REQUIRED = 402,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  METHOD_NOT_ALLOWED = 405,
  NOT_ACCEPTABLE = 406,
  REQUEST_TIMEOUT = 408,
  CONFLICT = 409,
  URI_TOO_LONG = 414,
  UNPROCESSABLE_ENTITY = 422,
  TOO_MANY_REQUESTS = 429,
  REQUEST_HEADER_FIELDS_TOO_LARGE = 431,
  UNAVAILABLE_FOR_LEGAL_REASONS = 451,
  INTERNAL_SERVER_ERROR = 500,
}

export const ServerErrorCode = {
  "0000-0000": "App error",
  "1000-0000": "Not found",
  "1000-0001": "Invalid token",
  "1000-0002": "Invalid user",
  "1000-0003": "User already exists",
  "1000-0004": "Invalid credentials",
  "1000-0005": "Token is missing",
  "1000-0006": "Blacklisted token",
  "1000-0007": "Failed to decode auth",
  "1000-0008": "Invalid credentials",
  "1000-0009": "Invalid credentials",
  "1000-0010": "Room already exists",
  "1000-0011": "Max number of rooms reached",
  "1000-0012": "Room does not exist",
};

export interface ServerException {
  statusCode: HttpStatus | number;
  error: string;
  message: string;
  errorCode: keyof typeof ServerErrorCode;
}
export interface InnerServerExceptionDetails {
  statusCode: HttpStatus | number;
  error: string;
  message: string;
  errorCode: keyof typeof ServerErrorCode;
}

export interface OuterServerExceptionWrapper {
  statusCode: HttpStatus | number;
  timestamp?: string;
  exception: InnerServerExceptionDetails;
  [key: string]: any;
}

export interface GraphQLExtensions {
  exception?: OuterServerExceptionWrapper;
  code?: string;
  [key: string]: any;
}

export class GraphqlCustomError extends Error {
  public name: string = "GraphqlCustomError";
  public readonly details?: InnerServerExceptionDetails;
  public readonly originalGraphqlErrorMessage?: string;

  constructor(
    details?: InnerServerExceptionDetails,
    graphqlErrorMessage?: string,
  ) {
    let message: string;

    if (details) {
      if (details.errorCode) {
        message = ServerErrorCode[details.errorCode];
      } else if (details.message) {
        message = details.message;
      } else {
        message = `Server responded with status ${details.statusCode || "unknown"}: ${details.error || "Unknown Error"}`;
      }
    } else {
      message = graphqlErrorMessage || "An unexpected GraphQL error occurred.";
    }

    super(message);
    Object.setPrototypeOf(this, GraphqlCustomError.prototype);
    this.details = details;
    this.originalGraphqlErrorMessage = graphqlErrorMessage;
  }
}

export class NetworkOperationError extends Error {
  public name: string = "NetworkOperationError";
  public readonly originalError?: ServerError | ServerParseError | Error;

  constructor(
    message: string,
    originalError?: ServerError | ServerParseError | Error,
  ) {
    super(message);
    Object.setPrototypeOf(this, NetworkOperationError.prototype);
    this.originalError = originalError;
  }
}
