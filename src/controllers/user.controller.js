import { prisma } from "../app.js";
import { userUpdateSchema } from "../schemas/user.schema.js";

/**
 * Retrieves all users with pagination.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<Object>} The response object containing the users.
 */
export async function getAllUsers(req, res) {
  const { page = 1, limit = 10 } = req.query;

  try {
    const users = await prisma.user.findMany({
      skip: (page - 1) * limit,
      take: limit,
    });

    return res.send(users);
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Error getting users" });
  }
}

/**
 * Updates a user by their ID.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves when the user is updated.
 */
export async function updateUserById(req, res) {
  const { id } = req.params;

  try {
    const validatedData = userUpdateSchema.parse(req.body);

    if (validatedData.newPassword && !validatedData.lastPassword) {
      return res.status(400).send({ message: "Last password is required" });
    }

    const userFound = await prisma.user.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!userFound) {
      return res.status(404).send({ message: "User not found" });
    }

    if (validatedData.lastPassword) {
      const match = await bcrypt.compare(
        validatedData.lastPassword,
        userFound.password
      );
      if (!match) {
        return res.status(400).json({ message: "Last password is incorrect." });
      }

      validatedData.password = await bcrypt.hash(validatedData.newPassword, 10);
      delete validatedData.lastPassword;
      delete validatedData.newPassword;
    }

    const user = await prisma.user.update({
      where: {
        id: parseInt(id),
      },
      data: validatedData,
    });

    res.json({
      message: "User updated",
      user,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Error updating user" });
  }
}

/**
 * Retrieves a user by their ID.
 *
 * @param {import('express').Request} req - The request object.
 * @param {import('express').Response} res - The response object.
 * @returns {Promise<void>}
 */
export async function getUserById(req, res) {
  const { id } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    return res.send(user);
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Error getting user" });
  }
}

export async function deleteUser(req, res) {
  const { id } = req.params;

  try {
    await prisma.user.delete({
      where: {
        id: parseInt(id),
      },
    });

    return res.send({ message: "User deleted" });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Error deleting user" });
  }
}
