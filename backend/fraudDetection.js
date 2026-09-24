/**
 * SmartCivic AI - Fraud, Fake & Duplicate Complaint Prevention Engine
 * 
 * Analyzes civic complaints for:
 * 1. Geographic & Category Duplicate Detection (< 350m within 48h)
 * 2. Spam / Gibberish / Malicious Content Filtering
 * 3. AI Credibility Scoring (0 - 100)
 */

// Earth radius in meters
const EARTH_RADIUS_METERS = 6371000;

function toRadians(degrees) {
    return (degrees * Math.PI) / 180;
}

/**
 * Calculates surface distance between two GPS coordinates using Haversine formula
 */
function calculateDistanceMeters(lat1, lon1, lat2, lon2) {
    if (lat1 === undefined || lon1 === undefined || lat2 === undefined || lon2 === undefined) {
        return null;
    }
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRadians(lat1)) *
        Math.cos(toRadians(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(EARTH_RADIUS_METERS * c);
}

/**
 * Common civic keywords that suggest genuine citizen reports
 */
const CIVIC_KEYWORDS = [
    "road", "pothole", "street", "light", "lamp", "garbage", "trash", "waste",
    "bin", "drain", "drainage", "water", "pipe", "leak", "leakage", "overflow",
    "sewer", "gutter", "pavement", "sidewalk", "traffic", "signal", "hazard",
    "broken", "damage", "damaged", "danger", "electric", "pole", "wire", "smell",
    "stench", "cleanup", "repair", "accident", "block", "blocked", "flood", "flooding"
];

/**
 * Detects keyboard mash or repetitive spam (e.g. "asdfasdf", "aaaaaaa", "123123")
 */
function isGibberishOrSpam(text) {
    if (!text || typeof text !== "string") return true;
    const clean = text.trim().toLowerCase();

    if (clean.length < 10) return true;

    // Repetitive characters (e.g., 'aaaaaa', 'zzzzzz')
    if (/(.)\1{4,}/.test(clean)) return true;

    // Check for keyboard row mash (e.g., asdfgh, qwerty)
    const keyboardMashePatterns = [
        "asdf", "hjkl", "qwerty", "zxcv", "12345", "testtest"
    ];
    let mashCount = 0;
    for (const pat of keyboardMashePatterns) {
        if (clean.includes(pat)) mashCount++;
    }
    if (mashCount >= 2) return true;

    // Low vowel check for long words
    const words = clean.split(/\s+/);
    let vowellessWords = 0;
    for (const word of words) {
        if (word.length > 5 && !/[aeiouy]/.test(word)) {
            vowellessWords++;
        }
    }
    if (vowellessWords >= 2) return true;

    return false;
}

/**
 * Main Fraud & Duplicate Analysis function
 * @param {Object} complaintData - Current submission details
 * @param {Array} existingComplaints - Recent active complaints from DB
 */
function analyzeComplaintAuthenticity(complaintData, existingComplaints = []) {
    const {
        title = "",
        description = "",
        category = "",
        latitude,
        longitude,
        hasImage = false
    } = complaintData;

    let credibilityScore = 70; // Base score
    let isFlagged = false;
    let flagReasons = [];
    let duplicateOf = null;

    const fullText = `${title} ${description}`.toLowerCase();

    // 1. Text Quality & Gibberish Check
    if (isGibberishOrSpam(description) || isGibberishOrSpam(title)) {
        credibilityScore -= 35;
        flagReasons.push("Spam or repetitive text pattern detected");
    }

    if (description.trim().length < 15) {
        credibilityScore -= 20;
        flagReasons.push("Insufficient problem description (< 15 characters)");
    }

    // 2. Civic Keyword Bonus
    const matchedKeywords = CIVIC_KEYWORDS.filter(kw => fullText.includes(kw));
    if (matchedKeywords.length >= 2) {
        credibilityScore = Math.min(100, credibilityScore + 10);
    }

    // 3. Geolocation verification bonus/check
    const hasCoordinates =
        typeof latitude === "number" &&
        typeof longitude === "number" &&
        !isNaN(latitude) &&
        !isNaN(longitude);

    if (hasCoordinates) {
        credibilityScore = Math.min(100, credibilityScore + 10);
    } else {
        credibilityScore -= 10;
        flagReasons.push("No GPS location coordinates provided");
    }

    // 4. Photo Proof Bonus
    if (hasImage) {
        credibilityScore = Math.min(100, credibilityScore + 15);
    } else {
        credibilityScore -= 10;
        flagReasons.push("No photo evidence attached");
    }

    // 5. Proximity & Duplicate Check (< 350m, same category, not resolved, within 48h)
    const normalizedCategory = (category || "").trim().toLowerCase();
    const twoDaysAgo = Date.now() - 48 * 60 * 60 * 1000;

    for (const existing of existingComplaints) {
        // Skip resolved complaints
        if (existing.status === "Resolved") continue;

        const existingTime = new Date(existing.createdAt).getTime();
        if (existingTime < twoDaysAgo) continue;

        const existingCategory = (existing.category || "").trim().toLowerCase();
        const categoryMatches =
            existingCategory &&
            (existingCategory === normalizedCategory ||
                existingCategory.includes(normalizedCategory) ||
                normalizedCategory.includes(existingCategory));

        if (categoryMatches && hasCoordinates && existing.latitude && existing.longitude) {
            const distance = calculateDistanceMeters(
                latitude,
                longitude,
                existing.latitude,
                existing.longitude
            );

            if (distance !== null && distance <= 350) {
                isFlagged = true;
                duplicateOf = existing.complaintId || existing._id.toString();
                credibilityScore = Math.max(15, credibilityScore - 40);
                flagReasons.push(
                    `Likely duplicate of nearby complaint #${existing.complaintId || "prior issue"} (~${distance}m away)`
                );
                break;
            }
        }
    }

    if (credibilityScore < 50 || flagReasons.length >= 2 || duplicateOf) {
        isFlagged = true;
    }

    return {
        credibilityScore: Math.max(5, Math.min(100, credibilityScore)),
        isFlagged,
        flagReason: flagReasons.join("; ") || "Verified Authenticity",
        duplicateOf
    };
}

module.exports = {
    calculateDistanceMeters,
    isGibberishOrSpam,
    analyzeComplaintAuthenticity
};
