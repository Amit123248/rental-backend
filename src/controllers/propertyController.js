const Property = require("../models/Property");

/**
 * OWNER: Create Property
 */
exports.createProperty = async (req, res) => {
  try {
    const { title, description, rent, location, images } = req.body;

    const property = await Property.create({
      owner: req.user._id,
      title,
      description,
      rent,
      location,
      images,
    });

    res.status(201).json({
      message: "Property created, waiting for admin approval",
      property,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * ADMIN: Approve Property
 */
exports.approveProperty = async (req, res) => {
  try {
    console.log("Property ID received:", req.params.id);

    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    property.isApproved = true;
    await property.save();

    res.json({ message: "Property approved successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * TENANT: View Approved Properties
 */
exports.getApprovedProperties = async (req, res) => {
  try {
    const properties = await Property.find({ isApproved: true }).populate(
      "owner",
      "name email"
    );

    res.json(properties);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
