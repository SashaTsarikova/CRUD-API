import { v4 } from "uuid";
import { ICandidate, IUser } from "../interfaces/IUser";

class UsersService {
  public users: IUser[];

  constructor() {
    this.users = [];
  }

  async getUsers(): Promise<IUser[]> {
    return new Promise((res) => {
      res(this.users);
    });
  }

  async createUser({ username, age, hobbies }: ICandidate): Promise<IUser> {
    return new Promise((res, reg) => {
      if (
        username &&
        typeof username === "string" &&
        age &&
        typeof age === ("number" || "string") &&
        Array.isArray(hobbies)
      ) {
        const prepareUser = {
          username,
          age,
          hobbies,
          id: v4(),
        };
        this.users.push(prepareUser);
        res(prepareUser);
      } else {
        reg(
          new Error(
            "Not all required fields are represented or they have wrong types"
          )
        );
      }
    });
  }

  async getUserById(id: string): Promise<IUser> {
    return new Promise((res, reg) => {
      if (
        this.users.find((user: IUser) => {
          return user.id === id;
        })
      ) {
        res(this.users.find((user: IUser) => user.id === id));
      } else {
        reg(new Error(`Id equal to ${id} doesn't exists`));
      }
    });
  }

  async deleteUser(id: string): Promise<boolean> {
    return new Promise((res, reg) => {
      if (this.users.find((user: IUser) => user.id === id)) {
        const newArr = this.users.filter((user: IUser) => user.id !== id);
        this.users = newArr;
        res(true);
      } else {
        reg(new Error(`Record with id equal to ${id} doesn't exists`));
      }
    });
  }

  async updateUser(
    id: string,
    { username, age, hobbies }: ICandidate
  ): Promise<IUser> {
    return new Promise((res, reg) => {
      if (
        username &&
        typeof username === "string" &&
        age &&
        typeof age === ("number" || "string") &&
        Array.isArray(hobbies) &&
        this.users.find((user: IUser) => user.id === id)
      ) {
        const fieldToUpdate = this.users.find((user: IUser) => user.id === id);
        const index = this.users.findIndex((user: IUser) => user.id === id);
        const prepareUser = {
          username,
          age,
          hobbies,
          id: fieldToUpdate.id,
        };
        this.users[index] = prepareUser;
        res(prepareUser);
      } else {
        reg(
          new Error(
            "Check the id provided, Ensure that all required fields are represented or they have wrong types"
          )
        );
      }
    });
  }
}

export default new UsersService();
