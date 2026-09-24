const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const { execFile } = require("child_process");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
require("dotenv").config();

const User = require("./models/User");
const Complaint = require("./models/Complaint");
const { analyzeComplaintAuthenticity } = require("./fraudDetection");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ensure uploads directory exists and serve statically
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}
app.use("/uploads", express.static(uploadDir));

// Multer Storage Configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname) || ".jpg";
        cb(null, `civic-${uniqueSuffix}${ext}`);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB limit
    fileFilter: function (req, file, cb) {
        if (!file.mimetype.startsWith("image/")) {
            return cb(new Error("Only image files are allowed!"), false);
        }
        cb(null, true);
    }
});

// Root Health Check
app.get("/", (req, res) => {
    res.send("SmartCivic AI Backend is Running with Advanced Civic Features");
});

// ==========================================
// AUTHENTICATION ROUTES
// ==========================================

// Register (Supports optional role: "citizen" or "admin")
app.post("/api/register", async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Please fill all required fields"
            });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                message: "Email already registered"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const assignedRole = role === "admin" ? "admin" : "citizen";

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role: assignedRole
        });

        await newUser.save();

        res.status(201).json({
            message: "Registration successful",
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role
            }
        });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ message: "Registration failed" });
    }
});

// Login (Returns role for RBAC routing)
app.post("/api/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Please enter email and password"
            });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        res.status(200).json({
            message: "Login successful",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role || "citizen"
            }
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Login failed" });
    }
});

// ==========================================
// COMPLAINT CLASSIFICATION & DEPARTMENT HELPER
// ==========================================
function assignDepartmentByCategory(category) {
    const cat = (category || "").trim().toLowerCase();
    if (cat.includes("drain") || cat.includes("sewer") || cat.includes("gutter") || cat.includes("manhole")) return "Drainage Department";
    if (cat.includes("road") || cat.includes("pothole")) return "Roads & Highways";
    if (cat.includes("garbage") || cat.includes("waste") || cat.includes("trash")) return "Sanitation";
    if (cat.includes("streetlight") || cat.includes("electric") || cat.includes("light")) return "Electrical Department";
    if (cat.includes("water") || cat.includes("leak")) return "Water Supply";
    return "Municipal Affairs";
}

function runPythonPrediction(description) {
    return new Promise((resolve) => {
        const potentialPythons = [
            "C:\\Users\\harit\\AppData\\Local\\Programs\\Python\\Python313\\python.exe",
            process.platform === "win32" ? "python" : "python3"
        ];
        const pythonPath = potentialPythons.find(p => fs.existsSync(p)) || (process.platform === "win32" ? "python" : "python3");
        const scriptPath = path.join(__dirname, "../ml/predict.py");

        execFile(pythonPath, [scriptPath, description], (error, stdout) => {
            if (error || !stdout) {
                // Heuristic Fallback if Python ML script fails or python is missing
                const desc = (description || "").toLowerCase();
                let category = "Road Damage";
                let priority = "Medium";

                if (desc.includes("manhole") || desc.includes("drain") || desc.includes("gutter") || desc.includes("sewer") || desc.includes("stagnant")) {
                    category = "Drainage";
                } else if (desc.includes("garbage") || desc.includes("trash") || desc.includes("waste") || desc.includes("bin")) {
                    category = "Garbage";
                } else if (desc.includes("light") || desc.includes("dark") || desc.includes("electric") || desc.includes("lamp") || desc.includes("bulb")) {
                    category = "Streetlight";
                } else if (desc.includes("water") || desc.includes("pipe") || desc.includes("leak") || desc.includes("overflow")) {
                    category = "Water Leakage";
                } else if (desc.includes("road") || desc.includes("pothole") || desc.includes("asphalt")) {
                    category = "Road Damage";
                }

                if (desc.includes("danger") || desc.includes("accident") || desc.includes("severe") || desc.includes("emergency") || desc.includes("open manhole") || desc.includes("hazard")) {
                    priority = "High";
                }

                return resolve({ category, priority });
            }

            const lines = stdout.trim().split("\n");
            const category = lines[0] ? lines[0].trim() : "Road Damage";
            const priority = lines[1] ? lines[1].trim() : "Medium";
            resolve({ category, priority });
        });
    });
}

