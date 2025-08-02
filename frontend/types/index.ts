type Gender = "Male" | "Female" | "Other";
type RelationshipType = "Short Term" | "Long Term" | "Friendship" | "Casual";
type Orientation = "Straight" | "Gay" | "Lesbian" | "Bisexual" | "Other";
type Ethnicity = "Indian" | "Caucasian" | "African American" | "Hispanic" | "Asian" | "Other";
type Religion = "Hinduism" | "Christianity" | "Islam" | "Sikhism" | "Buddhism" | "Judaism" | "Atheist" | "Other";
type Caste = "Brahmin" | "Kshatriya" | "Vaishya" | "Shudra" | "SC" | "ST" | "OBC" | "General" | "Other";
export type Country = "India" | "USA" | "UK";
export type PartnerLooking = "" | "Bride" |  "Groom" 

export type State =
    | "Maharashtra" | "Karnataka" | "Tamil Nadu"
    | "California" | "Texas" | "New York"
    | "England" | "Scotland" | "Wales";

export type City =
    | "Mumbai" | "Pune" | "Bangalore" | "Chennai"
    | "Los Angeles" | "Houston" | "New York City"
    | "London" | "Edinburgh" | "Cardiff";

export interface SocialProile {
    id: string;
    lookingFor: string;
    relationshipType: RelationshipType;
    displayName: string;
    age: number;
    gender: Gender;
    orientation: Orientation;
    ethnicity: Ethnicity;
    religion: Religion;
    caste: Caste;
    subCaste?: string;
    country: Country;
    state: State;
    city: City;

    partnerLookingFor: Gender;
    partnerAgeRange: {
        min: number;
        max: number;
    }
    partnerPreferredLocation: {
        sameCity: boolean;
        sameState: boolean;
        sameCountry: boolean;
        anywhere: boolean;
    };
    profileCompleted: boolean;

}


export interface MatrimonialProfile {
    id: string;
    lookingFor: string;
    firstName:string;
    lastName:string;
    userName:string;
    age: number;
    gender: Gender;
    orientation: Orientation;
    ethnicity: Ethnicity;
    religion: Religion;
    caste: Caste;
    subCaste?: string;
    country: Country;
    state: State;
    city: City;

    partnerLookingFor:PartnerLooking;
    partnerAgeRange: {
        min: number;
        max: number;
    }
    partnerPreferredLocation: {
        sameCity: boolean;
        sameState: boolean;
        sameCountry: boolean;
        anywhere: boolean;
    };
    profileCompleted: boolean;

}

export const partner: PartnerLooking[] = [
    "Bride",
    "Groom"
]

export const religions: Religion[] = [
    'Hinduism',
    'Christianity',
    'Islam',
    'Sikhism',
    'Buddhism',
    'Judaism',
    'Atheist',
    'Other',
];

export const OrientationData: Orientation[] = [
    "Straight",
    "Bisexual",
    "Gay",
    "Lesbian",
    "Other"
]

export const EthnicityData: Ethnicity[] = [
    "Indian",
    "Caucasian",
    "Asian",
    "African American",
    "Hispanic",
    "Other"
]
export const relation: RelationshipType[] = [
    "Short Term",
    "Long Term",
    "Friendship",
    "Casual"
]

export const CasteData: Caste[] = [
    "Brahmin",
    "General",
    "Kshatriya",
    "OBC",
    "Other",
    'SC',
    "ST",
    "Shudra",
    "Vaishya"
]


export const CityData: City[] = [
    // 🇮🇳 India
    "Mumbai",
    "Pune",
    "Bangalore",
    "Chennai",

    // 🇺🇸 USA
    "Los Angeles",
    "Houston",
    "New York City",

    // 🇬🇧 UK
    "London",
    "Edinburgh",
    "Cardiff",
];

export const StateData: State[] = [
    // 🇮🇳 India
    "Maharashtra",
    "Karnataka",
    "Tamil Nadu",

    // 🇺🇸 USA
    "California",
    "Texas",
    "New York",

    // 🇬🇧 UK
    "England",
    "Scotland",
    "Wales",
];

export const CountryData: Country[] = [
    "India",
    "UK",
    "USA"
];
