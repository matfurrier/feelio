import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TextInput,
  StyleSheet,
} from "react-native";
import useStyles from "../constants/styles";
import EditTopBar from "../components/EditTopBar";
import { useRoute, useNavigation } from "@react-navigation/native";
import { getDiary, updateDiary } from "../constants/Database";
import { DContexts } from "../contexts/DContexts";
import TagInput from 'react-native-tags-input';

export default function Edit() {
  const css = useStyles();
  const route = useRoute();
  const navigation = useNavigation();
  const diaryid = route.params.id;
  const [text, onChangeTitle] = React.useState("");
  const [value, onChangeText] = React.useState("");
  const [diary, setDiary] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [day, setDay] = useState(null);
  const [month, setMonth] = useState(null);
  const [year, setYear] = useState(null);
  const [audioUri, setAudioUri] = useState(null);
  const [videoUri, setVideoUri] = useState(null);
  const [location, setLocation] = useState(null);
  const [tags, setTags] = useState({ tag: '', tagsArray: [] });

  const { changedsomething } = useContext(DContexts);
  const { setChangedSomething } = useContext(DContexts);
  const { txtcolor } = useContext(DContexts);

  const updateTagState = (state) => {
    setTags(state);
  };
  
  useEffect(() => {
    getDiary(diaryid)
      .then((data) => {
        if (data[0]) {
          onChangeTitle(data[0].title);
          onChangeText(data[0].content);
          setTags({ tag: '', tagsArray: data[0].tags });
          setDay(data[0].day);
          setMonth(data[0].monthname);
          setYear(data[0].year);
          setAudioUri(data[0].audioUri);
          setVideoUri(data[0].videoUri);
          setLocation(data[0].location);
          setDiary(data);
        }
      })
      .catch((error) => {
        console.error("Failed to get diaries:", error);
      });
  }, []);

  const editDiary = async () => {
    try {
      await updateDiary(diaryid, text, value);
      setChangedSomething(Math.floor(Math.random() * (5000 - 0 + 1)) + 0);
      navigation.navigate("Diary", { id: diaryid });
    } catch (error) {
      console.error("Failed to update Diary:", error);
    }
  };


  return (
    <ScrollView style={css.container}>
      <SafeAreaView>
        <EditTopBar acton={editDiary} />
        <View style={{ padding: 10 }}>
          <Text style={css.greytext}>Title</Text>
          <TextInput
            style={{ ...css.txt, ...styles.title_input }}
            onChangeText={onChangeTitle}
            value={text}
            placeholder="Enter your title"
            placeholderTextColor={txtcolor}
          />
          <Text style={css.greytext}>Text</Text>
          <RichEditor
            ref={richText}
            onChange={(value) => onChangeText(value)}
            initialContentHTML={value}
            editorStyle={{ backgroundColor: 'white', color: 'black' }}
            placeholder="How are you feeling?"
          />
          <RichToolbar editor={richText} actions={['bold', 'italic', 'underline', 'strikethrough']} />
          <TagInput
            updateState={updateTagState}
            tags={tags}
            placeholder="Edit tags..."
          />
        </View>
      </SafeAreaView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  title_input: {
    margin: 15,
    padding: 5,
    fontSize: 17,
  },
});
