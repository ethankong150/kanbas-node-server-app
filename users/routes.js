import * as dao from "./dao.js";
function UserRoutes(app) {
  const createUser = async (req, res) => {
    try{
      const user = await dao.createUser(req.body);
      res.json(user);
      console.log("User created")
    } catch (error) {
      res.status(400).json({ message: "Unable to create user" });
    }
  };
  const deleteUser = async (req, res) => {
    try{
      const status = await dao.deleteUser(req.params.userId);
      res.json(status);
      console.log("User deleted")
    } catch (error) {
      res.status(400).json({ message: "Unable to delete user" });
    }
  };
  const findAllUsers = async (req, res) => {
    try {
      const users = await dao.findAllUsers();
      res.json(users);
    } catch (error) {
      res.status(400).json({ message: "Unable to find users" });
    }
  };
  const findUserById = async (req, res) => {
    try {
      const user = await dao.findUserById(req.params.userId);
      res.json(user);
    } catch (error) {
      res.status(400).json({ message: "User not found" });
    }
  };
  const updateUser = async (req, res) => {
    try {
      const { userId } = req.params;
      const status = await dao.updateUser(userId, req.body);
      const currentUser = await dao.findUserById(userId);
      req.session['currentUser'] = currentUser;
      res.json(status);
      console.log("User updated")
    } catch (error) {
      res.status(400).json({ message: "Unable to update user" });
    }
  };
  const signup = async (req, res) => {
    try {
      const user = await dao.findUserByUsername(
        req.body.username);
      if (user) {
        res.status(400).json(
          { message: "Username already taken" });
      }
      const currentUser = await dao.createUser(req.body);
      req.session['currentUser'] = currentUser;
      res.json(currentUser);  
      console.log("User signed up: ", currentUser.username)
    } catch (error) {
      res.status(400).json({ message: "Unable to create new user" });
    }
  };
  const signin = async (req, res) => {
    try {
      const { username, password } = req.body;
      const currentUser = await dao.findUserByCredentials(username, password);
      req.session['currentUser'] = currentUser;
      res.status(200).json(currentUser);
      console.log("User signed in: ", currentUser.username)
    } catch (error) {
      res.status(400).json({ message: "Invalid credentials" });
    }
  };
  const signout = (req, res) => {
    req.session.destroy();
    res.json(200);
    console.log("User signed out")
  };
  const account = async (req, res) => {
    res.json(req.session['currentUser']);
  };

  app.post("/api/users", createUser);
  app.get("/api/users", findAllUsers);
  app.get("/api/users/:userId", findUserById);
  app.put("/api/users/:userId", updateUser);
  app.delete("/api/users/:userId", deleteUser);
  app.post("/api/users/signup", signup);
  app.post("/api/users/signin", signin);
  app.post("/api/users/signout", signout);
  app.post("/api/users/account", account);
}
export default UserRoutes;