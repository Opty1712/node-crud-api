import "dotenv/config";
import http from "node:http";
import { users } from "./bd";
import { baseURL } from "./constants";
import {
  checkIsCorrectUser,
  genereateId,
  getId,
  parseJSON,
  sendMessage,
} from "./utils";

const server = http.createServer(async (request, response) => {
  if (!request.url?.startsWith(baseURL)) {
    response.writeHead(404);
    sendMessage(response, { message: "URL not found" });

    return;
  }

  const id = getId(request.url);
  const user = users[id];

  switch (request.method) {
    case "POST": {
      const result = await new Promise<Record<string, unknown>>(
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
                  user: newUser,
                });
              } else {
                resolve({
                  message: "Wrong format",
                  description:
                    "Correct format is: {username: string; age: number; hobbies?: Array<string>}",
                });
              }
            });
          } catch (e) {
            reject({ message: "Operation failed" });
          }
        }
      );

      sendMessage(response, result);
      break;
    }

    case "GET": {
      if (!id) {
        sendMessage(response, Object.values(users));
        return;
      }

      if (user) {
        sendMessage(response, user);
      } else {
        sendMessage(response, { message: "User not found" });
      }

      break;
    }

    case "PUT": {
      break;
    }

    case "DELETE": {
      if (user) {
        delete users[id];
        sendMessage(response, { message: `User ${id} was deleted` });
      } else {
        sendMessage(response, { message: "User not found" });
      }

      break;
    }
  }

  response.end();
});

server.listen(process.env.PORT, () =>
  console.log(`Server started at http://localost:${process.env.PORT}`)
);
