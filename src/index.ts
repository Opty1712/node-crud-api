import "dotenv/config";
import http from "node:http";
import { users } from "./bd";
import { baseURL } from "./constants";
import { TypicalMessage } from "./types";
import {
  checkIsCorrectId,
  checkIsCorrectUser,
  genereateId,
  getId,
  parseJSON,
  sendMessage,
} from "./utils";

const server = http.createServer(async (request, response) => {
  if (!request.url?.startsWith(baseURL)) {
    sendMessage(response, { message: "URL not found", code: 404 });

    return;
  }

  const id = getId(request.url);
  const user = users[id];

  switch (request.method) {
    case "POST": {
      const result = await new Promise<TypicalMessage>((resolve, reject) => {
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
              resolve({
                message: "Wrong format",
                data: "Correct format is: {username: string; age: number; hobbies?: Array<string>}",
                code: 400,
              });
            }
          });
        } catch (e) {
          reject({ message: "Operation failed", code: 500 });
        }
      });

      sendMessage(response, result);
      break;
    }

    case "GET": {
      if (!id) {
        sendMessage(response, {
          message: "All users",
          data: Object.values(users),
        });
        return;
      }

      if (user) {
        sendMessage(response, { message: "User found", data: user });
      } else {
        sendMessage(response, { message: "User not found", code: 400 });
      }

      break;
    }

    case "PUT": {
      break;
    }

    case "DELETE": {
      const isCorrectId = checkIsCorrectId(id);

      if (!isCorrectId) {
        sendMessage(response, {
          message: "User not found",
          data: "You provided ID in incorrect format",
          code: 400,
        });

        return;
      }

      if (!user) {
        sendMessage(response, {
          message: "User not found",
          data: "Check if passed ID is correct",
          code: 400,
        });

        return;
      }

      delete users[id];
      sendMessage(response, { message: `User was deleted`, data: user });

      break;
    }
  }

  response.end();
});

server.listen(process.env.PORT, () =>
  console.log(`Server started at http://localost:${process.env.PORT}`)
);
