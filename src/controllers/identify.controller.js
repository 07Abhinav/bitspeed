const { Op } = require("sequelize");
const Contact = require("../models/contact.model");

exports.identifyContact = async (req, res) => {
  try {
    const { email, phoneNumber } = req.body;

    if (!email && !phoneNumber) {
      return res.status(400).json({ message: "Email or Phone Number is required" });
    }

    // Find existing contacts with matching email or phoneNumber
    const existingContacts = await Contact.findAll({
      where: {
        [Op.or]: [{ email }, { phoneNumber }],
      },
    });

    if (existingContacts.length === 0) {
      // Create a new primary contact
      const newContact = await Contact.create({
        email,
        phoneNumber,
        linkPrecedence: "primary",
      });

      return res.json({
        contact: {
          primaryContactId: newContact.id,
          linkedId: null,
          linkPrecedence: "primary",
          emails: [newContact.email].filter(Boolean),
          phoneNumbers: [newContact.phoneNumber].filter(Boolean),
          secondaryContactIds: [],
        },
      });
    }

    // Identify the primary contact
    let primaryContact = existingContacts.find(c => c.linkPrecedence === "primary") || existingContacts[0];

    let emails = new Set();
    let phoneNumbers = new Set();
    let secondaryContactIds = [];
    let linkedId = null;

    for (const contact of existingContacts) {
      emails.add(contact.email);
      phoneNumbers.add(contact.phoneNumber);

      if (contact.linkPrecedence === "secondary") {
        secondaryContactIds.push(contact.id);
        linkedId = contact.linkedId;
      }
    }

    // If new data is present, create a secondary contact
    if (
      (!emails.has(email) && email) ||
      (!phoneNumbers.has(phoneNumber) && phoneNumber)
    ) {
      const newSecondary = await Contact.create({
        email,
        phoneNumber,
        linkedId: primaryContact.id,
        linkPrecedence: "secondary",
      });

      secondaryContactIds.push(newSecondary.id);
      emails.add(email);
      phoneNumbers.add(phoneNumber);
      linkedId = primaryContact.id;
    }

    res.json({
      contact: {
        primaryContactId: primaryContact.id,
        linkedId: linkedId,
        linkPrecedence: primaryContact.linkPrecedence,
        emails: [...emails].filter(Boolean),
        phoneNumbers: [...phoneNumbers].filter(Boolean),
        secondaryContactIds,
      },
    });
  } catch (error) {
    console.error("Error identifying contact:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
