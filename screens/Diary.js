import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  StyleSheet,
} from "react-native";
import useStyles from "../constants/styles";
import DiaryTopBar from "../components/DiaryTopBar";
import { useNavigation, useRoute } from "@react-navigation/native";
import { getDiary } from "../constants/Database";
import { DContexts } from "../contexts/DContexts";
import AttachmentGallery from "../components/AttachmentGallery";
import MapComponent from "../components/MapView";

export default function Diary() {
  const navigation = useNavigation();
  const route = useRoute();
  const diaryid = route.params.id;
  const [diary, setDiary] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [day, setDay] = useState(null);
  const [month, setMonth] = useState(null);
  const [year, setYear] = useState(null);
  const [attachments, setAttachments] = useState([]);
  const [location, setLocation] = useState(null);

  const { changedsomething } = useContext(DContexts);
  const { setChangedSomething } = useContext(DContexts);

  const css = useStyles();
  
  useEffect(() => {
    getDiary(diaryid)
      .then((data) => {
        if (data[0]) {
          setTitle(data[0].title);
          setContent(data[0].content);
          setDay(data[0].day);
          setMonth(data[0].monthname);
          setYear(data[0].year);
          const attachmentList = [];
          if (data[0].audioUri) attachmentList.push({ type: 'audio', uri: data[0].audioUri });
          if (data[0].videoUri) attachmentList.push({ type: 'video', uri: data[0].videoUri });
          if (data[0].imageUri) attachmentList.push({ type: 'image', uri: data[0].imageUri });
          if (data[0].documentUri) attachmentList.push({ type: 'document', uri: data[0].documentUri });
          setAttachments(attachmentList);
          setLocation(data[0].location);
          setDiary(data);
        }
      })
      .catch((error) => {
        console.error("Failed to get diaries:", error);
      });
  }, [changedsomething]);

  const goToEdit = (did) => {
    navigation.navigate("Edit", { id: did });
  };

  return (
    <ScrollView style={css.container}>
      <SafeAreaView>
        <DiaryTopBar acton={() => goToEdit(diaryid)} diaryid={diaryid} />
        <View style={{ margin: 15 }}>
          <Text style={css.greytext}>
            {day}, {month} {year}
          </Text>
          <Text style={{ ...css.txt, ...styles.title }}>{title}</Text>
          <Text style={{ ...css.txt, ...styles.content }}>{content}</Text>
          <AttachmentGallery attachments={attachments} />
          {location && (
            <MapComponent locations={[{ latitude: location.latitude, longitude: location.longitude, title: 'Location', description: 'Visited location' }]} />
          )}
        </View>
      </SafeAreaView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  title: {
    margin: 10,
    marginLeft: 0,
    marginTop: 1,
    padding: 5,
    fontSize: 28,
    fontWeight: "600",
    letterSpacing: 1,
  },
  content: {
    fontSize: 16,
    lineHeight: 16,
    margin: 5,
  },
});
