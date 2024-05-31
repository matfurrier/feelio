import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';

export default function Timeline({ entries }) {
  return (
    <ScrollView style={styles.container}>
      {entries.map((entry, index) => (
        <View key={index} style={styles.entry}>
          <Text style={styles.date}>{entry.date}</Text>
          <Text style={styles.content}>{entry.content}</Text>
          {entry.imageUri && (
            <Image source={{ uri: entry.imageUri }} style={styles.image} />
          )}
          {entry.audioUri && (
            <Text style={styles.mediaText}>Audio: {entry.audioUri}</Text>
          )}
          {entry.videoUri && (
            <Text style={styles.mediaText}>Video: {entry.videoUri}</Text>
          )}
          {entry.location && (
            <Text style={styles.mediaText}>Location: {entry.location}</Text>
          )}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  entry: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  date: {
    fontSize: 14,
    color: 'grey',
    marginBottom: 5,
  },
  content: {
    fontSize: 16,
  },
  image: {
    width: '100%',
    height: 200,
    marginTop: 10,
  },
  mediaText: {
    marginTop: 10,
    color: 'grey',
  },
});
