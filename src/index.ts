import "dotenv/config";
import http from "node:http";

const baseURL = "/api/users";

const server = http.createServer(function (request, response) {
  if (!request.url?.startsWith(baseURL)) {
    response.writeHead(404);
    response.end(JSON.stringify({ message: "URL not found", code: 404 }));

    return;
  }

  console.log("Тип запроса:", request.method);
  // console.log(request.headers);

  response.end();
});

server.listen(process.env.PORT, () =>
  console.log(`Server started at http://localost:${process.env.PORT}`)
);
