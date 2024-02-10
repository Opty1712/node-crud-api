export type User = {
  id: string;
  username: string;
  age: number;
  hobbies?: Array<string>;
};

export type UserToPut = Omit<User, "id">;
