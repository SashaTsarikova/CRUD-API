import request from "supertest";
import server from "../index";

describe("1 cценарий", () => {
  let id: string;

  const newUser = {
    username: "Sasha",
    age: 24,
    hobbies: ["music"],
  };

  const newUserUpdated = {
    username: "Sasha",
    age: 29,
    hobbies: ["music", "lezhats"],
  };

  it("Get all records with a GET api/users request (an empty array is expected)", async () => {
    const res = await request(server).get("/api/users");
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([]);

    server.close();
  });

  it("A new object is created by a POST api/users request (a response containing newly created record is expected)", async () => {
    const res = await request(server).post("/api/users").send(newUser);
    expect(res.statusCode).toBe(201);
    expect(res.body.id).toBeDefined();
    id = res.body.id;
    expect(res.body).toMatchObject(newUser);

    server.close();
  });

  it("With a GET api/user/{userId} request, we try to get the created record by its id (the created record is expected)", async () => {
    const res = await request(server).get(`/api/users/${id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toMatchObject(newUser);

    server.close();
  });

  it("We try to update the created record with a PUT api/users/{userId}request (a response is expected containing an updated object with the same id)", async () => {
    const res = await request(server)
      .put(`/api/users/${id}`)
      .send(newUserUpdated);
    expect(res.statusCode).toBe(200);
    expect(res.body).toMatchObject(newUserUpdated);

    server.close();
  });

  it("With a DELETE api/users/{userId} request, we delete the created object by id (confirmation of successful deletion is expected)", async () => {
    const res = await request(server).delete(`/api/users/${id}`);
    expect(res.statusCode).toBe(204);

    server.close();
  });

  it("With a GET api/users/{userId} request, we are trying to get a deleted object by id (expected answer is that there is no such object)", async () => {
    const res = await request(server).get(`/api/users/${id}`);
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toMatch(`Id equal to ${id} doesn't exists`);

    server.close();
  });
});

describe("2 cценарий", () => {
  const invalidId = "12345abcd";
  const nonexistentId = "a285d01d-5a31-4522-910a-319e06c28ffc";

  const lackFieldsUser = {
    username: "Sasha",
    hobbies: ["music", "lezhats"],
  };

  it("Try to connect with nonexistent endpoint (correspondent error message is expected)", async () => {
    const res = await request(server).get("/api/use");
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toMatch("Unknown endpoint");

    server.close();
  });

  it("Try to get user with invalid id (correspondent error message is expected)", async () => {
    const res = await request(server).get(`/api/users/${invalidId}`);
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(`User id: ${invalidId} - is invalid`);

    server.close();
  });

  it("Try to get user with nonexistent id (correspondent error message is expected)", async () => {
    const res = await request(server).get(`/api/users/${nonexistentId}`);
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toMatch(
      `Id equal to ${nonexistentId} doesn't exists`
    );

    server.close();
  });

  it("Try to create user with the lack of required fields (correspondent error message is expected)", async () => {
    const res = await request(server).post("/api/users").send(lackFieldsUser);
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toMatch(
      "Not all required fields are represented or they have wrong types"
    );

    server.close();
  });

  it("Test server error response (correspondent error message is expected)", async () => {
    const res = await request(server).get("/api/to-test-error");
    expect(res.statusCode).toBe(500);
    expect(res.body.message).toMatch("Some problems with server");

    server.close();
  });
});

describe("3 cценарий", () => {
  let id1: string;
  let id2: string;

  const user1 = {
    username: "Sasha",
    age: 24,
    hobbies: ["music"],
  };

  const user2 = {
    username: "Liza",
    age: 88,
    hobbies: ["cooking"],
  };

  const user1Updated = {
    username: "Sasha",
    age: 29,
    hobbies: ["music", "lezhats"],
  };

  it("Create 2 users (2 separate objects are expected)", async () => {
    const res1 = await request(server).post("/api/users").send(user1);
    expect(res1.statusCode).toBe(201);
    expect(res1.body.id).toBeDefined();
    id1 = res1.body.id;
    expect(res1.body).toMatchObject(user1);

    const res2 = await request(server).post("/api/users").send(user2);
    expect(res2.statusCode).toBe(201);
    expect(res2.body.id).toBeDefined();
    id2 = res2.body.id;
    expect(res2.body).toMatchObject(user2);
    server.close();
  });

  it("Check the users array with GET request (array of created objects is expected)", async () => {
    const res = await request(server).get("/api/users");
    expect(res.statusCode).toBe(200);
    expect(res.body).toMatchObject([user1, user2]);

    server.close();
  });

  it("Update the first user (the updated record is expected)", async () => {
    const res = await request(server)
      .put(`/api/users/${id1}`)
      .send(user1Updated);
    expect(res.statusCode).toBe(200);
    expect(res.body).toMatchObject(user1Updated);

    server.close();
  });

  it("Delete the second user (status 204 is expected)", async () => {
    const res = await request(server).delete(`/api/users/${id2}`);
    expect(res.statusCode).toBe(204);

    server.close();
  });

  it("Check the users array with GET request (array of updated one object is expected)", async () => {
    const res = await request(server).get("/api/users");
    expect(res.statusCode).toBe(200);
    expect(res.body).toMatchObject([user1Updated]);

    server.close();
  });

  it("Try to update the second user (error message is expected)", async () => {
    const res = await request(server)
      .put(`/api/users/${id2}`)
      .send(user1Updated);
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toMatch(
      "Check the id provided, Ensure that all required fields are represented or they have wrong types"
    );

    server.close();
  });
});
