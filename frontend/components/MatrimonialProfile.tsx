import { CasteData, CityData, CountryData, EthnicityData, MatrimonialProfile, partner, relation, SocialProile, StateData } from "@/types";
import { useState } from "react";
import {
    View,
    Text,
    KeyboardAvoidingView,
    Platform,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Switch,
} from "react-native";
import RNPickerSelect from "react-native-picker-select";

export default function MatrimonialProfileDetails() {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState<MatrimonialProfile>({
        id: "",
        lookingFor: "",
        firstName: "",
        lastName:"",
        userName:"",
        age: 18,
        gender: "Male",
        orientation: "Straight",
        ethnicity: "Indian",
        religion: "Hinduism",
        caste: "General",
        subCaste: "",
        country: "India",
        state: "Maharashtra",
        city: "Mumbai",
        partnerLookingFor: "Bride",
        partnerAgeRange: {
            min: 18,
            max: 30,
        },
        partnerPreferredLocation: {
            sameCity: false,
            sameState: false,
            sameCountry: false,
            anywhere: true,
        },
        profileCompleted: false,
    });

    const handleNext = () => setStep((prev) => prev + 1);
    const handlePrevious = () => setStep((prev) => prev - 1);

    const handleChange = (key: keyof MatrimonialProfile, value: any) => {
        setFormData({ ...formData, [key]: value });
    };

    const handleAgeChange = (value: string) => {
        const age = parseInt(value);
        if (!isNaN(age)) {
            setFormData({ ...formData, age });
        }
    };

    const handlePartnerAgeRangeChange = (type: "min" | "max", value: string) => {
        const age = parseInt(value);
        if (!isNaN(age)) {
            setFormData({
                ...formData,
                partnerAgeRange: {
                    ...formData.partnerAgeRange,
                    [type]: age,
                },
            });
        }
    };

    const handleLocationPrefChange = (key: keyof typeof formData.partnerPreferredLocation) => {
        setFormData({
            ...formData,
            partnerPreferredLocation: {
                ...formData.partnerPreferredLocation,
                [key]: !formData.partnerPreferredLocation[key],
            },
        });
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            className="h-screen w-full justify-center items-center py-8 px-4"
        >
            <View className="w-full max-w-lg bg-white p-8 rounded-2xl shadow-xl border border-gray-200">
                {/* Step 1 */}
                {step === 1 && (
                    <>
                        <Text style={styles.label}>Looking For (Partner Gender)</Text>
                        <RNPickerSelect
                            value={formData.partnerLookingFor}
                            onValueChange={(value) => handleChange("partnerLookingFor", value)}
                            items={partner.map((p) => ({label:p, value:p}))}
                            style={{
                                inputWeb: {
                                    fontSize: 16,
                                    paddingVertical: 10,
                                    paddingHorizontal: 12,
                                    borderWidth: 1,
                                    borderColor: '#ccc',
                                    borderRadius: 8,
                                    backgroundColor: '#fff',
                                    color: '#333',
                                    marginBottom: 16,
                                    outlineWidth: 0,
                                    width: '100%',
                                },
                            }}
                            placeholder={{ label: 'Select Gender', value: null }}
                        />

                        <Text style={styles.label}>FirstName</Text>
                        <TextInput
                            style={styles.input}
                            value={formData.firstName}
                            onChangeText={(text) => handleChange("firstName", text)}
                        />

                        <Text style={styles.label}>LastName</Text>
                        <TextInput
                            style={styles.input}
                            value={formData.lastName}
                            onChangeText={(text) => handleChange("lastName", text)}
                        />

                        <Text style={styles.label}>User Name (max 20 charcters)</Text>
                        <TextInput
                            style={styles.input}
                            value={formData.userName}
                            onChangeText={(text) => handleChange("userName", text)}
                        />

                        <TouchableOpacity style={styles.button} onPress={handleNext}>
                            <Text style={styles.buttonText}>Continue</Text>
                        </TouchableOpacity>
                    </>
                )}

                {/* Step 2 */}
                {step === 2 && (
                    <>
                        <Text style={styles.label}>Age</Text>
                        <TextInput
                            style={styles.input}
                            value={formData.age.toString()}
                            keyboardType="numeric"
                            onChangeText={handleAgeChange}
                        />

                        <Text style={styles.label}>Gender</Text>
                        <RNPickerSelect
                            value={formData.gender}
                            onValueChange={(value) => handleChange("gender", value)}
                            items={["Male", "Female", "Other"].map((g) => ({ label: g, value: g }))}
                            style={{
                                inputWeb: {
                                    fontSize: 16,
                                    paddingVertical: 10,
                                    paddingHorizontal: 12,
                                    borderWidth: 1,
                                    borderColor: '#ccc',
                                    borderRadius: 8,
                                    backgroundColor: '#fff',
                                    color: '#333',
                                    marginBottom: 16,
                                    outlineWidth: 0,
                                    width: '100%',
                                },
                            }}
                        />

                        <Text style={styles.label}>Orientation</Text>
                        <RNPickerSelect
                            value={formData.orientation}
                            onValueChange={(value) => handleChange("orientation", value)}
                            items={EthnicityData.map((eth) => ({ label: eth, value: eth }))}
                            style={{
                                inputWeb: {
                                    fontSize: 16,
                                    paddingVertical: 10,
                                    paddingHorizontal: 12,
                                    borderWidth: 1,
                                    borderColor: '#ccc',
                                    borderRadius: 8,
                                    backgroundColor: '#fff',
                                    color: '#333',
                                    marginBottom: 16,
                                    outlineWidth: 0,
                                    width: '100%',
                                },
                            }}
                        />

                        <Text style={styles.label}>Ethnicity</Text>
                        <RNPickerSelect
                            value={formData.ethnicity}
                            onValueChange={(value) => handleChange("ethnicity", value)}
                            items={EthnicityData.map((e) => ({ label: e, value: e }))}
                            style={{
                                inputWeb: {
                                    fontSize: 16,
                                    paddingVertical: 10,
                                    paddingHorizontal: 12,
                                    borderWidth: 1,
                                    borderColor: '#ccc',
                                    borderRadius: 8,
                                    backgroundColor: '#fff',
                                    color: '#333',
                                    marginBottom: 16,
                                    outlineWidth: 0,
                                    width: '100%',
                                },
                            }}
                        />

                        <TouchableOpacity style={styles.button} onPress={handleNext}>
                            <Text style={styles.buttonText}>Continue</Text>
                        </TouchableOpacity>
                    </>
                )}

                {/* Step 3 */}
                {step === 3 && (
                    <>
                        <Text style={styles.label}>Religion</Text>
                        <RNPickerSelect
                            value={formData.religion}
                            onValueChange={(value) => handleChange("religion", value)}
                            items={["Straight", "Gay", "Bisexual", "Other"].map((o) => ({ label: o, value: o }))}
                            style={{
                                inputWeb: {
                                    fontSize: 16,
                                    paddingVertical: 10,
                                    paddingHorizontal: 12,
                                    borderWidth: 1,
                                    borderColor: '#ccc',
                                    borderRadius: 8,
                                    backgroundColor: '#fff',
                                    color: '#333',
                                    marginBottom: 16,
                                    outlineWidth: 0,
                                    width: '100%',
                                },
                            }}
                        />

                        <Text style={styles.label}>Caste</Text>
                        <RNPickerSelect
                            value={formData.caste}
                            onValueChange={(value) => handleChange("caste", value)}
                            items={CasteData.map((c) => ({ label: c, value: c }))}
                            style={{
                                inputWeb: {
                                    fontSize: 16,
                                    paddingVertical: 10,
                                    paddingHorizontal: 12,
                                    borderWidth: 1,
                                    borderColor: '#ccc',
                                    borderRadius: 8,
                                    backgroundColor: '#fff',
                                    color: '#333',
                                    marginBottom: 16,
                                    outlineWidth: 0,
                                    width: '100%',
                                },
                            }}
                        />

                        <Text style={styles.label}>Sub-Caste</Text>
                        <TextInput
                            style={styles.input}
                            value={formData.subCaste}
                            onChangeText={(text) => handleChange("subCaste", text)}
                        />

                        <TouchableOpacity style={styles.button} onPress={handleNext}>
                            <Text style={styles.buttonText}>Continue</Text>
                        </TouchableOpacity>
                    </>
                )}

                {/* Step 4 */}
                {step === 4 && (
                    <>
                        <Text style={styles.label}>Country</Text>
                        <RNPickerSelect
                            value={formData.country}
                            onValueChange={(value) => handleChange("country", value)}
                            items={CountryData.map((c) => ({ label: c, value: c }))}
                            style={{
                                inputWeb: {
                                    fontSize: 16,
                                    paddingVertical: 10,
                                    paddingHorizontal: 12,
                                    borderWidth: 1,
                                    borderColor: '#ccc',
                                    borderRadius: 8,
                                    backgroundColor: '#fff',
                                    color: '#333',
                                    marginBottom: 16,
                                    outlineWidth: 0,
                                    width: '100%',
                                },
                            }}
                        />

                        <Text style={styles.label}>State</Text>
                        <RNPickerSelect
                            value={formData.state}
                            onValueChange={(value) => handleChange("state", value)}
                            items={StateData.map((s) => ({ label: s, value: s }))}
                            style={{
                                inputWeb: {
                                    fontSize: 16,
                                    paddingVertical: 10,
                                    paddingHorizontal: 12,
                                    borderWidth: 1,
                                    borderColor: '#ccc',
                                    borderRadius: 8,
                                    backgroundColor: '#fff',
                                    color: '#333',
                                    marginBottom: 16,
                                    outlineWidth: 0,
                                    width: '100%',
                                },
                            }}
                        />

                        <Text style={styles.label}>City</Text>
                        <RNPickerSelect
                            value={formData.city}
                            onValueChange={(value) => handleChange("city", value)}
                            items={CityData.map((c) => ({ label: c, value: c }))}
                            style={{
                                inputWeb: {
                                    fontSize: 16,
                                    paddingVertical: 10,
                                    paddingHorizontal: 12,
                                    borderWidth: 1,
                                    borderColor: '#ccc',
                                    borderRadius: 8,
                                    backgroundColor: '#fff',
                                    color: '#333',
                                    marginBottom: 16,
                                    outlineWidth: 0,
                                    width: '100%',
                                },
                            }}
                        />
                        <TouchableOpacity style={styles.button} onPress={handleNext}>
                            <Text style={styles.buttonText}>Continue</Text>
                        </TouchableOpacity>
                    </>
                )}

                {/* Step 5 – Final */}
                {step === 5 && (
                    <>
                        <Text style={styles.header}>Partner Preferences</Text>

                        <Text style={styles.label}>I am looking for</Text>
                        <RNPickerSelect
                            value={formData.partnerLookingFor}
                            onValueChange={(value) => handleChange("partnerLookingFor", value)}
                            items={partner.map((p) => ({label:p, value:p}))}
                            style={{
                                inputWeb: {
                                    fontSize: 16,
                                    paddingVertical: 10,
                                    paddingHorizontal: 12,
                                    borderWidth: 1,
                                    borderColor: '#ccc',
                                    borderRadius: 8,
                                    backgroundColor: '#fff',
                                    color: '#333',
                                    marginBottom: 16,
                                    outlineWidth: 0,
                                    width: '100%',
                                },
                            }}
                        />

                        <Text style={styles.label}>Age Range</Text>
                        <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 8 }}>
                            <View style={{ flexDirection: "column", gap: 4 }}>
                                <Text style={styles.label}>Min</Text>

                                <TextInput
                                    style={[styles.input, { flex: 1 }]}
                                    value={formData.partnerAgeRange.min.toString()}
                                    keyboardType="numeric"
                                    onChangeText={(text) => handlePartnerAgeRangeChange("min", text)}
                                />
                            </View>

                            <View style={{ flexDirection: "column", gap: 4 }}>

                                <Text style={styles.label}>Max</Text>

                                <TextInput
                                    style={[styles.input, { flex: 1 }]}
                                    value={formData.partnerAgeRange.max.toString()}
                                    keyboardType="numeric"
                                    onChangeText={(text) => handlePartnerAgeRangeChange("max", text)}
                                />
                            </View>
                            </View>

                            <Text style={styles.label}>Preferred Location</Text>
                            {Object.keys(formData.partnerPreferredLocation).map((key) => (
                                <View key={key} style={styles.switchRow}>
                                    <Text style={{ textTransform: "capitalize" }}>{key.replace(/([A-Z])/g, " $1")}</Text>
                                    <Switch
                                        value={formData.partnerPreferredLocation[key as keyof typeof formData.partnerPreferredLocation]}
                                        onValueChange={() => handleLocationPrefChange(key as keyof typeof formData.partnerPreferredLocation)}
                                    />
                                </View>
                            ))}

                            <TouchableOpacity style={styles.button}>
                                <Text style={styles.buttonText}>Complete Profile</Text>
                            </TouchableOpacity>
                        </>
                )}
                    </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    label: {
        fontWeight: "600",
        marginTop: 16,
        marginBottom: 4,
        fontSize: 16,
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 10,
        borderRadius: 6,
        marginBottom: 12,
        fontSize: 16,
        backgroundColor: "#f9f9f9",
    },
    button: {
        backgroundColor: "#2563eb",
        padding: 12,
        borderRadius: 8,
        marginTop: 20,
        alignItems: "center",
    },
    buttonText: {
        color: "white",
        fontWeight: "bold",
    },
    header: {
        fontSize: 20,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 12,
    },
    switchRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
    },
});
