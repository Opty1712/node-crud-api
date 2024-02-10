import { TypicalMessage } from "./types";

export const baseURL = "/api/users";

export const invalidID: TypicalMessage = {
  message: "Invalid ID",
  data: "You provided ID in incorrect format",
  code: 400,
};

export const wrongID: TypicalMessage = {
  message: "User not found",
  data: "Check if passed ID is correct",
  code: 400,
};

export const wrongFormatPUT: TypicalMessage = {
  message: "Wrong format",
  data: "Correct format is: {username?: string; age?: number; hobbies?: Array<string>}",
  code: 400,
};

export const wrongFormatPOST: TypicalMessage = {
  ...wrongFormatPUT,
  data: "Correct format is: {username: string; age: number; hobbies?: Array<string>}",
};

export const notFound: TypicalMessage = {
  message: "User not found",
  code: 400,
};

export const fail: TypicalMessage = { message: "Operation failed", code: 500 };

export const wrongURL = { message: "URL not found", code: 404 };
