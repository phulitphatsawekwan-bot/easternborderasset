const renderError = require("../utils/renderError");
const prisma = require('../config/prisma')

exports.createProfile = async (req, res, next) => {
  try {
    const { firstname, lastname } = req.body;
    const { id } = req.user;

    const email = req.user.emailAddresses?.[0]?.emailAddress;

    if (!id) {
      return res.status(400).json({ message: "No user id" });
    }

    if (!email) {
      return res.status(400).json({ message: "No email" });
    }

    const profile = await prisma.profile.upsert({
      where: { clerkId: id },
      create: {
        firstname,
        lastname,
        email,
        clerkId: id,
      },
      update: {
        firstname,
        lastname,
        email,
      },
    });

    res.json({ result: profile, message: "Created Profile" });
  } catch (error) {
    console.error("CREATE PROFILE ERROR:", error); // 👈 สำคัญ
    next(error);
  }
};
