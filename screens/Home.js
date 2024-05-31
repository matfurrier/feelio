import {
  ImageBackground,
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { Fontisto, Ionicons } from "@expo/vector-icons";
import { Calendar } from 'react-native-calendars';

import SecureStoreModel from "../constants/SecureStoreModel";
import Yearbtn from "../components/Yearbtn";
import ChipNav from "../components/ChipNav";
import DiaryList from "../components/DiaryList";
import { initializeDatabase, getAllDiaries, searchDiaries } from "../constants/Database";
import { DContexts } from "../contexts/DContexts";
import { useState, useEffect, useContext } from "react";
import NoResultComponent from "../components/NoResultComponent";
import useStyles from "../constants/styles";
import Dashboard from "../components/Dashboard";
import Timeline from '../components/Timeline';

export default function Home() {
  const date = new Date();
  const monthIndex = date.getMonth();
  const css = useStyles();
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const monthName = monthNames[monthIndex];
  const currentMonthIndex = monthNames.indexOf(monthName);
  const [selectedTag, setSelectedTag] = useState("");
  const rearrangedMonths = [
    ...monthNames.slice(currentMonthIndex),
    ...monthNames.slice(0, currentMonthIndex),
  ];
  const currentYear = date.getFullYear();
  const pastTenYears = [];
  for (let i = 0; i < 10; i++) {
    pastTenYears.push(currentYear - i);
  }

  const [yearfilter, setyearfilter] = useState(currentYear);
  const [monthfilter, setmonthfilter] = useState(monthName);
  const [diaries, setDiaries] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const { changedsomething } = useContext(DContexts);
  const { primarycolor } = useContext(DContexts);
  const { myuname } = useContext(DContexts);
  const { bgcolor } = useContext(DContexts);

  const { setbgColor } = useContext(DContexts);
  const { setCardColor } = useContext(DContexts);
  const { settxtColor } = useContext(DContexts);

  useEffect(() => {
    if (searchQuery) {
      searchDiaries(searchQuery)
        .then((results) => {
          setDiaries(results);
        })
        .catch((error) => {
          console.error('Failed to search diaries:', error);
        });
    } else {
      getAllDiaries(yearfilter, monthfilter, selectedTag)
        .then((diary) => {
          setDiaries(diary);
        })
        .catch((error) => {
          console.error("Failed to get diaries:", error);
        });
    }
  }, [yearfilter, monthfilter, changedsomething, selectedTag, searchQuery]);

  const lightmode = bgcolor === "#f5f5f5";

  const changeTheme = () => {
    if (lightmode) {
      setbgColor("#15202B");
      SecureStoreModel.saveItem("bgcolor", "#15202B");
      setCardColor("#273340");
      settxtColor("white");
      SecureStoreModel.saveItem("cardcolor", "#273340");
      SecureStoreModel.saveItem("textcolor", "white");
    } else {
      setbgColor("#f5f5f5");
      SecureStoreModel.saveItem("bgcolor", "#f5f5f5");
      setCardColor("white");
      settxtColor("black");
      SecureStoreModel.saveItem("cardcolor", "white");
      SecureStoreModel.saveItem("textcolor", "black");
    }
  };

  return (
    <>
      <StatusBar
        translucent
        backgroundColor={primarycolor}
        barStyle="light-content"
      />
      <ScrollView style={css.container}>
        <View style={styles.topnav}>
          <View className="topnavuname">
            <Text style={{ ...styles.tpn1, ...css.txt }}>Good day!</Text>
            <Text style={{ ...styles.tpn2, ...css.txt }}>{myuname}</Text>
          </View>
          <TouchableOpacity onPress={changeTheme}>
            <Ionicons
              name={lightmode ? "moon-outline" : "sunny"}
              style={{ margin: 10, fontSize: 30 }}
              color={primarycolor}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="gray" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search diaries..."
            value={searchQuery}
            onChangeText={(text) => setSearchQuery(text)}
          />
        </View>

        <Dashboard />

        <View>
          <ScrollView
            showsHorizontalScrollIndicator={false}
            style={{ flexDirection: "row" }}
            horizontal={true}
          >
            <View style={{ marginLeft: 15 }}></View>
            {pastTenYears.map((year) => (
              <TouchableOpacity onPress={() => setyearfilter(year)} key={year}>
                <Yearbtn year={year} active={year === yearfilter} />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View>
          <ScrollView
            showsHorizontalScrollIndicator={false}
            style={{ flexDirection: "row" }}
            horizontal={true}
          >
            <View style={{ marginLeft: 15 }}></View>
            {rearrangedMonths.map((month) => (
              <TouchableOpacity
                key={month}
                onPress={() => setmonthfilter(month)}
              >
                <ChipNav name={month} active={month === monthfilter} />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <Calendar
          onDayPress={(day) => {
            setDayFilter(day.dateString);
          }}
          markedDates={markedDates}
        />

        {diaries.length > 0 ? (
          diaries.map((diary, index) => (
            <DiaryList
              key={diary.id || index}
              id={diary.id}
              title={diary.title}
              timestamp={diary.timestamp}
              data={diary}
            />
          ))
        ) : (
          <NoResultComponent />
        )}
        <Timeline entries={diaries} />
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  topnav: {
    padding: 10,
    borderRadius: 10,
    margin: 20,
    marginTop: 30,
    marginBottom: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  tpn2: {
    fontSize: 24,
    fontWeight: "bold",
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    padding: 10,
    margin: 20,
    marginBottom: 10,
  },
  searchInput: {
    marginLeft: 10,
    fontSize: 16,
    flex: 1,
  },
  tag: {
    margin: 5,
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
  },
  selectedTag: {
    margin: 5,
    padding: 10,
    backgroundColor: "#7856FF",
    borderRadius: 10,
  },
});
