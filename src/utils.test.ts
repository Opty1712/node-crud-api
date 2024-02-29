import { invalidID, wrongID } from "./constants";
import { getTypicalErrorMessage } from "./utils";

describe("getTypicalErrorMessage", () => {
  it("returns invalidID", () => {
    expect(getTypicalErrorMessage(false)).toBe(invalidID);
  });

  it("returns wrongID", () => {
    expect(getTypicalErrorMessage(true)).toBe(wrongID);
  });

  it("returns no error", () => {
    expect(getTypicalErrorMessage(true, { age: 1, id: "", username: "" })).toBe(
      undefined
    );
  });
});
