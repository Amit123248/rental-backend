const Lease = require("../models/Lease");
const RentalApplication = require("../models/RentalApplication");
const Property = require("../models/Property");

/**
 * OWNER creates lease after approving application
 */
exports.createLease = async (req, res) => {
  try {
    const { applicationId, startDate, endDate } = req.body;

    const application = await RentalApplication.findById(applicationId)
      .populate("property");

    if (!application)
      return res.status(404).json({ message: "Application not found" });

    if (application.status !== "approved")
      return res.status(400).json({ message: "Application not approved" });

    const property = await Property.findById(application.property._id);

    if (property.isOccupied)
      return res.status(400).json({ message: "Property already occupied" });

    const lease = await Lease.create({
      property: property._id,
      owner: application.owner,
      tenant: application.tenant,
      rentAmount: property.rent,
      startDate,
      endDate,
    });

    property.isOccupied = true;
    await property.save();

    res.status(201).json({
      message: "Lease created successfully",
      lease,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * TENANT views own lease
 */
exports.getTenantLease = async (req, res) => {
  try {
    const lease = await Lease.findOne({
      tenant: req.user._id,
      status: "active",
    })
      .populate("property", "title location")
      .populate("owner", "name email");

    res.json(lease);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