// ==========================================
// COMPLAINT SUBMISSION (WITH GPS, IMAGE & FRAUD CHECK)
// ==========================================
app.post("/api/complaints", upload.single("image"), async (req, res) => {
    try {
        const {
            userId,
            title,
            location,
            description,
            latitude,
            longitude,
            address,
            imageTags
        } = req.body;

        if (!userId || !title || !location || !description) {
            return res.status(400).json({
                message: "Please fill all required fields"
            });
        }

        // 1. Run AI NLP Categorization & Priority (using both title and description)
        const combinedContext = `${title} ${description}`;
        const { category, priority } = await runPythonPrediction(combinedContext);
        const department = assignDepartmentByCategory(category);

        // 2. Process Uploaded Image
        let imageUrl = "";
        if (req.file) {
            imageUrl = `/uploads/${req.file.filename}`;
        }

        // Parse parsed GPS coordinates
        const parsedLat = latitude !== undefined && latitude !== "" ? parseFloat(latitude) : null;
        const parsedLng = longitude !== undefined && longitude !== "" ? parseFloat(longitude) : null;

        // 3. Proximity & Fraud Detection Check
        // Query recent complaints from last 48 hours for duplicate / fraud analysis
        const recentComplaints = await Complaint.find({
            createdAt: { $gte: new Date(Date.now() - 48 * 60 * 60 * 1000) }
        }).select("complaintId category latitude longitude location status createdAt");

        const authenticityResult = analyzeComplaintAuthenticity(
            {
                title,
                description,
                category,
                latitude: parsedLat,
                longitude: parsedLng,
                hasImage: Boolean(imageUrl)
            },
            recentComplaints
        );

        // 4. Generate Standard Complaint ID
        const complaintId = `SC-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`;

        // Parse image tags if provided
        let parsedTags = [];
        if (imageTags) {
            try {
                parsedTags = typeof imageTags === "string" ? JSON.parse(imageTags) : imageTags;
            } catch (e) {
                parsedTags = [imageTags];
            }
        }

        const complaint = new Complaint({
            complaintId,
            userId,
            title,
            category,
            location,
            latitude: parsedLat,
            longitude: parsedLng,
            address: address || location,
            description,
            priority,
            department,
            imageUrl,
            imageTags: parsedTags,
            credibilityScore: authenticityResult.credibilityScore,
            isFlagged: authenticityResult.isFlagged,
            flagReason: authenticityResult.flagReason,
            duplicateOf: authenticityResult.duplicateOf
        });

        await complaint.save();

        res.status(201).json({
            message: "Complaint submitted successfully",
            complaintId: complaintId,
            category: category,
            priority: priority,
            department: department,
            credibilityScore: authenticityResult.credibilityScore,
            isFlagged: authenticityResult.isFlagged,
            flagReason: authenticityResult.flagReason,
            duplicateOf: authenticityResult.duplicateOf,
            imageUrl: imageUrl
        });

    } catch (error) {
        console.error("Complaint submission error:", error);
        res.status(500).json({ message: "Failed to submit complaint" });
    }
});

// ==========================================
// COMPLAINT FETCH & LOOKUP ROUTES
// ==========================================

// Get All Complaints (Admin view)
app.get("/api/complaints", async (req, res) => {
    try {
        const complaints = await Complaint.find()
            .populate("userId", "name email role")
            .sort({ createdAt: -1 });

        res.status(200).json(complaints);
    } catch (error) {
        console.error("Fetch complaints error:", error);
        res.status(500).json({ message: "Failed to fetch complaints" });
    }
});

// Get Complaints by Specific User (Citizen view)
app.get("/api/complaints/user/:userId", async (req, res) => {
    try {
        const complaints = await Complaint.find({
            userId: req.params.userId
        }).sort({ createdAt: -1 });

        res.status(200).json(complaints);
    } catch (error) {
        console.error("Fetch user complaints error:", error);
        res.status(500).json({ message: "Failed to fetch user complaints" });
    }
});

