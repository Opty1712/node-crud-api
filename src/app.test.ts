import { getServer } from "./app";
import { baseURL } from "./constants";
import { User, UserToPut } from "./types";
import { genereateId, typedFetch } from "./utils";

const server = getServer();

beforeAll(() => {
  server.listen(process.env.PORT);
});

afterAll(() => {
  server.close();
});

const rootURL = `http://localhost:${process.env.PORT}`;
const url = `${rootURL}${baseURL}`;

describe("Server status", () => {
  it("correct answer on correct url", async () => {
    const result = await typedFetch<User[]>({ url });
    expect(result).toBeTruthy();
  });

  it("incorrect answer on incorrect url", async () => {
    const result = await typedFetch<User[]>({ url: `${rootURL}/123` });
    expect(result.code).toBe(404);
  });

  it("correct answer on non existing user", async () => {
    const result = await typedFetch<User[]>({ url: `${url}/${genereateId()}` });
    expect(result.code).toBe(404);
  });

  it("correct answer on user with incorrect id", async () => {
    const result = await typedFetch<User[]>({ url: `${url}/${123}` });
    expect(result.code).toBe(400);
  });
});

describe("Adding user", () => {
  let id = "";

  it("empty initial users", async () => {
    const result = await typedFetch<User[]>({ url });
    expect(result.data.length).toBe(0);
  });

  it("adding user", async () => {
    const newUser: UserToPut = { age: 10, username: "Abc" };

    const result = await typedFetch<User>({
      url,
      method: "POST",
      body: newUser,
    });

    id = result.data.id;
    expect(result.data.age).toBe(newUser["age"]);
    expect(result.data.username).toBe(newUser["username"]);
    expect(typeof result.data.id).toBe("string");
  });

  it("users have added user", async () => {
    const result = await typedFetch<User[]>({ url });
    expect(result.data.length).toBe(1);
  });

  it("check added user", async () => {
    const result = await typedFetch<User>({ url: `${url}/${id}` });
    expect(result.data.id).toBe(id);
  });
});

describe("Changing user", () => {
  let user: User = {} as User;

  it("get existing users", async () => {
    const result = await typedFetch<User[]>({ url });

    // save user to work with them further
    user = result.data[0] as User;
    expect(result.data.length).toBe(1);
  });

  it("modify age", async () => {
    const newUser: UserToPut = {
      age: 20,
      username: "Def",
      hobbies: ["beer", "sport"],
    };

    const result = await typedFetch<User>({
      url: `${url}/${user.id}`,
      method: "PUT",
      body: newUser,
    });

    // refresh saved user
    user = result.data;

    expect(result.data.age).toBe(newUser.age);
    expect(result.data.username).toBe(newUser.username);
    expect(result.data.hobbies).toEqual(newUser.hobbies);
  });

  it("check changed user", async () => {
    const result = await typedFetch<User>({ url: `${url}/${user.id}` });
    expect(result.data.age).toBe(user.age);
  });
});

describe("Deleting user", () => {
  let user: User = {} as User;

  it("get existing users", async () => {
    const result = await typedFetch<User[]>({ url });

    // save user to work with them further
    user = result.data[0] as User;
    expect(result.data.length).toBe(1);
  });

  it("delete age", async () => {
    await typedFetch<User>({
      url: `${url}/${user.id}`,
      method: "DELETE",
    });

    const result = await typedFetch<User>({ url: `${url}/${user.id}` });
    expect(result.code).toBe(404);
  });
});
