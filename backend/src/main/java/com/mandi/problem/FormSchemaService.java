package com.mandi.problem;

import com.mandi.problem.dto.FormFieldDefinition;
import com.mandi.problem.dto.FormSchemaResponse;
import com.mandi.user.Role;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class FormSchemaService {

    public FormSchemaResponse getSchema(Role role, RequestType requestType, ProblemCategory category, ServiceType serviceType) {
        FormSchemaResponse response = new FormSchemaResponse();
        response.setRole(role != null ? role : Role.ROLE_CITIZEN);
        response.setRequestType(requestType != null ? requestType : RequestType.REPORT_PROBLEM);
        response.setCategory(category != null ? category : ProblemCategory.AGRICULTURE);
        response.setServiceType(serviceType);

        boolean isOffer = requestType != null && (
                requestType == RequestType.OFFER_SERVICE ||
                requestType == RequestType.OFFER_RESOURCE ||
                requestType == RequestType.OFFER_WORK ||
                requestType == RequestType.OFFER_PRODUCT
        );
        response.setOffer(isOffer);

        List<FormFieldDefinition> fields = new ArrayList<>();
        Map<String, Object> defaultValues = new LinkedHashMap<>();

        // Generate tailored fields based on intent & serviceType
        if (serviceType == ServiceType.TRACTOR) {
            if (isOffer) {
                populateTractorOfferFields(fields, defaultValues);
                response.setFormTitle("Tractor & Machinery Availability Offering (ट्रैक्टर व उपकरण उपलब्धता फॉर्म)");
                response.setFormTitleHi("ट्रैक्टर व कृषि उपकरण सेवा उपलब्धता");
                response.setFormDescription("Publish your tractor availability, pricing, horsepower, and service radius for nearby farmers.");
                response.setFormDescriptionHi("आस-पास के किसानों के लिए अपने ट्रैक्टर की उपलब्धता, हॉर्सपावर, किराया व कार्य क्षेत्र दर्ज करें।");
            } else {
                populateTractorRequestFields(fields, defaultValues);
                response.setFormTitle("Tractor & Agri Machinery Request (ट्रैक्टर व उपकरण मांग फॉर्म)");
                response.setFormTitleHi("ट्रैक्टर व कृषि उपकरण की मांग");
                response.setFormDescription("Specify land size, required horsepower, operator needs, date and time slots.");
                response.setFormDescriptionHi("जमीन का आकार, आवश्यक हॉर्सपावर, ड्राइवर की जरूरत व तारीख/समय विवरण दर्ज करें।");
            }
        } else if (serviceType == ServiceType.WATER_TANKER) {
            if (isOffer) {
                populateWaterTankerOfferFields(fields, defaultValues);
                response.setFormTitle("Water Tanker Supply Offering (जल टैंकर सेवा प्रदाता फॉर्म)");
                response.setFormTitleHi("जल टैंकर आपूर्ति उपलब्धता");
            } else {
                populateWaterTankerRequestFields(fields, defaultValues);
                response.setFormTitle("Emergency Water Tanker Request (जल टैंकर मांग फॉर्म)");
                response.setFormTitleHi("जल टैंकर की मांग");
            }
        } else if (serviceType == ServiceType.FARM_LABOUR || serviceType == ServiceType.SKILLED_LABOUR || serviceType == ServiceType.MASON || serviceType == ServiceType.PLUMBER || serviceType == ServiceType.ELECTRICIAN) {
            if (isOffer) {
                populateWorkerOfferFields(fields, defaultValues, serviceType);
                response.setFormTitle("Skilled Work & Labour Offering (कौशल व श्रमिक उपलब्धता)");
                response.setFormTitleHi("श्रम व कौशल सेवा प्रदाता");
            } else {
                populateWorkerRequestFields(fields, defaultValues, serviceType);
                response.setFormTitle("Hire Farm Labour & Skilled Workforce (श्रमिक व कारीगर मांग)");
                response.setFormTitleHi("श्रमिक व कारीगर की मांग");
            }
        } else if (category == ProblemCategory.HEALTHCARE || serviceType == ServiceType.MEDICAL_ASSISTANCE) {
            populateHealthcareFields(fields, defaultValues);
            response.setFormTitle("Community Healthcare & Patient Assistance (स्वास्थ्य व रोगी सहायता)");
            response.setFormTitleHi("स्वास्थ्य व चिकित्सा सहायता फॉर्म");
        } else if (category == ProblemCategory.ELECTRICITY || serviceType == ServiceType.TRANSFORMER_REPAIR) {
            populateElectricityFields(fields, defaultValues);
            response.setFormTitle("Power & Transformer Fault Report (विद्युत व ट्रांसफार्मर समस्या)");
            response.setFormTitleHi("बिजली व ट्रांसफार्मर शिकायत");
        } else if (category == ProblemCategory.EDUCATION || serviceType == ServiceType.EDUCATION_TUTOR) {
            populateEducationFields(fields, defaultValues);
            response.setFormTitle("Educational Assistance & Tutor Request (शिक्षा व शिक्षक सहायता)");
            response.setFormTitleHi("शिक्षा व शिक्षक सहायता");
        } else if (category == ProblemCategory.SOCIAL_WELFARE || serviceType == ServiceType.GOVERNMENT_SCHEME_HELP) {
            populateSchemeFields(fields, defaultValues);
            response.setFormTitle("Government Scheme Guidance & Application (सरकारी योजना मार्गदर्शन)");
            response.setFormTitleHi("सरकारी योजना सहायता");
        } else {
            // General problem / request
            populateGeneralFields(fields, defaultValues, isOffer);
            response.setFormTitle(isOffer ? "Community Resource Offering" : "Problem & Public Grievance Submission");
            response.setFormTitleHi(isOffer ? "सामुदायिक संसाधन पेशकश" : "सार्वजनिक समस्या व शिकायत निवारण");
        }

        response.setFields(fields);
        response.setDefaultValues(defaultValues);
        return response;
    }

    private void populateTractorRequestFields(List<FormFieldDefinition> fields, Map<String, Object> defaults) {
        fields.add(FormFieldDefinition.of("landSize", "Land Size (ज़मीन का क्षेत्रफल)*", "ज़मीन का क्षेत्रफल*", "number", true, "e.g. 5", "Total land area to be serviced", null, 3, 1));
        fields.add(FormFieldDefinition.of("landUnit", "Land Unit (इकाई)*", "माप इकाई*", "select", true, "Acres", "Select measurement unit",
                List.of(Map.of("value", "ACRES", "label", "Acres (एकड़)"), Map.of("value", "BIGHAS", "label", "Bigha (बीघा)"), Map.of("value", "HECTARES", "label", "Hectares (हेक्टेयर)")), 3, 2));
        fields.add(FormFieldDefinition.of("workType", "Work Required (कार्य का प्रकार)*", "कार्य का प्रकार*", "select", true, "Ploughing", "Type of agricultural machinery work",
                List.of(
                        Map.of("value", "PLOUGHING", "label", "Ploughing / Tillage (जुताई)"),
                        Map.of("value", "ROTAVATOR", "label", "Rotavator (रोटावेटर)"),
                        Map.of("value", "CULTIVATION", "label", "Cultivator (कल्टीवेटर)"),
                        Map.of("value", "SOWING", "label", "Seed Sowing (बुवाई)"),
                        Map.of("value", "HARVESTING", "label", "Harvesting (कटाई)"),
                        Map.of("value", "TRANSPORTATION", "label", "Crop Transport / Trolley (ढुलाई)"),
                        Map.of("value", "LAND_LEVELING", "label", "Land Leveling (समतलीकरण)")
                ), 3, 3));
        fields.add(FormFieldDefinition.of("minHorsePower", "Tractor Power Required (हॉर्सपावर)*", "हॉर्सपावर क्षमता*", "select", true, "40-50 HP", "Minimum required tractor engine power",
                List.of(
                        Map.of("value", "ANY", "label", "Any Compatible Tractor (कोई भी उपयुक्त)"),
                        Map.of("value", "MINI_20_30", "label", "Mini Tractor (20–30 HP)"),
                        Map.of("value", "HP_30_40", "label", "Medium (30–40 HP)"),
                        Map.of("value", "HP_40_50", "label", "Standard (40–50 HP)"),
                        Map.of("value", "HP_50_60", "label", "Heavy Duty (50–60 HP)"),
                        Map.of("value", "HP_60_PLUS", "label", "Ultra Heavy (60+ HP)")
                ), 3, 4));
        fields.add(FormFieldDefinition.of("operatorNeeded", "Tractor Driver / Operator Needed? (ड्राइवर चाहिए?)", "ड्राइवर/ऑपरेटर की आवश्यकता", "boolean", true, "", "Whether provider needs to send a driver", null, 3, 5));
        fields.add(FormFieldDefinition.of("fuelArrangement", "Fuel Arrangement (डीजल व्यवस्था)*", "ईंधन व्यवस्था*", "select", true, "PROVIDER", "Who provides fuel",
                List.of(
                        Map.of("value", "PROVIDER", "label", "Fuel Included by Provider (प्रदाता द्वारा)"),
                        Map.of("value", "REQUESTER", "label", "Fuel Supplied by Farmer (किसान द्वारा)")
                ), 3, 6));
        fields.add(FormFieldDefinition.of("estimatedHours", "Estimated Work Hours (अनुमानित घंटे)", "अनुमानित घंटे", "number", false, "e.g. 4", "Expected duration in hours", null, 3, 7));

        defaults.put("landUnit", "ACRES");
        defaults.put("workType", "PLOUGHING");
        defaults.put("minHorsePower", "HP_40_50");
        defaults.put("operatorNeeded", true);
        defaults.put("fuelArrangement", "PROVIDER");
    }

    private void populateTractorOfferFields(List<FormFieldDefinition> fields, Map<String, Object> defaults) {
        fields.add(FormFieldDefinition.of("tractorBrand", "Tractor Brand & Model (ट्रैक्टर का ब्रांड व मॉडल)*", "ट्रैक्टर ब्रांड व मॉडल*", "text", true, "e.g. Mahindra 575 DI / Swaraj 744 FE", "Make and model of your tractor", null, 3, 1));
        fields.add(FormFieldDefinition.of("horsePower", "Engine Horsepower (हॉर्सपावर - HP)*", "हॉर्सपावर (HP)*", "number", true, "e.g. 45", "Tractor engine power rating in HP", null, 3, 2));
        fields.add(FormFieldDefinition.of("manufacturingYear", "Year of Manufacture (मॉडल वर्ष)", "मॉडल वर्ष", "number", false, "e.g. 2021", "Year the tractor was made", null, 3, 3));
        fields.add(FormFieldDefinition.of("hourlyRate", "Hourly Rate in ₹ (प्रति घंटा किराया)*", "प्रति घंटा किराया (₹)*", "number", true, "e.g. 1200", "Rent price per hour", null, 3, 4));
        fields.add(FormFieldDefinition.of("dailyRate", "Daily Rate in ₹ (प्रति दिन किराया)", "प्रति दिन किराया (₹)", "number", false, "e.g. 8000", "Optional full day rate", null, 3, 5));
        fields.add(FormFieldDefinition.of("operatorAvailable", "Tractor Operator / Driver Available? (चालक उपलब्ध है?)", "चालक उपलब्ध है?", "boolean", true, "", "Driver will operate equipment", null, 3, 6));
        fields.add(FormFieldDefinition.of("fuelIncluded", "Fuel Included in Rate? (डीजल शामिल है?)", "किराये में डीजल शामिल है?", "boolean", true, "", "Whether hourly rate covers fuel", null, 3, 7));
        fields.add(FormFieldDefinition.of("maxTravelRadiusKm", "Service Radius (कार्य क्षेत्र - किमी)*", "कार्य सीमा (किमी)*", "number", true, "e.g. 25", "Max distance willing to travel from your location", null, 3, 8));
        fields.add(FormFieldDefinition.of("availableAttachments", "Available Implements (उपलब्ध कृषि यंत्र)", "उपलब्ध उपकरण (रोटावेटर, ट्रॉली आदि)", "text", false, "e.g. Rotavator, 9-Tine Cultivator, Hydraulic Trolley", "List extra implements available", null, 3, 9));

        defaults.put("operatorAvailable", true);
        defaults.put("fuelIncluded", true);
        defaults.put("maxTravelRadiusKm", 25);
    }

    private void populateWaterTankerRequestFields(List<FormFieldDefinition> fields, Map<String, Object> defaults) {
        fields.add(FormFieldDefinition.of("waterQuantityLiters", "Water Quantity Needed in Litres (लीटर)*", "पानी की मात्रा (लीटर)*", "number", true, "e.g. 5000", "Volume of water required", null, 3, 1));
        fields.add(FormFieldDefinition.of("waterPurpose", "Purpose (उपयोग)*", "उपयोग का प्रकार*", "select", true, "DRINKING", "Usage type",
                List.of(
                        Map.of("value", "DRINKING", "label", "Drinking / Household (पेयजल व घरेलू)"),
                        Map.of("value", "AGRICULTURE", "label", "Agriculture / Irrigation (कृषि व सिंचाई)"),
                        Map.of("value", "LIVESTOCK", "label", "Animal / Livestock (पशुपालन)"),
                        Map.of("value", "CONSTRUCTION", "label", "Construction / Commercial (निर्माण कार्य)")
                ), 3, 2));
        fields.add(FormFieldDefinition.of("urgentImmediate", "Emergency Shortage? (आपातकालीन कमी?)", "आपातकालीन कमी", "boolean", true, "", "Mark if critical drinking water crisis", null, 3, 3));
        defaults.put("waterPurpose", "DRINKING");
        defaults.put("urgentImmediate", false);
    }

    private void populateWaterTankerOfferFields(List<FormFieldDefinition> fields, Map<String, Object> defaults) {
        fields.add(FormFieldDefinition.of("tankCapacityLiters", "Tanker Capacity in Litres (टैंकर क्षमता)*", "टैंकर क्षमता (लीटर)*", "number", true, "e.g. 5000", "Volume of water tanker", null, 3, 1));
        fields.add(FormFieldDefinition.of("vehicleType", "Vehicle Type (वाहन प्रकार)*", "वाहन प्रकार*", "select", true, "TRACTOR_TANKER", "Mounting type",
                List.of(
                        Map.of("value", "TRACTOR_TANKER", "label", "Tractor Attached Tanker (ट्रैक्टर टैंकर)"),
                        Map.of("value", "TRUCK_TANKER", "label", "Heavy Truck Tanker (ट्रक टैंकर)"),
                        Map.of("value", "MINI_TRUCK", "label", "Mini Commercial Tanker (छोटा टैंकर)")
                ), 3, 2));
        fields.add(FormFieldDefinition.of("pricePerTrip", "Price per Trip in ₹ (प्रति ट्रिप किराया)*", "प्रति ट्रिप किराया (₹)*", "number", true, "e.g. 800", "Trip charge within base radius", null, 3, 3));
        fields.add(FormFieldDefinition.of("deliveryRadiusKm", "Max Delivery Radius (किमी)*", "वितरण सीमा (किमी)*", "number", true, "e.g. 20", "Travel distance limit", null, 3, 4));
        fields.add(FormFieldDefinition.of("driverIncluded", "Driver / Operator Included?", "चालक शामिल है?", "boolean", true, "", "Driver operates tanker", null, 3, 5));
        defaults.put("vehicleType", "TRACTOR_TANKER");
        defaults.put("driverIncluded", true);
        defaults.put("deliveryRadiusKm", 20);
    }

    private void populateWorkerRequestFields(List<FormFieldDefinition> fields, Map<String, Object> defaults, ServiceType serviceType) {
        fields.add(FormFieldDefinition.of("numberOfWorkers", "Number of Workers Needed (श्रमिकों की संख्या)*", "श्रमिकों की संख्या*", "number", true, "e.g. 4", "Headcount required", null, 3, 1));
        fields.add(FormFieldDefinition.of("durationDays", "Duration in Days (कार्य दिवस)*", "कार्य दिवस (दिन)*", "number", true, "e.g. 3", "Number of days work will continue", null, 3, 2));
        fields.add(FormFieldDefinition.of("workDescription", "Detailed Work Scope (कार्य विवरण)*", "कार्य का संक्षिप्त विवरण*", "text", true, "e.g. Wheat Harvesting / Brick Masonry / Field Sowing", "Specific nature of manual or skilled task", null, 3, 3));
        fields.add(FormFieldDefinition.of("dailyWageOffered", "Daily Wage Offered per Worker in ₹ (दैनिक मजदूरी)*", "प्रति व्यक्ति दैनिक मजदूरी (₹)*", "number", true, "e.g. 500", "Proposed daily compensation", null, 3, 4));
        fields.add(FormFieldDefinition.of("foodProvided", "Food / Meals Provided? (भोजन की व्यवस्था है?)", "भोजन की व्यवस्था", "boolean", false, "", "Meals offered during work", null, 3, 5));
        defaults.put("numberOfWorkers", 2);
        defaults.put("durationDays", 1);
        defaults.put("foodProvided", false);
    }

    private void populateWorkerOfferFields(List<FormFieldDefinition> fields, Map<String, Object> defaults, ServiceType serviceType) {
        fields.add(FormFieldDefinition.of("primarySkill", "Primary Trade & Skill (मुख्य कौशल)*", "मुख्य कार्य व हुनर*", "text", true, "e.g. Farm Labour / Electrician / Plumber / Mason", "Core specialty", null, 3, 1));
        fields.add(FormFieldDefinition.of("experienceYears", "Years of Experience (अनुभव - वर्ष)*", "अनुभव (वर्ष)*", "number", true, "e.g. 5", "Total experience in this trade", null, 3, 2));
        fields.add(FormFieldDefinition.of("expectedDailyWage", "Expected Daily Wage in ₹ (अपेक्षित दैनिक मजदूरी)*", "दैनिक मजदूरी दर (₹)*", "number", true, "e.g. 600", "Standard daily compensation", null, 3, 3));
        fields.add(FormFieldDefinition.of("expectedHourlyWage", "Hourly Wage in ₹ (प्रति घंटा दर)", "प्रति घंटा दर (₹)", "number", false, "e.g. 150", "Optional hourly rate", null, 3, 4));
        fields.add(FormFieldDefinition.of("toolsAvailable", "Own Tools / Equipment Available? (अपने औजार हैं?)", "स्वयं के औजार उपलब्ध हैं?", "boolean", true, "", "Whether worker brings their own tools", null, 3, 5));
        fields.add(FormFieldDefinition.of("travelRadiusKm", "Travel Radius (कार्य सीमा - किमी)*", "कार्य सीमा (किमी)*", "number", true, "e.g. 15", "Max distance willing to travel", null, 3, 6));
        defaults.put("toolsAvailable", true);
        defaults.put("travelRadiusKm", 15);
    }

    private void populateHealthcareFields(List<FormFieldDefinition> fields, Map<String, Object> defaults) {
        fields.add(FormFieldDefinition.of("patientName", "Patient Name (रोगी का नाम)*", "रोगी का नाम*", "text", true, "e.g. Ram Prasad", "Name of person requiring medical attention", null, 3, 1));
        fields.add(FormFieldDefinition.of("patientAge", "Patient Age (आयु)*", "रोगी की आयु*", "number", true, "e.g. 45", "Age in years", null, 3, 2));
        fields.add(FormFieldDefinition.of("symptoms", "Symptoms / Medical Problem (लक्षण व समस्या)*", "लक्षण व समस्या विवरण*", "textarea", true, "e.g. High fever, breathing difficulty for 2 days", "Describe current symptoms clearly", null, 3, 3));
        fields.add(FormFieldDefinition.of("doctorSpecialistNeeded", "Specialist Needed (विशेषज्ञ डॉक्टर)", "विशेषज्ञ प्रकार", "text", false, "e.g. Cardiologist / Pediatrician / Orthopedic", "Doctor specialty if known", null, 3, 4));
        fields.add(FormFieldDefinition.of("isEmergency", "Is this a Critical Emergency? (क्या यह आपातकालीन है?)*", "आपातकालीन स्थिति*", "boolean", true, "", "Mark if immediate hospital transport or life-support is needed", null, 3, 5));
        defaults.put("isEmergency", false);
    }

    private void populateElectricityFields(List<FormFieldDefinition> fields, Map<String, Object> defaults) {
        fields.add(FormFieldDefinition.of("electricityIssueType", "Issue Type (समस्या का प्रकार)*", "विद्युत समस्या प्रकार*", "select", true, "TRANSFORMER_BURNT", "Specific electrical fault",
                List.of(
                        Map.of("value", "TRANSFORMER_BURNT", "label", "Transformer Burnt / Damaged (ट्रांसफार्मर फुंका/खराब)"),
                        Map.of("value", "TOTAL_POWER_OUTAGE", "label", "Prolonged Power Cut (लंबे समय से बिजली गुल)"),
                        Map.of("value", "BROKEN_POLE", "label", "Broken / Tilted Electric Pole (खंभा टूटा/झुका हुआ)"),
                        Map.of("value", "SNAPPED_WIRE", "label", "Live Snapped Wire on Ground (तार टूटकर जमीन पर गिरा)"),
                        Map.of("value", "LOW_VOLTAGE", "label", "Severe Low Voltage (कम वोल्टेज से मोटर नहीं चल रही)"),
                        Map.of("value", "METER_BURNT", "label", "Burnt Energy Meter (मीटर जल गया)")
                ), 3, 1));
        fields.add(FormFieldDefinition.of("poleOrTransformerNo", "Pole / Transformer Number (खंभा या ट्रांसफार्मर संख्या)", "खंभा/ट्रांसफार्मर नंबर", "text", false, "e.g. TX-45 / Pole-12", "Identification code printed on pole", null, 3, 2));
        fields.add(FormFieldDefinition.of("consumerNumber", "Electricity Consumer No. (उपभोक्ता संख्या / कनेक्शन नंबर)", "उपभोक्ता कनेक्शन संख्या", "text", false, "e.g. 1029384756", "Your electricity bill account number", null, 3, 3));
        fields.add(FormFieldDefinition.of("outageDurationHours", "Hours without electricity (कितने घंटे से बिजली नहीं है)", "बिजली गुल रहने के घंटे", "number", false, "e.g. 24", "Duration of power interruption", null, 3, 4));
        defaults.put("electricityIssueType", "TRANSFORMER_BURNT");
    }

    private void populateEducationFields(List<FormFieldDefinition> fields, Map<String, Object> defaults) {
        fields.add(FormFieldDefinition.of("studentName", "Student Name (विद्यार्थी का नाम)*", "विद्यार्थी का नाम*", "text", true, "e.g. Ananya Kumar", "Name of student", null, 3, 1));
        fields.add(FormFieldDefinition.of("studentClass", "Class / Grade (कक्षा)*", "कक्षा / स्तर*", "select", true, "CLASS_9_10", "Current educational grade",
                List.of(
                        Map.of("value", "PRIMARY_1_5", "label", "Class 1 to 5 (प्राथमिक)"),
                        Map.of("value", "MIDDLE_6_8", "label", "Class 6 to 8 (माध्यमिक)"),
                        Map.of("value", "HIGH_9_10", "label", "Class 9 & 10 (हाईस्कूल)"),
                        Map.of("value", "INTER_11_12", "label", "Class 11 & 12 (इंटरमीडिएट)"),
                        Map.of("value", "COLLEGE", "label", "College / Degree (उच्च शिक्षा)")
                ), 3, 2));
        fields.add(FormFieldDefinition.of("subjectsNeeded", "Subjects Needed (विषय)*", "आवश्यक विषय*", "text", true, "e.g. Mathematics & Science", "List subjects requiring tutoring", null, 3, 3));
        fields.add(FormFieldDefinition.of("monthlyBudget", "Monthly Budget in ₹ (मासिक बजट)", "मासिक बजट (₹)", "number", false, "e.g. 1500", "Affordable monthly fee", null, 3, 4));
        defaults.put("studentClass", "HIGH_9_10");
    }

    private void populateSchemeFields(List<FormFieldDefinition> fields, Map<String, Object> defaults) {
        fields.add(FormFieldDefinition.of("applicantOccupation", "Occupation (व्यवसाय)*", "मुख्य व्यवसाय*", "select", true, "FARMER", "Applicant occupation",
                List.of(
                        Map.of("value", "FARMER", "label", "Small / Marginal Farmer (लघु व सीमांत किसान)"),
                        Map.of("value", "LANDLESS_LABOUR", "label", "Landless Agricultural Labour (भूमिहीन श्रमिक)"),
                        Map.of("value", "ARTISAN", "label", "Rural Artisan / Weaver (कारीगर/बुनकर)"),
                        Map.of("value", "STUDENT", "label", "Student (छात्र/छात्रा)"),
                        Map.of("value", "SENIOR_CITIZEN", "label", "Senior Citizen / Widow (वृद्ध/विधवा/दिव्यांग)")
                ), 3, 1));
        fields.add(FormFieldDefinition.of("annualIncomeRange", "Annual Family Income (वार्षिक पारिवारिक आय)*", "वार्षिक आय वर्ग*", "select", true, "BELOW_1_LAKH", "Income slab",
                List.of(
                        Map.of("value", "BELOW_1_LAKH", "label", "Below ₹1,00,000 (1 लाख से कम)"),
                        Map.of("value", "1_TO_2_5_LAKH", "label", "₹1,00,000 – ₹2,50,000"),
                        Map.of("value", "ABOVE_2_5_LAKH", "label", "Above ₹2,50,000")
                ), 3, 2));
        fields.add(FormFieldDefinition.of("landHoldingAcres", "Land Ownership in Acres (स्वामित्व वाली जमीन)", "जमीन (एकड़ में)", "number", false, "e.g. 2.5", "Owned agricultural land in acres", null, 3, 3));
        fields.add(FormFieldDefinition.of("documentsAvailable", "Available Documents (उपलब्ध दस्तावेज)", "उपलब्ध पहचान व दस्तावेज", "text", false, "e.g. Aadhaar, Khasra-Khatauni, Ration Card", "Government IDs in possession", null, 3, 4));
        defaults.put("applicantOccupation", "FARMER");
        defaults.put("annualIncomeRange", "BELOW_1_LAKH");
    }

    private void populateGeneralFields(List<FormFieldDefinition> fields, Map<String, Object> defaults, boolean isOffer) {
        if (isOffer) {
            fields.add(FormFieldDefinition.of("offeringRate", "Offered Rate / Pricing (किराया या मूल्य)", "मूल्य विवरण", "text", false, "e.g. ₹500/day or Free Seva", "Price per unit or free", null, 3, 1));
            fields.add(FormFieldDefinition.of("serviceRadiusKm", "Service Travel Radius in Km (कार्य सीमा - किमी)", "सेवा दायरा (किमी)", "number", false, "e.g. 15", "Coverage distance", null, 3, 2));
            defaults.put("serviceRadiusKm", 15);
        } else {
            fields.add(FormFieldDefinition.of("expectedResolutionTimeline", "Expected Resolution / Delivery Time", "अपेक्षित समाधान समय", "select", false, "STANDARD", "Preferred timeline",
                    List.of(
                            Map.of("value", "IMMEDIATE_24H", "label", "Urgent / 24 Hours"),
                            Map.of("value", "STANDARD", "label", "Standard / 3–5 Days"),
                            Map.of("value", "SCHEDULED", "label", "Specific Future Date")
                    ), 3, 1));
            defaults.put("expectedResolutionTimeline", "STANDARD");
        }
    }
}