// Track Single Complaint by Complaint ID (Chatbot & Quick Tracker)
app.get("/api/complaints/track/:complaintId", async (req, res) => {
    try {
        const cleanId = req.params.complaintId.trim().toUpperCase();
        const complaint = await Complaint.findOne({
            complaintId: { $regex: new RegExp(`^${cleanId}$`, "i") }
        }).populate("userId", "name");

        if (!complaint) {
            return res.status(404).json({
                message: "No complaint found with this ID. Please double-check the ID (format: SC-YYYY-XXXXXX)."
            });
        }

        res.status(200).json({
            complaintId: complaint.complaintId,
            title: complaint.title,
            category: complaint.category,
            priority: complaint.priority,
            department: complaint.department,
            status: complaint.status,
            location: complaint.location,
            address: complaint.address,
            createdAt: complaint.createdAt,
            resolutionNote: complaint.resolutionNote,
            isFlagged: complaint.isFlagged
        });
    } catch (error) {
        console.error("Track complaint error:", error);
        res.status(500).json({ message: "Error tracking complaint" });
    }
});

// ==========================================
// COMPLAINT MANAGEMENT ROUTES (STATUS & DEPT)
// ==========================================

// Update Status with optional resolution note
app.patch("/api/complaints/:id/status", async (req, res) => {
    try {
        const { status, resolutionNote } = req.body;
        const allowedStatuses = ["Pending", "In Progress", "Resolved"];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid status" });
        }

        let finalResolutionNote = resolutionNote;
        if (status === "Resolved" && (!finalResolutionNote || !finalResolutionNote.trim())) {
            const existing = await Complaint.findById(req.params.id);
            if (existing) {
                const cat = (existing.category || "").toLowerCase();
                const title = (existing.title || "").toLowerCase();
                const desc = (existing.description || "").toLowerCase();
                const text = `${title} ${desc} ${cat}`;

                if (text.includes("manhole")) {
                    finalResolutionNote = "Open manhole inspected, cleared, and safely secured with heavy-duty cast iron lid.";
                } else if (text.includes("drain") || text.includes("sewer") || text.includes("gutter") || (text.includes("water") && text.includes("stagnant"))) {
                    finalResolutionNote = "Drainage channel cleared and desilted; normal water flow restored.";
                } else if (text.includes("pothole") || (text.includes("road") && !text.includes("light"))) {
                    finalResolutionNote = "Road surface repaired, pothole filled and asphalt leveled.";
                } else if (text.includes("light") || text.includes("bulb") || text.includes("lamp")) {
                    finalResolutionNote = "Streetlight inspected and faulty components replaced; lighting restored.";
                } else if (text.includes("garbage") || text.includes("waste") || text.includes("trash")) {
                    finalResolutionNote = "Solid waste cleared by sanitation crew; area sanitized.";
                } else if (text.includes("water") || text.includes("leak") || text.includes("pipe")) {
                    finalResolutionNote = "Pipeline leakage repaired and water supply pressure normalized.";
                } else {
                    finalResolutionNote = `Issue "${existing.title || 'reported'}" inspected and resolved by municipal crew.`;
                }
            }
        }

        const updateData = { status };
        if (finalResolutionNote !== undefined) {
            updateData.resolutionNote = finalResolutionNote;
        }

        const complaint = await Complaint.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );

        if (!complaint) {
            return res.status(404).json({ message: "Complaint not found" });
        }

        res.status(200).json({
            message: "Status updated successfully",
            complaint: complaint
        });
    } catch (error) {
        console.error("Update status error:", error);
        res.status(500).json({ message: "Failed to update status" });
    }
});

