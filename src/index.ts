/* eslint-disable @typescript-eslint/no-var-requires */
import * as http from "http";
import { v4, validate } from "uuid";
import { ICandidate, IUser } from "./interfaces/IUser";
import UsersServiceInst from "./services/UserService";
import { getRequestData } from "./utils/getRequestData";

const HOSTNAME = "localhost";
const PORT = 8080;

async function createResp(
  fn: any,
  res: any,
  code = 200,
  data?: string | ICandidate
) {
  try {
    let instance;
    if (data) {
      instance = await fn(data);
    } else {
      instance = await fn();
    }
    res.writeHead(code, { "Content-Type": "application/json" });
    res.end(JSON.stringify(instance));
  } catch (err) {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: err.message }));
  }
}

function isValidId(id: string) {
  return validate(id);
}

function createInvalidIdResp(res: any, userId: string) {
  res.writeHead(400, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ message: `User id: ${userId} - is invalid` }));
}

const requestListener = async (req: any, res: any) => {
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
  } else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Unknown endpoint" }));
  }
};

const server = http.createServer(requestListener);
server.listen(PORT, HOSTNAME, () => {
  console.log(`Server is running on port ${PORT}`);
});

server.on("error", (err: Error, socket: any) => {
  socket.writeHead(500, { "Content-Type": "application/json" });
  socket.end(JSON.stringify({ message: "Some problems with server" }));
});

//  {
//   "username": "Sasha",
//   "age": 24,
//   "hobbies": ["music"],
// }
