const Property = require("../models/propertyModel");

const getAllProperties = async (req, res) => {
    try {
        const properties = await Property.find()
            .select("-images -description") 
            .populate("owner", "name email");
        res.status(200).json(properties);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

const addProperty = async (req, res) => {
    try {
        const { title, description, price, location } = req.body;
        const owner = req.user.id;

        if (!req.files || !req.files['coverImage']) {
            return res.status(400).json({ message: "Cover image is required" });
        }
        const coverImage = req.files['coverImage'][0].path;

        let images = [];
        if (req.files['images']) {
            images = req.files['images'].map(file => file.path);
        }

        if (!title || !description || !price || !location) {
            return res.status(400).json({ message: "Required text fields are missing" });
        }

        const property = new Property({
            title,
            description,
            price,
            location,
            coverImage,
            images,
            owner
        });

        await property.save();
        res.status(201).json({ message: "Property added successfully", property });
    } catch (error) {
        console.error("Add Property Error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

const getPropertyById = async (req, res) => {
    try {
        const property = await Property.findById(req.params.id).populate("owner", "name email");
        if (!property) {
            return res.status(404).json({ message: "Property not found" });
        }
        res.status(200).json(property);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

const getOwnerProperties = async (req, res) => {
    try {
        const properties = await Property.find({ owner: req.user.id }).select("-images -description");
        res.status(200).json(properties);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

const deleteProperty = async (req, res) => {
    try {
        const property = await Property.findById(req.params.id);
        if (!property) {
            return res.status(404).json({ message: "Property not found" });
        }
        if(property.owner.toString() !== req.user.id) {
            return res.status(403).json({ message: "Unauthorized to delete this property" });
        }

        await Property.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Property deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

module.exports = {
    getAllProperties,
    addProperty,
    getPropertyById,
    getOwnerProperties,
    deleteProperty
}