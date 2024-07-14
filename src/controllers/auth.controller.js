import { prisma } from "../app.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const saltRounds = 10;
const jwtSecret = process.env.JWT_SECRET;
const tokenExpiration = "24h";

/**
 * Registers a new user.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} The response object containing the user's email and username.
 * @throws {Object} The response object containing an error message.
 */
export async function registerUser(req, res) {
  const { email, password, username } = req.body;

  try {
    const userFound = await prisma.user.findUnique({ where: { email } });

    if (userFound) {
      return res.status(400).send({ message: "Email already in use" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Error checking user existence" });
  }

  let hashedPassword;

  try {
    hashedPassword = await bcrypt.hash(password, saltRounds);
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Error hashing password" });
  }

  let userNew;

  try {
    userNew = await prisma.user.create({
      data: { email, password: hashedPassword, username },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Error creating user" });
  }

  try {
    const token = jwt.sign(
      { id: userNew.id, email: userNew.email },
      jwtSecret,
      { expiresIn: tokenExpiration }
    );

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: 'None',
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24,
    });

    return res.send({ email: userNew.email, username: userNew.username });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Error generating token" });
  }
}

/**
 * Logs in a user with the provided email and password.
 * @param {Object} req - The request object.
 * @param {Object} req.body - The request body containing the email and password.
 * @param {string} req.body.email - The email of the user.
 * @param {string} req.body.password - The password of the user.
 * @param {Object} res - The response object.
 * @returns {Object} The response object containing the user's email and username if login is successful, or an error message if login fails.
 */
export async function loginUser(req, res) {
  const { email, password } = req.body;

  try {
    // Find the user with the email provided
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    // If the user is not found, return an error
    if (!user) {
      return res.status(400).send({ message: "Email or password incorrect" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).send({ message: "Email or password incorrect" });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, jwtSecret, {
      expiresIn: tokenExpiration,
    });

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: 'None',
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24,
    });

    return res.send({
      email: user.email,
      username: user.username,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "An error occurred during login" });
  }
}

/**
 * Logs out the user by clearing the token cookie and sending a response message.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} - The response object with a message indicating successful logout.
 */
export async function logoutUser(req, res) {
  res.clearCookie("token");
  return res.send({ message: "Logged out" });
}

export async function verifyUser(req, res) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).send({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);

    console.log(decoded)

    const user = await prisma.user.findUnique({
      where: {
        id: decoded.id,
      },
      select: {
        email: true,
        username: true,
      },
    });

    if (!user) {
      return res.status(401).send({ message: "Unauthorized" });
    }
   
    return res.status(200).send({ message: "User verified", user });
  } catch (error) {
    console.error(error);
    return res.status(401).send({ message: "Unauthorized" });
  }
}