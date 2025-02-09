const { Op } = require("sequelize");
const Contact = require("../models/contact.model");

async function identifyContact(email, phoneNumber) {
  const contacts = await Contact.findAll({
    where: {
      [Op.or]: [{ email }, { phoneNumber }]
    }
  });

  let primaryContact = contacts.find(c => c.linkPrecedence === "primary");
  
  if (!primaryContact) {
    // No existing contacts, create a new primary
    const newContact = await Contact.create({
      email,
      phoneNumber,
      linkPrecedence: "primary",
    });

    return formatResponse(newContact, []);
  }

  // Collect existing secondary contacts
  const secondaryContacts = contacts.filter(c => c.id !== primaryContact.id);
  
  // If new data is found, create a secondary contact
  if (!contacts.some(c => c.email === email && c.phoneNumber === phoneNumber)) {
    const newSecondary = await Contact.create({
      email,
      phoneNumber,
      linkedId: primaryContact.id,
      linkPrecedence: "secondary",
    });
    secondaryContacts.push(newSecondary);
  }

  return formatResponse(primaryContact, secondaryContacts);
}

function formatResponse(primaryContact, secondaryContacts) {
  return {
    contact: {
      primaryContatctId: primaryContact.id,
      emails: [primaryContact.email, ...new Set(secondaryContacts.map(c => c.email))].filter(Boolean),
      phoneNumbers: [primaryContact.phoneNumber, ...new Set(secondaryContacts.map(c => c.phoneNumber))].filter(Boolean),
      secondaryContactIds: secondaryContacts.map(c => c.id),
    },
  };
}

module.exports = { identifyContact };
