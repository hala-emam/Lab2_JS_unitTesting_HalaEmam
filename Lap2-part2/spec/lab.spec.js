
// describe("lab testing:", () => {


//     describe("users routes:", () => {
//         // Note: user name must be sent in req query not req params
//         it("req to get(/search) ,expect to get the correct user with his name", async () => { })
//         it("req to get(/search) with invalid name ,expect res status and res message to be as expected", async () => { })

//         it("req to delete(/) ,expect res status to be 200 and a message sent in res", async () => { })
//     })


//     describe("todos routes:", () => {
//         it("req to patch(/) with id only ,expect res status and res message to be as expected", async () => { })
//         it("req to patch(/) with id and title ,expect res status and res to be as expected", async () => { })

//         it("req to get( /user) ,expect to get all user's todos", async () => { })
//         it("req to get( /user) ,expect to not get any todos for user hasn't any todo", async () => { })

//     })

//     afterAll(async () => {
//         await clearDatabase()
//     })


// })

const app = require("../index");
const request = require("supertest");
const req = request(app);
const userModel = require("../models/user");
const todosModel = require("../models/todo");

describe("lab testing:", () => {
  
  afterAll(async () => {
    await userModel.deleteMany();
  });

  describe("users routes:", () => {
  
    it("req to get(/search), expect to get the correct user with his name", async () => {
      const user = await userModel.create({ name: "hala" , email: "hala@gmail.com", password: "123"});
      const res = await req.get("/user/search").query({ name: "hala" });

      expect(res.status).toBe(200);
      expect(res.body.data.name).toBe("hala");
    });

    it("req to get(/search) with invalid name, expect res status and res message to be as expected", async () => {
      const res = await req.get("/user/search").query({ name: "Invalid Name" });

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("There is no user with name: Invalid Name");
    });

    it("req to delete(/), expect res status to be 200 and a message sent in res", async () => {
      const res = await req.delete("/user");

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("users have been deleted successfully");
    });
  });


  // testing todos
  describe("todos routes:", () => {
    let testTodoId;

    it("should update todo title by id", async () => {
        const user = await userModel.create({ name: "hala emam", email: "hala@gmail.com", password: "123" });
        const todo = await todosModel.create({ title: "Todo by hala", userId: "userId" });
        testTodoId = todo._id;

        const res = await req.patch(`/todo/${testTodoId}`).send({ title: "Updated Todo " });

        expect(res.status).toBe(200);
        expect(res.body.data.title).toBe("Updated Todo ");
    });

    it("should get all todos for a user", async () => {
        const user = await userModel.create({ name: "hala emam", email: "hala@gmail.com", password: "123" });
        await todosModel.create({ title: "Todo one", userId: user._id });

        const res = await req.get('/todo/user').set('Authorization', 'Bearer yourAuthToken');

        expect(res.status).toBe(200);
        expect(res.body.data.length).toBeGreaterThan(0);
    });

    it("should get no todos for a user if user has none", async () => {
        const user = await userModel.create({ name: "hala emam", email: "hala@gmail.com", password: "123" });
        const res = await req.get('/todo/user').set('Authorization', `Bearer ${validAuthToken}`);

        expect(res.status).toBe(200);
        expect(res.body.message).toBe("No todos found for the user");
    });

    // Test for error scenario - invalid todo ID
    it("should return error for invalid todo ID", async () => {
        
        const res = await req.patch(`/todo/invalid_id`).send({ title: "Updated Todo " });
        expect(res.status).toBe(400);
        expect(res.body.message).toBe("Invalid todo ID");
    });

    afterAll(async () => {
        await todosModel.deleteMany();
    });
  });
})
