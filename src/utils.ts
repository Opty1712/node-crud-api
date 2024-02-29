import { IncomingMessage, ServerResponse } from "http";
import { v4, validate } from "uuid";
import { baseURL, invalidID, wrongID } from "./constants";
import { TypicalAnswer, TypicalMessage, User, UserToPut } from "./types";

export const genereateId = v4;

export const sendMessage = (
  response: ServerResponse<IncomingMessage> & {
    req: IncomingMessage;
  },
  message: TypicalMessage
) => {
  try {
    if (message.code) {
      response.writeHead(message.code);
    }

    response.write(JSON.stringify(message));
    response.end();
  } catch (e) {
    console.error(e);
  }
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

  if (Array.isArray(hobbies)) {
    return hobbies.every((hobby) => typeof hobby === "string");
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

export const getTypicalErrorMessage = (isCorrectId: boolean, user?: User) => {
  if (!isCorrectId) {
    return invalidID;
  }

  if (!user) {
    return wrongID;
  }
};

type FetchParams = {
  url: string;
  method?: "GET" | "POST" | "DELETE" | "PUT";
  body?: User | UserToPut;
};

export const typedFetch = async <T>({
  url,
  method = "GET",
  body,
}: FetchParams) => {
  try {
    return (await fetch(url, { method, body: JSON.stringify(body) }).then(
      (result) => result?.json()
    )) as TypicalAnswer<T>;
  } catch {
    return Promise.resolve({
      code: 500,
      message: "Internal server error",
      data: "",
    }) as Promise<TypicalAnswer<T>>;
  }
};
