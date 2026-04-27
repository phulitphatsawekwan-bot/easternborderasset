const renderError = require("../utils/renderError");
const { clerkClient } = require('@clerk/express')

exports.authCheck = async (req, res, next) => {
  try {
    const { userId } = req.auth; // ✅ ไม่ต้อง ()

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await clerkClient.users.getUser(userId);

    req.user = user;
    next();
  } catch (error) {
    console.error("AUTH ERROR:", error); // 👈 เพิ่ม log
    next(error);
  }
};