// Update Category
app.patch("/api/complaints/:id/category", async (req, res) => {
    try {
        const { category } = req.body;
        const allowedCategories = [
            "Road Damage",
            "Garbage",
            "Streetlight",
            "Water Leakage",
            "Drainage",
            "Other"
        ];

        if (!allowedCategories.includes(category)) {
            return res.status(400).json({ message: "Invalid category" });
        }

        const complaint = await Complaint.findByIdAndUpdate(
            req.params.id,
            { category },
            { new: true }
        );

        if (!complaint) {
            return res.status(404).json({ message: "Complaint not found" });
        }

        res.status(200).json({
            message: "Category updated successfully",
            complaint
        });
    } catch (error) {
        console.error("Update category error:", error);
        res.status(500).json({ message: "Failed to update category" });
    }
});

// Update Department
app.patch("/api/complaints/:id/department", async (req, res) => {
    try {
        const { department } = req.body;
        const allowedDepartments = [
            "Roads & Highways",
            "Sanitation",
            "Electrical Department",
            "Water Supply",
            "Drainage Department",
            "Municipal Affairs",
            "Not Assigned"
        ];

        if (!allowedDepartments.includes(department)) {
            return res.status(400).json({ message: "Invalid department" });
        }

        const complaint = await Complaint.findByIdAndUpdate(
            req.params.id,
            { department: department },
            { new: true }
        );

        if (!complaint) {
            return res.status(404).json({ message: "Complaint not found" });
        }

        res.status(200).json({
            message: "Department updated successfully",
            complaint: complaint
        });
    } catch (error) {
        console.error("Update department error:", error);
        res.status(500).json({ message: "Failed to update department" });
    }
});

// Admin Flag / Unflag Moderation
app.patch("/api/complaints/:id/flag", async (req, res) => {
    try {
        const { isFlagged, flagReason } = req.body;
        const complaint = await Complaint.findByIdAndUpdate(
            req.params.id,
            { isFlagged: Boolean(isFlagged), flagReason: flagReason || "" },
            { new: true }
        );

        if (!complaint) {
            return res.status(404).json({ message: "Complaint not found" });
        }

        res.status(200).json({
            message: isFlagged ? "Complaint flagged for review" : "Flag dismissed",
            complaint
        });
    } catch (error) {
        console.error("Flag moderation error:", error);
        res.status(500).json({ message: "Failed to update flag state" });
    }
});

// Citizen Satisfaction Rating
app.patch("/api/complaints/:id/rating", async (req, res) => {
    try {
        const { rating } = req.body;
        const numRating = parseInt(rating);
        if (isNaN(numRating) || numRating < 1 || numRating > 5) {
            return res.status(400).json({ message: "Rating must be between 1 and 5" });
        }

        const complaint = await Complaint.findByIdAndUpdate(
            req.params.id,
            { citizenRating: numRating },
            { new: true }
        );

        if (!complaint) {
            return res.status(404).json({ message: "Complaint not found" });
        }

        res.status(200).json({ message: "Rating submitted successfully", complaint });
    } catch (error) {
        console.error("Rating error:", error);
        res.status(500).json({ message: "Failed to submit rating" });
    }
});

