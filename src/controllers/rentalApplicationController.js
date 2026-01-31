const RentalApplication = require("../models/RentalApplication");
const Property = require("../models/Property");
const notify = require("../utils/notify");

/**
 * TENANT applies for property
 */
exports.applyForProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.propertyId);

    if (!property || !property.isApproved) {
      return res.status(404).json({ message: "Property not available" });
    }

    const alreadyApplied = await RentalApplication.findOne({
      property: property._id,
      tenant: req.user._id,
    });

    if (alreadyApplied) {
      return res
        .status(400)
        .json({ message: "You have already applied" });
    }

    const application = await RentalApplication.create({
      property: property._id,
      tenant: req.user._id,
      owner: property.owner,
    });

    res.status(201).json({
      message: "Application submitted",
      application,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * OWNER views applications
 */
exports.getOwnerApplications = async (req, res) => {
  try {
    const applications = await RentalApplication.find({
      owner: req.user._id,
    })
      .populate("tenant", "name email")
      .populate("property", "title location rent");

    res.json(applications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * OWNER approves or rejects application
 */
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const application = await RentalApplication.findById(req.params.id);

    if (!application)
      return res.status(404).json({ message: "Application not found" });

    if (application.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    application.status = status;
    await application.save();

    // ✅ Notify TENANT about application status
    notify(req, application.tenant, {
      title: "Application Update",
      message: `Your rental application is ${status}`,
    });

    res.json({
      message: `Application ${status}`,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
