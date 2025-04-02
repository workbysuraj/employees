import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, Pressable, Dimensions } from "react-native";
import { useRouter } from "expo-router";
import { useWindowDimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function EmployeeIDScreen() {
    const [employeeId, setEmployeeId] = useState("");
    const router = useRouter();
    const { width, height } = useWindowDimensions();

    const handleSubmit = () => {
        if (!employeeId.trim()) return;
        router.push(`/attendance/${employeeId.trim()}`);
    };

    return (
        <LinearGradient colors={["#07f0d8", "#bc6fe3"]} style={styles.container}>
            <Text style={[styles.header, { fontSize: width * 0.06 }]}>Enter Employee ID</Text>

            <TextInput
                value={employeeId}
                onChangeText={setEmployeeId}
                style={[styles.input, { fontSize: width * 0.04 }]}
                placeholder="Employee ID"
                placeholderTextColor="#ccc"
            />

            <Pressable onPress={handleSubmit} style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}>
                <LinearGradient colors={["#ff7e5f", "#feb47b"]} style={styles.gradientButton}>
                    <Text style={[styles.buttonText, { fontSize: width * 0.045 }]}>Check Attendance</Text>
                </LinearGradient>
            </Pressable>
        </LinearGradient>
    );
}

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: width * 0.05,
    },
    header: {
        fontWeight: "bold",
        color: "#fff",
        marginBottom: height * 0.03,
    },
    input: {
        width: "100%",
        padding: height * 0.018,
        borderColor: "rgba(255, 255, 255, 0.5)",
        borderWidth: 1,
        borderRadius: 12,

        color: "#fff",
        marginBottom: height * 0.025,
        shadowRadius: 4,
    },
    button: {
        width: "100%",
        borderRadius: 12,
        overflow: "hidden",
    },
    gradientButton: {
        padding: height * 0.018,
        alignItems: "center",
        borderRadius: 12,
    },
    buttonPressed: {
        opacity: 0.8,
    },
    buttonText: {
        color: "white",
        fontWeight: "bold",
    },
});
