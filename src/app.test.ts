import { getServer } from "./app";
import { baseURL } from "./constants";
import { TypicalAnswer, User } from "./types";

const server = getServer();

beforeAll(() => {
  server.listen(process.env.PORT);
});

afterAll(() => {
  server.close();
});

const typedFetch = async <T>(url: string, method = "GET") =>
  (await fetch(url, { method }).then((result) =>
    result.json()
  )) as TypicalAnswer<T>;

const url = `http://localhost:${process.env.PORT}${baseURL}`;

describe("Adding user", () => {
  it("empty initial users", async () => {
    const result = await typedFetch<User[]>(url);
    expect(result.data.length).toBe(0);
  });

  it("empty initial users", async () => {
    const result = await typedFetch<User[]>(url);
    expect(result.data.length).toBe(0);
  });
});
