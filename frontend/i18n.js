/**
 * SmartCivic AI - Multilingual (i18n) Engine
 * Supported Languages: English (en), Hindi (hi), Tamil (ta)
 */

const translations = {
    en: {
        brand_name: "SmartCivic AI",
        nav_home: "Home",
        nav_features: "Features",
        nav_about: "About",
        nav_login: "Login",
        nav_register: "Register",
        nav_logout: "Logout",
        nav_admin_portal: "Admin Portal ⚙️",
        nav_citizen_view: "Citizen View 👤",
        nav_report_issue: "Report an Issue",
        
        hero_badge: "🤖 AI-Powered Civic Management",
        hero_title: "Report Problems. Build Better Communities.",
        hero_desc: "SmartCivic AI helps citizens report civic problems and uses artificial intelligence to categorize, prioritize, and track complaints.",
        
        // Admin Command Center
        admin_brand: "SmartCivic Operations",
        admin_badge: "Municipal Admin",
        admin_title: "City Civic Command Center",
        admin_subtitle: "Real-time intake, AI triage, GPS dispatch, fraud moderation, and department routing.",
        admin_export_btn: "📥 Export CSV Report",
        
        // Metrics Cards
        stat_total: "Total Reports",
        stat_pending: "Pending",
        stat_pending_triage: "Pending Triage",
        stat_progress: "In Progress",
        stat_resolved: "Resolved",
        stat_flagged: "⚠️ Moderation Flagged",
        
        // Map Section
        admin_map_title: "📍 Citywide Incident Map (Active Complaints)",
        admin_map_legend: "🔴 High Priority  |  🟡 Medium  |  🟢 Resolved",
        
        // Filters & Search
        admin_search_ph: "Search citizen, title, category, ID...",
        filter_all: "All",
        filter_flagged: "⚠️ Flagged / Spam",
        filter_high: "High Priority",
        filter_pending: "Pending",
        filter_progress: "In Progress",
        filter_resolved: "Resolved",
        
        // Table Headers
        th_photo: "Photo",
        th_citizen: "Complaint ID & Citizen",
        th_issue: "Issue Title & Details",
        th_category: "Category (AI)",
        th_priority: "Priority",
        th_department: "Department",
        th_location: "Location / GPS",
        th_credibility: "AI Credibility",
        th_action: "Status Action",
        
        // Table Values & Actions
        btn_view_map: "📍 View on Map",
        btn_dismiss_flag: "Dismiss Flag",
        btn_flag_spam: "Flag Spam",
        tag_no_photo: "No photo",
        text_reported: "Reported",
        msg_no_complaints: "No complaints found matching criteria.",
        msg_loading: "Loading complaints from city database...",
        
        // Categories
        cat_road: "Road Damage",
        cat_garbage: "Garbage",
        cat_light: "Streetlight",
        cat_water: "Water Leakage",
        cat_drain: "Drainage",
        cat_other: "Other",
        
        // Priorities
        prio_high: "High",
        prio_medium: "Medium",
        prio_low: "Low",
        
        // Departments
        dept_not_assigned: "Not Assigned",
        dept_roads: "Roads & Highways",
        dept_sanitation: "Sanitation",
        dept_electrical: "Electrical Department",
        dept_water: "Water Supply",
        dept_drainage: "Drainage Department",
        dept_municipal: "Municipal Affairs",
        
        // Analytics Section
        admin_analytics_title: "📊 Municipal Complaint Analytics",
        admin_chart_cat: "Complaints by Category",
        admin_chart_dept: "Complaints by Department",
        
        // Report Page
        report_heading: "Report a Civic Issue",
        report_subheading: "Report civic problems in your area. Our AI analyzes and routes them to municipal officials.",
        report_back_btn: "← Dashboard",
        report_title_label: "Issue Title",
        report_title_ph: "e.g., Broken Streetlight on Main Rd",
        report_location_label: "Location / Landmark",
        report_location_ph: "Enter area name or landmark",
        report_gps_btn: "📍 Detect My Current Location",
        report_gps_detected: "GPS Location Detected!",
        report_gps_hint: "You can also drag the pin or click on the map to set exact coordinates.",
        report_photo_label: "Upload Issue Photo (Evidence)",
        report_photo_hint: "Drag & drop photo or click to browse (JPG, PNG, WebP up to 10MB)",
        report_desc_label: "Problem Description",
        report_desc_ph: "Describe the problem clearly (what happened, severity, duration)...",
        report_submit_btn: "Submit Complaint with AI Analysis",
        report_submitting: "Submitting & Analyzing with AI...",
        
        // Citizen Dashboard
        welcome_prefix: "Welcome",
        dash_welcome: "Welcome to Civic Portal",
        dash_subtext: "Track your submitted complaints and monitor resolution progress in real time.",
        dash_my_complaints: "My Reported Complaints",
        dash_updates_hint: "Updates automatically from SmartCity Control Room",
        dash_new_complaint: "+ Report New Issue",
        dash_empty_title: "No Complaints Filed Yet",
        dash_empty_desc: "You haven't reported any civic complaints yet. Notice something broken in your neighbourhood?",
        card_click_enlarge: "🔍 Click to enlarge",
        card_view_map_short: "(View Map ↗)",
        step_reported: "Reported",
        step_assigned: "Assigned Dept",
        moderation_desk_prefix: "Moderation Desk:",
        msg_resolved_note: "✓ Issue Resolved by Municipal Crew",
        msg_rate_resolution: "Rate resolution:",
        label_note: "Note:",
        
        // Chatbot
        chat_title: "CivicBot Assistant",
        chat_subtitle: "AI Municipal Help & Tracking",
        chat_input_ph: "Ask question or enter Complaint ID (SC-...)",
        chat_quick_track: "🔍 Track Complaint",
        chat_quick_emergency: "🚨 Emergency Contacts",
        chat_quick_how: "✍️ How to Report?"
    },
    hi: {
        brand_name: "स्मार्टसिविक एआई",
        nav_home: "होम",
        nav_features: "विशेषताएं",
        nav_about: "हमारे बारे में",
        nav_login: "लॉगिन",
        nav_register: "रजिस्टर",
        nav_logout: "लॉगआउट",
        nav_admin_portal: "एडमिन पोर्टल ⚙️",
        nav_citizen_view: "नागरिक पोर्टल 👤",
        nav_report_issue: "समस्या दर्ज करें",
        
        hero_badge: "🤖 एआई-संचालित नागरिक प्रबंधन",
        hero_title: "समस्याएं बताएं। बेहतर समुदाय बनाएं।",
        hero_desc: "स्मार्टसिविक एआई नागरिकों को नागरिक समस्याओं की रिपोर्ट करने और एआई द्वारा वर्गीकृत, प्राथमिकता और ट्रैक करने में मदद करता है।",
        
        // Admin Command Center
        admin_brand: "स्मार्टसिविक संचालन",
        admin_badge: "नगरपालिका व्यवस्थापक",
        admin_title: "नगर नागरिक कमांड सेंटर",
        admin_subtitle: "रीयल-टाइम शिकायतें, एआई वर्गीकरण, जीपीएस प्रेषण, धोखाधड़ी नियंत्रण और विभाग आवंटन।",
        admin_export_btn: "📥 CSV रिपोर्ट डाउनलोड करें",
        
        // Metrics Cards
        stat_total: "कुल शिकायतें",
        stat_pending: "लंबित",
        stat_pending_triage: "लंबित समीक्षा",
        stat_progress: "प्रगति पर",
        stat_resolved: "समाधान हुआ",
        stat_flagged: "⚠️ संदेहास्पद / ध्वजांकित",
        
        // Map Section
        admin_map_title: "📍 शहरव्यापी शिकायत मानचित्र (सक्रिय समस्याएं)",
        admin_map_legend: "🔴 उच्च प्राथमिकता  |  🟡 मध्यम  |  🟢 समाधान",
        
        // Filters & Search
        admin_search_ph: "नागरिक, शीर्षक, श्रेणी, आईडी खोजें...",
        filter_all: "सभी",
        filter_flagged: "⚠️ संदेहास्पद / स्पैम",
        filter_high: "उच्च प्राथमिकता",
        filter_pending: "लंबित",
        filter_progress: "प्रगति पर",
        filter_resolved: "समाधान हुआ",
        
        // Table Headers
        th_photo: "फोटो",
        th_citizen: "शिकायत आईडी और नागरिक",
        th_issue: "समस्या शीर्षक और विवरण",
        th_category: "श्रेणी (AI)",
        th_priority: "प्राथमिकता",
        th_department: "विभाग",
        th_location: "स्थान / जीपीएस",
        th_credibility: "AI विश्वसनीयता",
        th_action: "स्थिति बदलें",
        
        // Table Values & Actions
        btn_view_map: "📍 मैप पर देखें",
        btn_dismiss_flag: "चिह्न हटाएं",
        btn_flag_spam: "स्पैम चिह्नित करें",
        tag_no_photo: "फोटो नहीं",
        text_reported: "दर्ज तारीख",
        msg_no_complaints: "कोई शिकायत नहीं मिली।",
        msg_loading: "शहर डेटाबेस से शिकायतें लोड हो रही हैं...",
        
        // Categories
        cat_road: "सड़क क्षति (गड्ढे)",
        cat_garbage: "कचरा समस्या",
        cat_light: "स्ट्रीटलाइट",
        cat_water: "पानी का रिसाव",
        cat_drain: "जल निकासी / नाली",
        cat_other: "अन्य समस्या",
        
        // Priorities
        prio_high: "उच्च",
        prio_medium: "मध्यम",
        prio_low: "कम",
        
        // Departments
        dept_not_assigned: "आवंटित नहीं",
        dept_roads: "सड़क एवं राजमार्ग",
        dept_sanitation: "स्वच्छता विभाग",
        dept_electrical: "विद्युत विभाग",
        dept_water: "जल आपूर्ति विभाग",
        dept_drainage: "जल निकासी विभाग",
        dept_municipal: "नगर निगम मामले",
        
        // Analytics Section
        admin_analytics_title: "📊 नगर शिकायत विश्लेषण",
        admin_chart_cat: "श्रेणी अनुसार शिकायतें",
        admin_chart_dept: "विभाग अनुसार शिकायतें",
        
        // Report Page
        report_heading: "नागरिक समस्या दर्ज करें",
        report_subheading: "अपने क्षेत्र की नागरिक समस्याओं की रिपोर्ट करें। हमारा AI इसे वर्गीकृत कर अधिकारियों तक पहुंचाएगा।",
        report_back_btn: "← डैशबोर्ड",
        report_title_label: "समस्या का शीर्षक",
        report_title_ph: "उदा. मुख्य सड़क पर स्ट्रीटलाइट खराब",
        report_location_label: "स्थान / लैंडमार्क",
        report_location_ph: "क्षेत्र का नाम या पता दर्ज करें",
        report_gps_btn: "📍 मेरा वर्तमान स्थान पता करें (GPS)",
        report_gps_detected: "GPS स्थान सफलतापूर्वक प्राप्त!",
        report_gps_hint: "आप सटीक स्थान चुनने के लिए मानचित्र पर पिन खींच सकते हैं या क्लिक कर सकते हैं।",
        report_photo_label: "समस्या का फोटो अपलोड करें (सबूत)",
        report_photo_hint: "फोटो खींचें या अपलोड करें (JPG, PNG, 10MB तक)",
        report_desc_label: "समस्या का विवरण",
        report_desc_ph: "समस्या का स्पष्ट रूप से वर्णन करें (क्या हुआ, कब से है)...",
        report_submit_btn: "एआई विश्लेषण के साथ शिकायत दर्ज करें",
        report_submitting: "सबमिट हो रहा है और एआई विश्लेषण जारी है...",
        
        // Citizen Dashboard
        welcome_prefix: "स्वागत है",
        dash_welcome: "नागरिक पोर्टल में आपका स्वागत है",
        dash_subtext: "अपनी शिकायतों को ट्रैक करें और वास्तविक समय में समाधान देखें।",
        dash_my_complaints: "मेरी दर्ज की गई शिकायतें",
        dash_updates_hint: "स्मार्टसिटी नियंत्रण कक्ष से स्वचालित रूप से अपडेट होता है",
        dash_new_complaint: "+ नई समस्या दर्ज करें",
        dash_empty_title: "अभी तक कोई शिकायत दर्ज नहीं है",
        dash_empty_desc: "आपने अभी तक कोई शिकायत दर्ज नहीं की है। क्या आपके आस-पास कोई समस्या है?",
        card_click_enlarge: "🔍 बड़ा देखने के लिए क्लिक करें",
        card_view_map_short: "(मैप देखें ↗)",
        step_reported: "दर्ज किया गया",
        step_assigned: "विभाग आवंटित",
        moderation_desk_prefix: "समीक्षा डेस्क:",
        msg_resolved_note: "✓ नगर निगम टीम द्वारा समाधान पूर्ण",
        msg_rate_resolution: "समाधान का मूल्यांकन करें:",
        label_note: "टिप्पणी:",
        
        // Chatbot
        chat_title: "सिविकबॉट सहायक",
        chat_subtitle: "एआई नगर पालिका सहायता और ट्रैकिंग",
        chat_input_ph: "प्रश्न पूछें या शिकायत आईडी (SC-...) दर्ज करें",
        chat_quick_track: "🔍 स्थिति ट्रैक करें",
        chat_quick_emergency: "🚨 आपातकालीन नंबर",
        chat_quick_how: "✍️ शिकायत कैसे करें?"
    },
    ta: {
        brand_name: "ஸ்மார்ட்சிவிக் AI",
        nav_home: "முகப்பு",
        nav_features: "அம்சங்கள்",
        nav_about: "பற்றி",
        nav_login: "உள்நுழைக",
        nav_register: "பதிவுசெய்க",
        nav_logout: "வெளியேறு",
        nav_admin_portal: "நிர்வாகி தளம் ⚙️",
        nav_citizen_view: "குடிமக்கள் பார்வை 👤",
        nav_report_issue: "புகார் செய்க",
        
        hero_badge: "🤖 AI-ஆற்றல் கொண்ட நகர மேலாண்மை",
        hero_title: "சிக்கல்களை தெரிவியுங்கள். சிறந்த சமுதாயத்தை உருவாக்குங்கள்.",
        hero_desc: "ஸ்மார்ட்சிவிக் AI குடிமக்களுக்கு பொது பிரச்சனைகளை எளிதாக புகார் செய்யவும் AI மூலம் தீர்க்கவும் உதவுகிறது.",
        
        // Admin Command Center
        admin_brand: "ஸ்மார்ட்சிவிக் செயல்பாடுகள்",
        admin_badge: "நகராட்சி நிர்வாகி",
        admin_title: "நகர குடிமை கட்டுப்பாட்டு மையம்",
        admin_subtitle: "நிகழ்நேர புகார்கள், AI பகுப்பாய்வு, GPS கண்காணிப்பு, போலி தடுப்பு மற்றும் துறை ஒதுக்கீடு.",
        admin_export_btn: "📥 CSV அறிக்கையை பதிவிறக்கு",
        
        // Metrics Cards
        stat_total: "மொத்த புகார்கள்",
        stat_pending: "நிலுவையில்",
        stat_pending_triage: "நிலுவையில் உள்ளவை",
        stat_progress: "நடவடிக்கையில்",
        stat_resolved: "தீர்க்கப்பட்டது",
        stat_flagged: "⚠️ சந்தேகத்திற்குரியவை",
        
        // Map Section
        admin_map_title: "📍 நகர அளவிலான பிரச்சனை வரைபடம்",
        admin_map_legend: "🔴 அதிக முன்னுரிமை  |  🟡 நடுத்தரம்  |  🟢 தீர்க்கப்பட்டது",
        
        // Filters & Search
        admin_search_ph: "குடிமகன், தலைப்பு, வகை, எண் தேடுங்கள்...",
        filter_all: "அனைத்தும்",
        filter_flagged: "⚠️ சந்தேகத்திற்குரிய / ஸ்பேம்",
        filter_high: "அதிக முன்னுரிமை",
        filter_pending: "நிலுவையில்",
        filter_progress: "நடவடிக்கையில்",
        filter_resolved: "தீர்க்கப்பட்டது",
        
        // Table Headers
        th_photo: "புகைப்படம்",
        th_citizen: "புகார் எண் & குடிமகன்",
        th_issue: "பிரச்சனை தலைப்பு & விவரம்",
        th_category: "வகை (AI)",
        th_priority: "முன்னுரிமை",
        th_department: "துறை",
        th_location: "இடம் / GPS",
        th_credibility: "AI நம்பகத்தன்மை",
        th_action: "நிலை மாற்றம்",
        
        // Table Values & Actions
        btn_view_map: "📍 வரைபடத்தில் பார்க்க",
        btn_dismiss_flag: "நீக்கு",
        btn_flag_spam: "ஸ்பேம் குறிக்கவும்",
        tag_no_photo: "புகைப்படம் இல்லை",
        text_reported: "பதிவு செய்யப்பட்டது",
        msg_no_complaints: "புகார்கள் எதுவும் கிடைக்கவில்லை.",
        msg_loading: "புகார்கள் ஏற்றப்படுகின்றன...",
        
        // Categories
        cat_road: "சாலை சேதம் (பள்ளங்கள்)",
        cat_garbage: "குப்பை பிரச்சனை",
        cat_light: "தெருவிளக்கு பழுது",
        cat_water: "குடிநீர் கசிவு",
        cat_drain: "சாக்கடை வடிகால்",
        cat_other: "மற்ற பிரச்சனை",
        
        // Priorities
        prio_high: "அதிகம்",
        prio_medium: "நடுத்தரம்",
        prio_low: "குறைவு",
        
        // Departments
        dept_not_assigned: "ஒதுக்கப்படவில்லை",
        dept_roads: "சாலைகள் & நெடுஞ்சாலைகள்",
        dept_sanitation: "துப்புரவு துறை",
        dept_electrical: "மின்சாரத் துறை",
        dept_water: "குடிநீர் வழங்கல் துறை",
        dept_drainage: "வடிகால் துறை",
        dept_municipal: "நகராட்சி விவகாரங்கள்",
        
        // Analytics Section
        admin_analytics_title: "📊 நகராட்சி புகார் பகுப்பாய்வு",
        admin_chart_cat: "வகை வாரியான புகார்கள்",
        admin_chart_dept: "துறை வாரியான புகார்கள்",
        
        // Report Page
        report_heading: "குடிமை பிரச்சனையை பதிவு செய்க",
        report_subheading: "உங்கள் பகுதியில் உள்ள பிரச்சனைகளை பதிவு செய்யுங்கள். AI பகுப்பாய்வு செய்து உரிய துறைக்கு அனுப்பும்.",
        report_back_btn: "← கட்டுப்பாட்டு பலகை",
        report_title_label: "பிரச்சனை தலைப்பு",
        report_title_ph: "எ.கா: தெருவிளக்கு பழுது",
        report_location_label: "இடம் / அடையாளம்",
        report_location_ph: "பகுதி பெயர் அல்லது அடையாளம் உள்ளிடவும்",
        report_gps_btn: "📍 எனது தற்போதைய இடத்தை கண்டறிக (GPS)",
        report_gps_detected: "GPS இடம் கண்டறியப்பட்டது!",
        report_gps_hint: "சரியான இடத்தை தேர்வு செய்ய வரைபடத்தில் பின்னை நகர்த்தலாம்.",
        report_photo_label: "புகைப்படம் பதிவேற்றவும் (ஆதாரம்)",
        report_photo_hint: "புகைப்படத்தை தேர்ந்தெடுக்க கிளிக் செய்யவும் (10MB வரை)",
        report_desc_label: "பிரச்சனை விவரம்",
        report_desc_ph: "பிரச்சனையை தெளிவாக விவரிக்கவும் (எப்போது தொடங்கியது)...",
        report_submit_btn: "AI பகுப்பாய்வுடன் புகாரை சமர்ப்பிக்கவும்",
        report_submitting: "சமர்ப்பிக்கப்படுகிறது...",
        
        // Citizen Dashboard
        welcome_prefix: "வணக்கம்",
        dash_welcome: "குடிமக்கள் தளத்திற்கு நல்வரவு",
        dash_subtext: "உங்கள் புகார்களை கண்காணிக்கவும் தீர்வுகளை நிகழ்நேரத்தில் அறியவும்.",
        dash_my_complaints: "எனது புகார்கள்",
        dash_updates_hint: "ஸ்மார்ட்சிட்டி கட்டுப்பாட்டு அறையிலிருந்து தானாக புதுப்பிக்கப்படுகிறது",
        dash_new_complaint: "+ புதிய புகார் செய்க",
        dash_empty_title: "புகார்கள் எதுவும் இதுவரை இல்லை",
        dash_empty_desc: "நீங்கள் இதுவரை எந்த புகாரும் பதிவு செய்யவில்லை. உங்கள் பகுதியில் ஏதேனும் பிரச்சனையா?",
        card_click_enlarge: "🔍 பெரிதாக்க கிளிக் செய்க",
        card_view_map_short: "(வரைபடம் ↗)",
        step_reported: "பதிவு செய்யப்பட்டது",
        step_assigned: "துறை ஒதுக்கப்பட்டது",
        moderation_desk_prefix: "மதிப்பாய்வு பிரிவு:",
        msg_resolved_note: "✓ நகராட்சி குழுவால் பிரச்சனை தீர்க்கப்பட்டது",
        msg_rate_resolution: "மதிப்பீடு செய்க:",
        label_note: "குறிப்பு:",
        
        // Chatbot
        chat_title: "சிவிக்பாட் உதவியாளர்",
        chat_subtitle: "AI நகராட்சி உதவி & கண்காணிப்பு",
        chat_input_ph: "கேள்வி கேளுங்கள் அல்லது புகார் எண் உள்ளிடவும்",
        chat_quick_track: "🔍 நிலையை கண்காணிக்க",
        chat_quick_emergency: "🚨 அவசர எண்கள்",
        chat_quick_how: "✍️ புகார் செய்வது எப்படி?"
    }
};

