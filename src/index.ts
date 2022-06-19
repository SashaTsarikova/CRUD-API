/* eslint-disable @typescript-eslint/no-var-requires */
import * as http from "http";
import { validate } from "uuid";
import * as dotenv from "dotenv";
import UsersServiceInst from "./services/UserService";
import { getRequestData } from "./utils/getRequestData";
import { createResp, createInvalidIdResp } from "./utils/createResp";

dotenv.config();

const { PORT } = process.env;

function isValidId(id: string): boolean {
  return validate(id);
}

const requestListener = async (
  req: http.IncomingMessage,
  res: http.ServerResponse
) => {
  try {
    const reqArr = req.url.split("/");
    if (req.url === "/api/users" || req.url.match(/\/api\/users\/[0-9a-z-]+/)) {
      if (req.method === "GET" && reqArr.length < 4) {
        await createResp(UsersServiceInst.getUsers.bind(UsersServiceInst), res);
      } else if (req.method === "POST" && reqArr.length === 3) {
        const data = await getRequestData(req);
        if (data instanceof Object) {
          await createResp(
            UsersServiceInst.createUser.bind(UsersServiceInst),
            res,
            201,
            data
          );
        }
      } else if (req.method === "GET" && reqArr.length === 4) {
        const userId = reqArr[3];
        if (isValidId(userId)) {
          await createResp(
            UsersServiceInst.getUserById.bind(UsersServiceInst, userId),
            res,
            200
          );
        } else {
          createInvalidIdResp(res, userId);
        }
      } else if (req.method === "PUT" && reqArr.length === 4) {
        const userId = reqArr[3];
        if (isValidId(userId)) {
          const data = await getRequestData(req);
          if (data instanceof Object) {
            await createResp(
              UsersServiceInst.updateUser.bind(UsersServiceInst, userId),
              res,
              200,
              data
            );
          }
        } else {
          createInvalidIdResp(res, userId);
        }
      } else if (req.method === "DELETE" && reqArr.length === 4) {
        const userId = reqArr[3];
        if (isValidId(userId)) {
          await createResp(
            UsersServiceInst.deleteUser.bind(UsersServiceInst, userId),
            res,
            204
          );
        } else {
          createInvalidIdResp(res, userId);
        }
      }
    } else if (req.url === "/api/to-test-error") {
      throw new Error("Some problems with server");
    } else {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Unknown endpoint" }));
    }
  } catch (err) {
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: err.message }));
  }
};

const server = http.createServer(requestListener);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

//  {
//   "username": "Sasha",
//   "age": 24,
//   "hobbies": ["music"],
// }
