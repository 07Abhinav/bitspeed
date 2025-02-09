const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema(
  {
    phoneNumber: { type: String, default: null },
    email: { type: String, default: null },
    linkedId: { type: mongoose.Schema.Types.ObjectId, ref: "Contact", default: null },
    linkPrecedence: { type: String, enum: ["primary", "secondary"], required: true },
  },
  { timestamps: true }
);

const Contact = mongoose.model("Contact", contactSchema);
module.exports = Contact;
