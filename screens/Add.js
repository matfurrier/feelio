import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TextInput,
  StyleSheet,
  Button,
  Image,
} from "react-native";
import useStyles from "../constants/styles";
import AddTopBar from "../components/AddTopBar";
import { insertDiary } from "../constants/Database";
import { useNavigation } from "@react-navigation/native";
import { DContexts } from "../contexts/DContexts";
import SecureStoreModel from "../constants/SecureStoreModel";
import { Audio } from 'expo-av';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { RichEditor, RichToolbar } from 'react-native-pell-rich-editor';
import DocumentPicker from 'react-native-document-picker';
import TagInput from 'react-native-tags-input';

export default function Add() {
  SecureStoreModel.itemExists("myKey").then((exists) => {
    console.log(`Does "myKey" exist? ${exists}`);
  });
  const css = useStyles();
  const navigation = useNavigation();
  const [text, onChangeTitle] = useState("");
  const [value, onChangeText] = useState("");
  const { changedsomething } = useContext(DContexts);
  const { setChangedSomething } = useContext(DContexts);
  const { txtcolor } = useContext(DContexts);
  const [recording, setRecording] = useState(null);
  const [image, setImage] = useState(null);
  const [location, setLocation] = useState(null);
  const richText = React.useRef();
  const [documentUri, setDocumentUri] = useState(null);
  const [tags, setTags] = useState({ tag: '', tagsArray: [] });

  const date = new Date();
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const monthIndex = date.getMonth();
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
  const year = date.getFullYear();
  const unixTimestampMillis = date.getTime();
  const unixTimestampSeconds = Math.floor(unixTimestampMillis / 1000);
  const hour = date.getHours();
  const minute = date.getMinutes();

  useEffect(() => {
    (async () => {
      await Permissions.askAsync(Permissions.AUDIO_RECORDING);
      await Permissions.askAsync(Permissions.CAMERA);
      await Permissions.askAsync(Permissions.LOCATION);
    })();
  }, []);

  const updateTagState = (state) => {
    setTags(state);
  };

  const startRecording = async () => {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      const { recording } = await Audio.Recording.createAsync(
        Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
      );
      setRecording(recording);
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  };

  const pickDocument = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf, DocumentPicker.types.allFiles],
      });
      console.log('Selected document: ', res.uri);
      setDocumentUri(res.uri);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('User canceled the picker');
      } else {
        throw err;
      }
    }
  };

  const stopRecording = async () => {
    setRecording(null);
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    console.log('Recording stopped and stored at', uri);
  };

  const pickImage = async () => {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status === 'granted') {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.cancelled) {
        setImage(result.uri);
      }
    }
  };

  const getLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.log('Permission to access location was denied');
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    setLocation(location);
  };

  const submitDiary = async () => {
    const audioUri = recording ? recording.getURI() : null;
    const videoUri = image ? image : null;
    const locationData = location ? JSON.stringify(location) : null;
    try {
      await insertDiary(
        text,
        value,
        year,
        month,
        tags = tags.tagsArray,
        day,
        hour,
        minute,
        monthName,
        unixTimestampSeconds,
        audioUri,
        videoUri,
        locationData
      );

      setChangedSomething(Math.floor(Math.random() * (5000 - 0 + 1)) + 0);
      onChangeText("");
      onChangeTitle("");
      navigation.navigate("Home");
    } catch (error) {
      console.error("Failed to insert Diary:", error);
    }
  };

  return (
    <ScrollView style={css.container}>
      <SafeAreaView>
        <AddTopBar acton={submitDiary} />
        <View style={{ padding: 10 }}>
          <Text style={css.greytext}>Title</Text>
          <TextInput
            style={{ ...css.txt, ...styles.title_input }}
            onChangeText={onChangeTitle}
            value={text}
            placeholder="Enter your title"
            autoFocus={true}
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
            placeholder="Add tags..."
          />
          
          <Button title="Gravar Áudio" onPress={recording ? stopRecording : startRecording} />
          <Button title="Escolher Imagem" onPress={pickImage} />
          {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
          <Button title="Obter Localização" onPress={getLocation} />
          {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
          {location && (
            <Text>
              Localização: {location.coords.latitude}, {location.coords.longitude}
            </Text>
          )}
           <Button title="Escolher Documento" onPress={pickDocument} />
          {documentUri && <Text>Selected document: {documentUri}</Text>}
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
