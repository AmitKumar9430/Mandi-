package com.mandi.common;

import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class IndianLocationService {

    public static final List<String> ALL_STATES = List.of(
            "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
            "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
            "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
            "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
            "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
            "Uttar Pradesh", "Uttarakhand", "West Bengal",
            "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu",
            "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
    );

    private static final Map<String, String> DISTRICT_TO_STATE = new TreeMap<>(String.CASE_INSENSITIVE_ORDER);
    private static final Map<String, String> DISTRICT_CANONICAL_NAME = new TreeMap<>(String.CASE_INSENSITIVE_ORDER);

    static {
        // BIHAR
        registerDistricts("Bihar", "Gaya", "Patna", "Muzaffarpur", "Bhagalpur", "Darbhanga", "Purnia", "Begusarai",
                "Samastipur", "Vaishali", "Nalanda", "Saran", "Siwan", "Gopalganj", "Bhojpur", "Buxar", "Rohtas",
                "Kaimur", "Jehanabad", "Arwal", "Aurangabad", "Nawada", "Jamui", "Banka", "Munger", "Lakhisarai",
                "Sheikhpura", "Khagaria", "Katihar", "Madhepura", "Saharsa", "Supaul", "Araria", "Kishanganj",
                "East Champaran", "Motihari", "West Champaran", "Bettiah", "Sitamarhi", "Sheohar", "Madhubani");

        // PUNJAB
        registerDistricts("Punjab", "Mohali", "SAS Nagar", "Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Bathinda",
                "Hoshiarpur", "Pathankot", "Moga", "Batala", "Abohar", "Malerkotla", "Khanna", "Phagwara", "Muktsar",
                "Barnala", "Firozpur", "Kapurthala", "Sangrur", "Fazilka", "Gurdaspur", "Fatehgarh Sahib",
                "Faridkot", "Mansa", "Rupnagar", "Ropar", "Nawanshahr", "Shahid Bhagat Singh Nagar", "Tarn Taran");

        // HARYANA
        registerDistricts("Haryana", "Gurugram", "Gurgaon", "Faridabad", "Panipat", "Ambala", "Karnal", "Rohtak",
                "Hisar", "Sonipat", "Panchkula", "Bhiwani", "Sirsa", "Bahadurgarh", "Jind", "Thanesar", "Kaithal",
                "Rewari", "Palwal", "Yamunanagar", "Kurukshetra", "Fatehabad", "Mahendragarh", "Narnaul", "Jhajjar", "Charkhi Dadri", "Nuh");

        // DELHI
        registerDistricts("Delhi", "Delhi", "New Delhi", "Central Delhi", "North Delhi", "South Delhi", "East Delhi",
                "West Delhi", "North East Delhi", "North West Delhi", "South East Delhi", "South West Delhi", "Shahdara");

        // RAJASTHAN
        registerDistricts("Rajasthan", "Jaipur", "Jodhpur", "Kota", "Bikaner", "Ajmer", "Udaipur", "Bhilwara",
                "Alwar", "Bharatpur", "Sikar", "Pali", "Sri Ganganagar", "Chittorgarh", "Jhunjhunu", "Barmer",
                "Nagaur", "Banswara", "Hanumangarh", "Dausa", "Tonk", "Jalore", "Jhalawar", "Churu", "Sawai Madhopur",
                "Dholpur", "Karauli", "Baran", "Bundi", "Rajsamand", "Dungarpur", "Pratapgarh", "Sirohi", "Jaisalmer", "Beawar", "Didwana", "Kotputli", "Phalodi", "Balotra");

        // MADHYA PRADESH
        registerDistricts("Madhya Pradesh", "Bhopal", "Indore", "Jabalpur", "Gwalior", "Ujjain", "Sagar", "Dewas",
                "Satna", "Ratlam", "Rewa", "Murwara", "Katni", "Singrauli", "Burhanpur", "Khandwa", "Bhind", "Chhindwara",
                "Guna", "Shivpuri", "Vidisha", "Chhatarpur", "Damoh", "Mandsaur", "Khargone", "Neemuch", "Pithampur",
                "Narmadapuram", "Hoshangabad", "Itarsi", "Sehore", "Morena", "Betul", "Seoni", "Datia", "Nagda", "Dhar", "Balaghat");

        // MAHARASHTRA
        registerDistricts("Maharashtra", "Mumbai", "Mumbai Suburban", "Pune", "Nagpur", "Thane", "Nashik", "Kalyan-Dombivli",
                "Vasai-Virar", "Aurangabad", "Chhatrapati Sambhajinagar", "Navi Mumbai", "Solapur", "Mira-Bhayandar",
                "Bhiwandi", "Amravati", "Nanded", "Kolhapur", "Akola", "Panvel", "Ulhasnagar", "Sangli", "Malegaon",
                "Jalgaon", "Latur", "Dhule", "Ahmednagar", "Ahilyanagar", "Chandrapur", "Parbhani", "Ichalkaranji",
                "Jalna", "Ambarnath", "Bhusawal", "Ratnagiri", "Raigad", "Satara", "Sindhudurg", "Wardha", "Yavatmal", "Gondia", "Bhandara", "Gadchiroli", "Washim", "Hingoli", "Palghar");

        // JHARKHAND
        registerDistricts("Jharkhand", "Ranchi", "Jamshedpur", "Dhanbad", "Bokaro", "Deoghar", "Phusro", "Hazaribagh",
                "Giridih", "Ramgarh", "Medininagar", "Daltonganj", "Chirkunda", "Jhumri Telaiya", "Chaibasa", "Dumka",
                "Godda", "Sahibganj", "Pakur", "Garhwa", "Chatra", "Koderma", "Lohardaga", "Gumla", "Simdega", "Latehar", "Khunti", "Saraikela Kharsawan", "West Singhbhum", "East Singhbhum");

        // WEST BENGAL
        registerDistricts("West Bengal", "Kolkata", "Howrah", "North 24 Parganas", "South 24 Parganas", "Hooghly",
                "Darjeeling", "Siliguri", "Asansol", "Durgapur", "Bardhaman", "Paschim Bardhaman", "Purba Bardhaman",
                "Nadia", "Murshidabad", "Malda", "Uttar Dinajpur", "Dakshin Dinajpur", "Jalpaiguri", "Alipurduar",
                "Cooch Behar", "Birbhum", "Bankura", "Purulia", "Paschim Medinipur", "Purba Medinipur", "Jhargram", "Kalimpong");

        // GUJARAT
        registerDistricts("Gujarat", "Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar", "Jamnagar", "Junagadh",
                "Gandhinagar", "Gandhidham", "Anand", "Navsari", "Morbi", "Nadiad", "Surendranagar", "Bharuch",
                "Mehsana", "Bhuj", "Porbandar", "Palanpur", "Valsad", "Vapi", "Gondal", "Veraval", "Godhra", "Patan",
                "Kalol", "Dahod", "Botad", "Amreli", "Deesa", "Jetpur", "Kutch", "Banaskantha", "Sabarkantha", "Aravalli", "Mahisagar", "Panchmahal", "Chhota Udaipur", "Narmada", "Tapi", "Dang", "Gir Somnath", "Devbhumi Dwarka");

        // KARNATAKA
        registerDistricts("Karnataka", "Bengaluru", "Bengaluru Urban", "Bengaluru Rural", "Bangalore", "Mysuru", "Mysore",
                "Hubballi", "Dharwad", "Mangaluru", "Mangalore", "Belagavi", "Belgaum", "Kalaburagi", "Gulbarga",
                "Davanagere", "Ballari", "Bellary", "Vijayapura", "Bijapur", "Shivamogga", "Shimoga", "Tumakuru",
                "Tumkur", "Raichur", "Bidar", "Hosapete", "Hospet", "Gadag", "Udupi", "Hassan", "Bhadravati",
                "Chitradurga", "Kolar", "Mandya", "Chikkamagaluru", "Chikmagalur", "Bagalkote", "Bagalkot", "Chamarajanagar", "Haveri", "Koppal", "Yadgir", "Ramanagara", "Chikkaballapura", "Kodagu", "Coorg", "Uttara Kannada", "Dakshina Kannada");

        // TELANGANA
        registerDistricts("Telangana", "Hyderabad", "Warangal", "Nizamabad", "Khammam", "Karimnagar", "Ramagundam",
                "Mahbubnagar", "Nalgonda", "Adilabad", "Suryapet", "Miryalaguda", "Siddipet", "Jagtial", "Mancherial",
                "Kothagudem", "Rangareddy", "Medchal Malkajgiri", "Sangareddy", "Kamareddy", "Vikarabad", "Yadadri Bhuvanagiri");

        // TAMIL NADU
        registerDistricts("Tamil Nadu", "Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Trichy", "Salem",
                "Tirunelveli", "Tiruppur", "Ranipet", "Nagercoil", "Thanjavur", "Vellore", "Kancheepuram", "Erode",
                "Tiruvannamalai", "Pollachi", "Rajapalayam", "Sivakasi", "Pudukkottai", "Neyveli", "Nagapattinam",
                "Viluppuram", "Tiruchengode", "Vaniyambadi", "Theni", "Udhagamandalam", "Ooty", "Arakkonam", "Virudhunagar",
                "Dindigul", "Cuddalore", "Kanyakumari", "Karur", "Namakkal", "Perambalur", "Ramanathapuram", "Tenkasi", "Thiruvallur", "Thiruvarur", "Thoothukudi", "Tuticorin", "Tirupathur", "Nilgiris", "Ariyalur", "Chengalpattu", "Kallakurichi", "Mayiladuthurai", "Ranipet");

        // ANDHRA PRADESH
        registerDistricts("Andhra Pradesh", "Visakhapatnam", "Vizag", "Vijayawada", "Guntur", "Nellore", "Kurnool",
                "Kakinada", "Rajahmundry", "Kadapa", "Tirupati", "Anantapur", "Vizianagaram", "Eluru", "Ongole",
                "Nandyal", "Machilipatnam", "Adoni", "Tenali", "Proddatur", "Chittoor", "Hindupur", "Bhimavaram",
                "Madanapalle", "Guntakal", "Srikakulam", "Dharmavaram", "Gudivada", "Narasaraopet", "Tadipatri", "Palnadu", "Bapatla", "Anakapalli", "Kakinada", "Konaseema", "Alluri Sitharama Raju", "Parvathipuram Manyam", "Sri Sathya Sai", "Annamayya", "YSR Kadapa");

        // UTTARAKHAND
        registerDistricts("Uttarakhand", "Dehradun", "Haridwar", "Roorkee", "Haldwani", "Rudrapur", "Kashipur",
                "Rishikesh", "Nainital", "Almora", "Pithoragarh", "Chamoli", "Pauri Garhwal", "Tehri Garhwal",
                "Uttarkashi", "Udham Singh Nagar", "Bageshwar", "Champawat", "Rudraprayag");

        // HIMACHAL PRADESH
        registerDistricts("Himachal Pradesh", "Shimla", "Dharamshala", "Solan", "Mandi", "Palampur", "Baddi",
                "Nahan", "Paonta Sahib", "Sundarnagar", "Chamba", "Una", "Kullu", "Manali", "Hamirpur", "Bilaspur", "Kangra", "Kinnaur", "Lahaul and Spiti", "Sirmaur");

        // CHHATTISGARH
        registerDistricts("Chhattisgarh", "Raipur", "Bhilai", "Bilaspur", "Korba", "Rajnandgaon", "Durg", "Raigarh",
                "Jagdalpur", "Ambikapur", "Dhamtari", "Mahasamund", "Kanker", "Kawardha", "Kabirdham", "Bemetara",
                "Balod", "Baloda Bazar", "Gariaband", "Janjgir-Champa", "Mungeli", "Gaurela-Pendra-Marwahi", "Koriya",
                "Surajpur", "Balrampur-Ramanujganj", "Jashpur", "Bastar", "Kondagaon", "Narayanpur", "Dantewada", "Bijapur", "Sukma", "Khairagarh", "Mohla-Manpur", "Sarangarh", "Sakti", "Manendragarh");

        // ODISHA
        registerDistricts("Odisha", "Bhubaneswar", "Cuttack", "Rourkela", "Berhampur", "Sambalpur", "Puri",
                "Balasore", "Bhadrak", "Baripada", "Jharsuguda", "Jeypore", "Bargarh", "Angul", "Dhenkanal",
                "Balangir", "Bolangir", "Kendrapara", "Jagatsinghpur", "Jajpur", "Rayagada", "Ganjam", "Khurda",
                "Sundargarh", "Koraput", "Mayurbhanj", "Nayagarh", "Nuapada", "Kalahandi", "Kandhamal", "Keonjhar", "Malkangiri", "Nabarangpur", "Subarnapur", "Sonepur", "Boudh", "Debagarh", "Gajapati");

        // ASSAM
        registerDistricts("Assam", "Guwahati", "Silchar", "Dibrugarh", "Jorhat", "Nagaon", "Tinsukia", "Tezpur",
                "Bongaigaon", "Karimganj", "Dhubri", "Diphu", "North Lakhimpur", "Goalpara", "Sibsagar", "Sivasagar",
                "Barpeta", "Kamrup", "Kamrup Metropolitan", "Cachar", "Sonitpur", "Golaghat", "Darrang", "Morigaon",
                "Nalbari", "Kokrajhar", "Baksa", "Chirang", "Udalguri", "Hailakandi", "Dima Hasao", "Karbi Anglong", "West Karbi Anglong", "Charaideo", "Hojai", "Biswanath", "South Salmara", "Majuli", "Bajali", "Tamulpur");

        // JAMMU AND KASHMIR
        registerDistricts("Jammu and Kashmir", "Srinagar", "Jammu", "Anantnag", "Baramulla", "Kathua", "Udhampur",
                "Sopore", "Rajouri", "Poonch", "Pulwama", "Kulgam", "Kupwara", "Budgam", "Ganderbal", "Bandipora",
                "Shopian", "Doda", "Ramban", "Kishtwar", "Reasi", "Samba");

        // CHANDIGARH
        registerDistricts("Chandigarh", "Chandigarh");

        // UTTAR PRADESH (All 75 Districts)
        registerDistricts("Uttar Pradesh", "Lucknow", "Kanpur", "Kanpur Nagar", "Kanpur Dehat", "Varanasi", "Prayagraj",
                "Allahabad", "Agra", "Meerut", "Ghaziabad", "Noida", "Gautam Buddha Nagar", "Bareilly", "Aligarh",
                "Moradabad", "Saharanpur", "Gorakhpur", "Faizabad", "Ayodhya", "Firozabad", "Jhansi", "Muzaffarnagar",
                "Mathura", "Budaun", "Badaun", "Rampur", "Shahjahanpur", "Farrukhabad", "Hapur", "Sitapur", "Barabanki",
                "Hardoi", "Lakhimpur Kheri", "Lakhimpur", "Kheri", "Raebareli", "Unnao", "Amethi", "Sultanpur",
                "Pratapgarh", "Fatehpur", "Kaushambi", "Jaunpur", "Ghazipur", "Ballia", "Mau", "Azamgarh", "Deoria",
                "Kushinagar", "Maharajganj", "Basti", "Sant Kabir Nagar", "Siddharthnagar", "Gonda", "Bahraich",
                "Shravasti", "Balrampur", "Mirzapur", "Sonbhadra", "Bhadohi", "Sant Ravidas Nagar", "Banda",
                "Chitrakoot", "Hamirpur", "Mahoba", "Jalaun", "Orai", "Lalitpur", "Mainpuri", "Etawah", "Kannauj",
                "Auraiya", "Etah", "Kasganj", "Hathras", "Sambhal", "Amroha", "Jyotiba Phule Nagar", "Bijnor",
                "Shamli", "Baghpat", "Pilibhit");

        // Canonical alias normalizations
        DISTRICT_CANONICAL_NAME.put("sas nagar", "Mohali");
        DISTRICT_CANONICAL_NAME.put("mohali", "Mohali");
        DISTRICT_CANONICAL_NAME.put("s.a.s nagar", "Mohali");
        DISTRICT_CANONICAL_NAME.put("s.a.s. nagar", "Mohali");
        DISTRICT_CANONICAL_NAME.put("sahibzada ajit singh nagar", "Mohali");
        DISTRICT_CANONICAL_NAME.put("gurgaon", "Gurugram");
        DISTRICT_CANONICAL_NAME.put("gurugram", "Gurugram");
        DISTRICT_CANONICAL_NAME.put("allahabad", "Prayagraj");
        DISTRICT_CANONICAL_NAME.put("prayagraj", "Prayagraj");
        DISTRICT_CANONICAL_NAME.put("banaras", "Varanasi");
        DISTRICT_CANONICAL_NAME.put("kashi", "Varanasi");
        DISTRICT_CANONICAL_NAME.put("faizabad", "Ayodhya");
        DISTRICT_CANONICAL_NAME.put("ayodhya", "Ayodhya");
        DISTRICT_CANONICAL_NAME.put("bangalore", "Bengaluru");
        DISTRICT_CANONICAL_NAME.put("bengaluru", "Bengaluru");
        DISTRICT_CANONICAL_NAME.put("bombay", "Mumbai");
        DISTRICT_CANONICAL_NAME.put("calcutta", "Kolkata");
        DISTRICT_CANONICAL_NAME.put("madras", "Chennai");
    }

    private static void registerDistricts(String state, String... districts) {
        for (String d : districts) {
            DISTRICT_TO_STATE.put(d.trim(), state);
            DISTRICT_CANONICAL_NAME.put(d.trim(), toTitleCase(d.trim()));
        }
    }

    /**
     * Resolves the canonical District Name in Title Case (e.g. "gaya", "GAYA" -> "Gaya")
     */
    public static String normalizeDistrict(String district) {
        if (district == null || district.isBlank()) return "Lucknow";
        String trimmed = district.trim();
        String canonical = DISTRICT_CANONICAL_NAME.get(trimmed);
        if (canonical != null) return canonical;
        return toTitleCase(trimmed);
    }

    /**
     * Resolves the exact State based on district, explicit state, or geolocation.
     */
    public static String resolveState(String district, String state) {
        String cleanDist = district != null ? district.trim() : "";
        String cleanState = state != null ? state.trim() : "";

        // If the district has a deterministic mapping, check if state was omitted or was default "Uttar Pradesh"
        String mappedState = DISTRICT_TO_STATE.get(cleanDist);
        if (mappedState != null) {
            // If user supplied no state or defaulted to Uttar Pradesh but district is in Bihar/Punjab/etc.
            if (cleanState.isBlank() || "Uttar Pradesh".equalsIgnoreCase(cleanState)) {
                return mappedState;
            }
            // If explicit state is valid, match against all states
            for (String s : ALL_STATES) {
                if (s.equalsIgnoreCase(cleanState)) return s;
            }
            return mappedState;
        }

        // If district was not in map, but state is provided, validate state name
        if (!cleanState.isBlank()) {
            for (String s : ALL_STATES) {
                if (s.equalsIgnoreCase(cleanState)) return s;
            }
            return toTitleCase(cleanState);
        }

        return "Uttar Pradesh";
    }

    public static String toTitleCase(String text) {
        if (text == null || text.isEmpty()) return "";
        StringBuilder sb = new StringBuilder();
        boolean capitalizeNext = true;
        for (char c : text.toCharArray()) {
            if (Character.isWhitespace(c) || c == '-' || c == '(' || c == '/' || c == '.') {
                capitalizeNext = true;
                sb.append(c);
            } else if (capitalizeNext) {
                sb.append(Character.toTitleCase(c));
                capitalizeNext = false;
            } else {
                sb.append(Character.toLowerCase(c));
            }
        }
        return sb.toString();
    }
}
