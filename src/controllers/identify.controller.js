const Contact = require("../models/contact.model");

exports.identifyContact = async (req, res) => {
  try {
    const { email, phoneNumber } = req.body;
    if (!email && !phoneNumber) {
      return res.status(400).json({ message: "Email or Phone Number is required" });
    }

    // Find existing contacts with matching email or phoneNumber
    const existingContacts = await Contact.find({
      $or: [{ email }, { phoneNumber }],
    });

    if (existingContacts.length === 0) {
      // No contact exists, create a new primary contact
      const newContact = await Contact.create({
        email,
        phoneNumber,
        linkPrecedence: "primary",
      });

      return res.json({
        contact: {
          primaryContactId: newContact._id,
          emails: [newContact.email].filter(Boolean),
          phoneNumbers: [newContact.phoneNumber].filter(Boolean),
          secondaryContactIds: [],
        },
      });
    }

    // Identify the primary contact
    let primaryContact = existingContacts.find(c => c.linkPrecedence === "primary");
    if (!primaryContact) {
      primaryContact = existingContacts[0]; // Fallback to first contact
    }

    // Gather all unique emails, phoneNumbers, and secondary contact IDs
    let emails = new Set();
    let phoneNumbers = new Set();
    let secondaryContactIds = [];

    for (const contact of existingContacts) {
      emails.add(contact.email);
      phoneNumbers.add(contact.phoneNumber);
      if (contact._id.toString() !== primaryContact._id.toString()) {
        secondaryContactIds.push(contact._id);
      }
    }

    // If the current request has new information, create a secondary contact
    if (
      (!emails.has(email) && email) ||
      (!phoneNumbers.has(phoneNumber) && phoneNumber)
    ) {
      const newSecondary = await Contact.create({
        email,
        phoneNumber,
        linkedId: primaryContact._id,
        linkPrecedence: "secondary",
      });
      secondaryContactIds.push(newSecondary._id);
      emails.add(email);
      phoneNumbers.add(phoneNumber);
    }

    res.json({
      contact: {
        primaryContactId: primaryContact._id,
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
