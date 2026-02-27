const prisma = require("../utils/prisma");
const bcrypt = require("bcryptjs");
const { signToken } = require("../utils/jwt");

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const withWriteRetry = async (fn, retries = 2) => {
  let attempt = 0;
  while (true) {
    try {
      return await fn();
    } catch (error) {
      const msg = String(error?.message || "").toLowerCase();
      const isLocked = msg.includes("database is locked") || msg.includes("sqlite_busy");
      if (!isLocked || attempt >= retries) {
        throw error;
      }
      attempt += 1;
      await sleep(120 * attempt);
    }
  }
};

const signUp = async (req, res) => {
  try {
    const { username, password } = req.body.user;
    const isUserExist = await prisma.user.findFirst({
      where: { username },
    });
    if (isUserExist) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { username, password: hashedPassword },
    });
    const token = signToken(user.id);
    return res.status(201).json({ user: { username: user.username }, token });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

const signIn = async (req, res) => {
  try {
    const { username, password } = req.body.user;
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = signToken(user.id);
    return res.status(200).json({ user: { username: user.username }, token });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

const signOut = async (req, res) => {
  try {
    return res.status(200).json({ message: "User logged out" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

const getUser = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        favoritePlayers: {
          include: {
            seasonStats: true,
            team: true,
          },
        },
        favoriteTeams: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    delete user.password;
    return res.status(200).json({ user });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

const checkUsername = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { username: req.query.username },
    });
    return res.json({ exists: !!user });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

const favoritePlayer = async (req, res) => {
  try {
    const playerId = Number.parseInt(req.params.playerId, 10);
    if (Number.isNaN(playerId)) {
      return res.status(400).json({ message: "Invalid playerId" });
    }

    const exists = await prisma.user.findFirst({
      where: {
        id: req.user.id,
        favoritePlayers: { some: { id: playerId } },
      },
      select: { id: true },
    });

    if (!exists) {
      await withWriteRetry(() =>
        prisma.user.update({
          where: { id: req.user.id },
          data: { favoritePlayers: { connect: { id: playerId } } },
        })
      );
    }

    const player = await prisma.player.findUnique({
      where: { id: playerId },
      include: { seasonStats: true, team: true },
    });

    return res.status(200).json({ player });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

const unfavoritePlayer = async (req, res) => {
  try {
    const playerId = Number.parseInt(req.params.playerId, 10);
    if (Number.isNaN(playerId)) {
      return res.status(400).json({ message: "Invalid playerId" });
    }

    const exists = await prisma.user.findFirst({
      where: {
        id: req.user.id,
        favoritePlayers: { some: { id: playerId } },
      },
      select: { id: true },
    });

    if (exists) {
      await withWriteRetry(() =>
        prisma.user.update({
          where: { id: req.user.id },
          data: { favoritePlayers: { disconnect: { id: playerId } } },
        })
      );
    }

    return res.status(200).json({ message: "Player unfavorited" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

const favoriteTeam = async (req, res) => {
  try {
    const teamId = Number.parseInt(req.params.teamId, 10);
    if (Number.isNaN(teamId)) {
      return res.status(400).json({ message: "Invalid teamId" });
    }

    const exists = await prisma.user.findFirst({
      where: {
        id: req.user.id,
        favoriteTeams: { some: { id: teamId } },
      },
      select: { id: true },
    });

    if (!exists) {
      await withWriteRetry(() =>
        prisma.user.update({
          where: { id: req.user.id },
          data: { favoriteTeams: { connect: { id: teamId } } },
        })
      );
    }

    const team = await prisma.team.findUnique({ where: { id: teamId } });
    return res.status(200).json({ team });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

const unfavoriteTeam = async (req, res) => {
  try {
    const teamId = Number.parseInt(req.params.teamId, 10);
    if (Number.isNaN(teamId)) {
      return res.status(400).json({ message: "Invalid teamId" });
    }

    const exists = await prisma.user.findFirst({
      where: {
        id: req.user.id,
        favoriteTeams: { some: { id: teamId } },
      },
      select: { id: true },
    });

    if (exists) {
      await withWriteRetry(() =>
        prisma.user.update({
          where: { id: req.user.id },
          data: { favoriteTeams: { disconnect: { id: teamId } } },
        })
      );
    }

    return res.status(200).json({ message: "Team unfavorited" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { username, password, newPassword } = req.body;
    if (newPassword && password) {
      const isPasswordValid = await bcrypt.compare(password, req.user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid password" });
      }
    }

    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        username,
        ...(newPassword && { password: await bcrypt.hash(newPassword, 10) }),
      },
    });

    return res.status(200).json({ user: { username: user.username } });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  signUp,
  signIn,
  signOut,
  getUser,
  checkUsername,
  favoritePlayer,
  unfavoritePlayer,
  favoriteTeam,
  unfavoriteTeam,
  updateUser,
};
