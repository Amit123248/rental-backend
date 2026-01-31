const Maintenance = require("../models/Maintenance");
const Lease = require("../models/Lease");

/**
 * TENANT creates maintenance request
 */
exports.createMaintenanceRequest = async (req, res) => {
  try {
    const { issue } = req.body;

    const lease = await Lease.findOne({
      tenant: req.user._id,
      status: "active",
    }).populate("property owner");

    if (!lease)
      return res.status(404).json({ message: "Active lease not found" });

    const request = await Maintenance.create({
      property: lease.property._id,
      tenant: lease.tenant,
      owner: lease.owner,
      issue,
    });

    res.status(201).json({
      message: "Maintenance request created",
      request,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * OWNER views maintenance requests
 */
exports.getOwnerMaintenanceRequests = async (req, res) => {
  try {
    const requests = await Maintenance.find({ owner: req.user._id })
      .populate("tenant", "name email")
      .populate("property", "title location");

    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * OWNER updates maintenance status
 */
exports.updateMaintenanceStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const request = await Maintenance.findById(req.params.id);

    if (!request)
      return res.status(404).json({ message: "Request not found" });

    if (request.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    request.status = status;
    await request.save();

    res.json({
      message: "Maintenance status updated",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