const i18n = {
    currentLang: localStorage.getItem("smartcivic_lang") || "en",

    t: function (key) {
        const langData = translations[this.currentLang] || translations.en;
        return langData[key] || translations.en[key] || key;
    },

    translateStatus: function (status) {
        if (!status) return status;
        const map = {
            "Pending": "stat_pending",
            "In Progress": "stat_progress",
            "Resolved": "stat_resolved"
        };
        return this.t(map[status] || status);
    },

    translatePriority: function (prio) {
        if (!prio) return prio;
        const map = {
            "High": "prio_high",
            "Medium": "prio_medium",
            "Low": "prio_low"
        };
        return this.t(map[prio] || prio);
    },

    translateCategory: function (cat) {
        if (!cat) return cat;
        const map = {
            "Streetlight": "cat_light",
            "Garbage": "cat_garbage",
            "Road Damage": "cat_road",
            "Water Leakage": "cat_water",
            "Drainage": "cat_drain",
            "Other": "cat_other"
        };
        return this.t(map[cat] || cat);
    },

    translateDepartment: function (dept) {
        if (!dept) return dept;
        const map = {
            "Not Assigned": "dept_not_assigned",
            "Roads & Highways": "dept_roads",
            "Sanitation": "dept_sanitation",
            "Electrical Department": "dept_electrical",
            "Water Supply": "dept_water",
            "Drainage Department": "dept_drainage",
            "Municipal Affairs": "dept_municipal"
        };
        return this.t(map[dept] || dept);
    },

    setLanguage: function (lang) {
        if (!translations[lang]) return;
        this.currentLang = lang;
        localStorage.setItem("smartcivic_lang", lang);
        this.applyTranslations();

        // Sync dropdown
        const select = document.getElementById("langSelector");
        if (select) select.value = lang;

        // Broadcast event so active views re-render dynamic tables, charts & markers
        window.dispatchEvent(new CustomEvent("languageChanged", { detail: { lang } }));
    },

    applyTranslations: function () {
        // Elements with data-i18n
        document.querySelectorAll("[data-i18n]").forEach(el => {
            const key = el.getAttribute("data-i18n");
            el.textContent = this.t(key);
        });

        // Placeholders with data-i18n-ph
        document.querySelectorAll("[data-i18n-ph]").forEach(el => {
            const key = el.getAttribute("data-i18n-ph");
            el.setAttribute("placeholder", this.t(key));
        });

        // Buttons or inputs with data-i18n-val
        document.querySelectorAll("[data-i18n-val]").forEach(el => {
            const key = el.getAttribute("data-i18n-val");
            el.value = this.t(key);
        });
    },

    renderLanguageSelector: function (containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = `
            <div class="lang-selector-wrapper" style="display:inline-flex;align-items:center;margin-left:12px;">
                <span style="font-size:14px;margin-right:6px;">🌐</span>
                <select id="langSelector" style="background:rgba(255,255,255,0.15);color:inherit;border:1px solid rgba(255,255,255,0.3);border-radius:6px;padding:6px 10px;font-size:13px;cursor:pointer;outline:none;font-weight:600;">
                    <option value="en" ${this.currentLang === "en" ? "selected" : ""} style="color:#1e293b;">English</option>
                    <option value="hi" ${this.currentLang === "hi" ? "selected" : ""} style="color:#1e293b;">हिन्दी</option>
                    <option value="ta" ${this.currentLang === "ta" ? "selected" : ""} style="color:#1e293b;">தமிழ்</option>
                </select>
            </div>
        `;

        const select = document.getElementById("langSelector");
        if (select) {
            select.addEventListener("change", (e) => {
                this.setLanguage(e.target.value);
            });
        }
    },

    init: function (containerId = "langSelectorBox") {
        this.renderLanguageSelector(containerId);
        this.applyTranslations();
    }
};

// Auto initialize on DOM ready
document.addEventListener("DOMContentLoaded", () => {
    i18n.init();
});