// ==========================================
// CIVIC AI CHATBOT ASSISTANT API
// ==========================================
app.post("/api/chat", async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) {
            return res.status(400).json({ reply: "Please ask a question or enter a complaint ID." });
        }

        const query = message.trim();
        const idMatch = query.match(/SC-\d{4}-\d{6}/i);

        // If query looks like or contains a Complaint ID
        if (idMatch) {
            const foundId = idMatch[0].toUpperCase();
            const complaint = await Complaint.findOne({
                complaintId: { $regex: new RegExp(`^${foundId}$`, "i") }
            });

            if (complaint) {
                return res.json({
                    reply: `📋 **Complaint #${complaint.complaintId}**\n\n- **Title:** ${complaint.title}\n- **Category:** ${complaint.category}\n- **Department:** ${complaint.department}\n- **Current Status:** 🟢 ${complaint.status}\n- **Priority:** ${complaint.priority}\n- **Location:** ${complaint.location}\n- **Date:** ${new Date(complaint.createdAt).toLocaleDateString()}${complaint.resolutionNote ? `\n- **Resolution Note:** ${complaint.resolutionNote}` : ""}`,
                    type: "status_result",
                    data: complaint
                });
            } else {
                return res.json({
                    reply: `Sorry, I couldn't find any complaint matching ID \`${foundId}\`. Please verify your complaint ID.`,
                    type: "not_found"
                });
            }
        }

        // Knowledge Base for Municipal & Civic Assistant
        const lower = query.toLowerCase();

        if (lower.includes("emergency") || lower.includes("police") || lower.includes("ambulance") || lower.includes("fire")) {
            return res.json({
                reply: `🚨 **Emergency Helpline Numbers:**\n\n- **National Emergency:** 112\n- **Police:** 100\n- **Fire Station:** 101\n- **Ambulance:** 102 / 108\n- **Disaster Helpline:** 1077\n- **Municipal Toll-Free:** 1913\n- **Women Helpline:** 1091`,
                type: "emergency"
            });
        }

        if (lower.includes("how to report") || lower.includes("new complaint") || lower.includes("file")) {
            return res.json({
                reply: `✍️ **How to File a Civic Complaint:**\n\n1. Go to the **Report Issue** page.\n2. Click **📍 Detect Location** to drop a GPS pin on the exact location.\n3. Snap or upload a photo of the problem (pothole, garbage, broken light).\n4. Provide a clear title and description.\n5. Click **Submit Complaint** — our AI will automatically classify the issue and route it to the proper municipal department!`,
                type: "guide"
            });
        }

        if (lower.includes("pothole") || lower.includes("road")) {
            return res.json({
                reply: `🛣️ Road damage and potholes are handled by the **Roads & Highways Department**. They are usually inspected within 24-48 hours. Please attach a photo and GPS location for rapid deployment of repair crews.`,
                type: "info"
            });
        }

        if (lower.includes("garbage") || lower.includes("waste") || lower.includes("trash")) {
            return res.json({
                reply: `🗑️ Overflowing garbage and missed pickups are routed to the **Sanitation Department**. Morning cleaning shifts typically resolve waste issues on the same day.`,
                type: "info"
            });
        }

        if (lower.includes("water") || lower.includes("leak") || lower.includes("pipe")) {
            return res.json({
                reply: `💧 Water pipe leaks and contamination are high-priority issues assigned to the **Water Supply Department**. Please provide the street name and landmark.`,
                type: "info"
            });
        }

        if (lower.includes("light") || lower.includes("streetlight") || lower.includes("dark")) {
            return res.json({
                reply: `💡 Faulty or flickering streetlights are managed by the **Electrical Department**. Mention the nearest pole number or landmark for faster replacement.`,
                type: "info"
            });
        }

        if (lower.includes("hello") || lower.includes("hi") || lower.includes("hey")) {
            return res.json({
                reply: `👋 Hello! I am **CivicBot**, your AI municipal assistant. You can ask me:\n- To track any complaint by typing its ID (e.g. \`SC-2026-123456\`)\n- Guidance on filing civic reports\n- Department responsibilities & emergency contacts`,
                type: "greeting"
            });
        }

        return res.json({
            reply: `I can help you track complaints, guide you through reporting civic issues, or connect you with municipal helplines. Try typing your **Complaint ID** (e.g. \`SC-2026-XXXXXX\`) or ask about potholes, garbage, or water issues.`,
            type: "default"
        });

    } catch (error) {
        console.error("Chatbot error:", error);
        res.status(500).json({ reply: "CivicBot service is momentarily unavailable." });
    }
});

// ==========================================
// SERVER INITIALIZATION
// ==========================================
process.on("unhandledRejection", (err) => {
    console.warn("MongoDB / Background warning:", err.message || err);
});

process.on("uncaughtException", (err) => {
    console.warn("Uncaught background exception:", err.message || err);
});

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
    console.log(`SmartCivic AI Server running on http://localhost:${PORT}`);
});

server.on("error", (err) => {
    console.error("Server listen error:", err);
});

// Keep-alive timer
setInterval(() => {}, 60000);

mongoose.connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 5000
})
    .then(() => {
        console.log("MongoDB connected successfully");
    })
    .catch((error) => {
        console.warn("MongoDB Atlas connection pending/failed (Ensure IP is whitelisted on MongoDB Atlas):", error.message);
    });