export type User = {
  id: string;
  username: string;
  age: number;
  hobbies?: Array<string>;
};

export type UserToPut = Omit<User, "id">;

export type TypicalMessage = {
  message: string;
  data?: string | Record<string, unknown> | Array<unknown>;
  code?: number;
};

export type TypicalAnswer<T> = {
  message: string;
  data: T;
  code?: number;
};
