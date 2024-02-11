import "dotenv/config";
import { createServer } from "node:http";
import { users } from "./bd";
import {
  baseURL,
  fail,
  wrongFormatPOST,
  wrongFormatPUT,
  wrongURL,
} from "./constants";
import { TypicalMessage } from "./types";
import {
  checkIsCorrectId,
  checkIsCorrectUser,
  genereateId,
  getId,
  getTypicalErrorMessage,
  parseJSON,
  sendMessage,
} from "./utils";

export const getServer = () =>
  createServer(async (request, response) => {
    const proceedMessage = (message: TypicalMessage) => {
      sendMessage(response, message);
    };

    try {
      if (!request.url?.startsWith(baseURL)) {
        proceedMessage(wrongURL);

        return;
      }

      const id = getId(request.url);
      const user = users[id];

      switch (request.method) {
        case "POST": {
          const result = await new Promise<TypicalMessage>(
            (resolve, reject) => {
              try {
                let userData = "";

                request.on("data", (chunk: string) => {
                  userData += chunk;
                });

                request.on("end", () => {
                  const newId = genereateId();
                  const newUser = { ...parseJSON(userData), id: newId };
                  const IsCorrectUser = checkIsCorrectUser(newUser);

                  if (IsCorrectUser) {
                    users[newId] = newUser;

                    resolve({
                      message: "User added",
                      data: newUser,
                      code: 201,
                    });
                  } else {
                    resolve(wrongFormatPOST);
                  }
                });
              } catch {
                reject(fail);
              }
            }
          );

          proceedMessage(result);
          break;
        }

        case "GET": {
          if (!id) {
            proceedMessage({
              message: "Existing users",
              data: Object.values(users),
            });

            return;
          }

          const isCorrectId = checkIsCorrectId(id);
          const typicalErrorMessage = getTypicalErrorMessage(isCorrectId, user);

          if (typicalErrorMessage) {
            proceedMessage(typicalErrorMessage);
            return;
          }

          proceedMessage({ message: "User found", data: user });

          break;
        }

        case "PUT": {
          const result = await new Promise<TypicalMessage>(
            (resolve, reject) => {
              try {
                let userData = "";

                request.on("data", (chunk: string) => {
                  userData += chunk;
                });

                request.on("end", () => {
                  const isCorrectId = checkIsCorrectId(id);

                  const typicalErrorMessage = getTypicalErrorMessage(
                    isCorrectId,
                    user
                  );

                  if (typicalErrorMessage) {
                    resolve(typicalErrorMessage);
                    return;
                  }

                  const parsedData = parseJSON(userData);
                  const newUser = { ...user, ...parsedData };

                  const IsCorrectUser =
                    parsedData &&
                    checkIsCorrectUser(newUser) &&
                    !("id" in parsedData);

                  if (IsCorrectUser) {
                    users[id] = newUser;

                    resolve({
                      message: "User updated",
                      data: newUser,
                    });
                  } else {
                    resolve(wrongFormatPUT);
                  }
                });
              } catch {
                reject(fail);
              }
            }
          );

          proceedMessage(result);
          break;
        }

        case "DELETE": {
          const isCorrectId = checkIsCorrectId(id);
          const typicalErrorMessage = getTypicalErrorMessage(isCorrectId, user);

          if (typicalErrorMessage) {
            proceedMessage(typicalErrorMessage);
            return;
          }

          delete users[id];
          proceedMessage({
            message: `User was deleted`,
            data: user,
            code: 204,
          });

          break;
        }
      }

      response.end();
    } catch {
      proceedMessage(fail);
    }
  });
