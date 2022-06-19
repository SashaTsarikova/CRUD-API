/* eslint-disable import/prefer-default-export */
import { IncomingMessage } from "http";
import { ICandidate } from "../interfaces/IUser";

export const getRequestData = (
  request: IncomingMessage
): Promise<ICandidate | string> => {
  return new Promise((resolve, reject) => {
    try {
      let body = "";
      request.on("data", (chunk: Buffer) => {
        body += chunk.toString();
      });
      request.on("end", () => {
        if (request.headers["content-type"] === "application/json") {
          resolve(JSON.parse(body));
        } else {
          resolve(body);
        }
      });
    } catch (err) {
      reject(new Error("Problems with server"));
    }
  });
};
