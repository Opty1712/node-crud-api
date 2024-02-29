import { getServer } from "./app";

const server = getServer();

server.listen(process.env.PORT, () =>
  console.log(`Server started at http://localost:${process.env.PORT}`)
);
