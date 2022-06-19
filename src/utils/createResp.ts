import { ServerResponse } from "http";
import { ICandidate } from "../interfaces/IUser";

export async function createResp(
  fn: any,
  res: ServerResponse,
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

export function createInvalidIdResp(res: any, userId: string) {
  res.writeHead(400, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ message: `User id: ${userId} - is invalid` }));
}
