package com.mandi.problem;

public enum RequestType {
    REPORT_PROBLEM,       // Civic, Infrastructure, Electricity, Water Issue
    REQUEST_SERVICE,      // Requesting Service (Plumbing, Electrical, Veterinary)
    REQUEST_RESOURCE,     // Requesting Physical Resource or Storage
    REQUEST_PRODUCT,      // Requesting Agricultural Inputs or Commodities
    BUY_PRODUCT,          // Buying Crops or Farm Produce
    REQUEST_TRANSPORT,    // Requesting Transportation / Truck / Trolley / Pickup
    REQUEST_EQUIPMENT,    // Requesting Tractor, Harvester, Drone, Machinery
    REQUEST_WORKER,       // Hiring Farm Labour or Skilled Tradesman
    REQUEST_HELP,         // Community Help, Emergency, Local Assistance
    OFFER_PRODUCT,        // Farmer / Producer selling crops or agricultural products
    OFFER_SERVICE,        // Provider offering services
    OFFER_RESOURCE,       // Provider offering water tanker, tools, storage
    OFFER_TRANSPORT,      // Transport provider offering vehicles & logistics
    OFFER_EQUIPMENT,      // Machinery owner offering tractor, harvester, tiller
    OFFER_WORK,           // Worker offering skills and labour
    EMERGENCY_REQUEST,    // Medical, Fire, Critical Infrastructure emergency
    INFORMATION_REQUEST   // Government Schemes, Guidance, Agricultural advice
}
