const { identifyContact } = require("../services/contactServices");

exports.identify = async (req, res) => {
  try {
    const { email, phoneNumber } = req.body;
    if (!email && !phoneNumber) return res.status(400).json({ error: "Email or phoneNumber is required" });

    const result = await identifyContact(email, phoneNumber);
    return res.status(200).json(result);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
