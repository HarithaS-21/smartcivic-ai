const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema({
    complaintId: {
        type: String,
        unique: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    title: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    latitude: {
        type: Number,
        default: null
    },
    longitude: {
        type: Number,
        default: null
    },
    address: {
        type: String,
        default: ""
    },
    description: {
        type: String,
        required: true
    },
    priority: {
        type: String,
        default: "Medium"
    },
    department: {
        type: String,
        default: "Not Assigned"
    },
    status: {
        type: String,
        default: "Pending"
    },
    imageUrl: {
        type: String,
        default: ""
    },
    imageTags: {
        type: [String],
        default: []
    },
    credibilityScore: {
        type: Number,
        default: 80
    },
    isFlagged: {
        type: Boolean,
        default: false
    },
    flagReason: {
        type: String,
        default: ""
    },
    duplicateOf: {
        type: String,
        default: null
    },
    resolutionNote: {
        type: String,
        default: ""
    },
    citizenRating: {
        type: Number,
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Complaint", complaintSchema);