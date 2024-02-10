import { IncomingMessage, ServerResponse } from "http";
import { v4, validate } from "uuid";
import { baseURL } from "./constants";
import { TypicalMessage, User } from "./types";

export const genereateId = v4;

export const sendMessage = (
  response: ServerResponse<IncomingMessage> & {
    req: IncomingMessage;
  },
  message: TypicalMessage
) => {
  if (message.code) {
    response.writeHead(message.code);
  }
  response.end(JSON.stringify(message));
};

export const getId = (url: string) => url.replace(baseURL, "").replace("/", "");

export const checkIsCorrectUser = (
  value: unknown | Partial<User>
): value is User => {
  if (!value || value === null || typeof value !== "object") {
    return false;
  }

  const age = "age" in value && value["age"];
  const username = "username" in value && value["username"];
  const id = "id" in value && value["id"];

  if (
    typeof username !== "string" ||
    typeof id !== "string" ||
    typeof age !== "number"
  ) {
    return false;
  }

  const hobbies = "hobbies" in value && value["hobbies"];

  if (!Array.isArray(hobbies)) {
    return false;
  }

  if (hobbies.some((hobby) => typeof hobby !== "string")) {
    return false;
  }

  return true;
};

export const parseJSON = (value: string) => {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};

export const checkIsCorrectId = (id: unknown) => {
  if (typeof id !== "string") {
    return false;
  }
  return validate(id);
};
