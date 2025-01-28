import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Switch,
  StyleSheet,
  ScrollView,
  Dimensions,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";

const TEST_DATA = JSON.stringify([
  ["Pakistan", 231],
  ["Pakistan", 127],
  ["India", 31],
  ["India", 71],
  ["Australia", 31],
  ["India", 22],
  ["Pakistan", 81],
]);

const API_URL = "https://assessments.reliscore.com/api/cric-scores/";

interface ScoreData {
  [country: string]: number[];
}

const ScoreRow = ({
  country,
  average,
}: {
  country: string;
  average: number;
}) => {
  const windowWidth = Dimensions.get("window").width;
  const isWideScreen = windowWidth > 600;

  return (
    <View
      style={[styles.row, isWideScreen ? styles.rowWide : styles.rowNarrow]}
    >
      <Text style={styles.country}>{country}</Text>
      <Text style={styles.average}>{average.toFixed(2)}</Text>
      <View style={[styles.bar, { width: average * 2 }]} />
    </View>
  );
};

export default function App() {
  const [useServerData, setUseServerData] = useState(false);
  const [data, setData] = useState<ScoreData>({});
  const [country1, setCountry1] = useState("");
  const [country2, setCountry2] = useState("");

  useEffect(() => {
    fetchData();
  }, [useServerData]);

  const fetchData = async () => {
    try {
      let jsonData;
      if (useServerData) {
        const response = await fetch(API_URL);
        jsonData = await response.json();
      } else {
        jsonData = JSON.parse(TEST_DATA);
      }

      const processedData: ScoreData = {};
      jsonData.forEach((item: [string, number]) => {
        const [country, score] = item;
        if (!processedData[country]) {
          processedData[country] = [];
        }
        processedData[country].push(score);
      });

      setData(processedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const calculateAverage = (country: string) => {
    const scores = data[country];
    if (!scores || scores.length === 0) return "-";
    const sum = scores.reduce((a, b) => a + b, 0);
    return (sum / scores.length).toFixed(2);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Cricket Scores</Text>
        <View style={styles.switchContainer}>
          <Text>Use Server Data</Text>
          <Switch value={useServerData} onValueChange={setUseServerData} />
        </View>
        <TextInput
          style={styles.input}
          placeholder="Enter country 1"
          value={country1}
          onChangeText={setCountry1}
        />
        {country1 in data && (
          <ScoreRow
            country={country1}
            average={parseFloat(calculateAverage(country1))}
          />
        )}
        <TextInput
          style={styles.input}
          placeholder="Enter country 2"
          value={country2}
          onChangeText={setCountry2}
        />
        {country2 in data && (
          <ScoreRow
            country={country2}
            average={parseFloat(calculateAverage(country2))}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContent: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  row: {
    marginBottom: 10,
  },
  rowWide: {
    flexDirection: "row",
    alignItems: "center",
  },
  rowNarrow: {
    flexDirection: "column",
  },
  country: {
    fontWeight: "bold",
    marginRight: 10,
  },
  average: {
    marginRight: 10,
  },
  bar: {
    height: 20,
    backgroundColor: "blue",
  },
});
