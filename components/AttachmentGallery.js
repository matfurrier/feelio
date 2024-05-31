import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';

export default function AttachmentGallery({ attachments }) {
  return (
    <ScrollView style={styles.container}>
      {attachments.map((attachment, index) => (
        <View key={index} style={styles.attachment}>
          {attachment.type === 'image' && (
            <Image source={{ uri: attachment.uri }} style={styles.image} />
          )}
          {attachment.type === 'audio' && (
            <Text style={styles.mediaText}>Audio: {attachment.uri}</Text>
          )}
          {attachment.type === 'video' && (
            <Text style={styles.mediaText}>Video: {attachment.uri}</Text>
          )}
          {attachment.type === 'document' && (
            <Text style={styles.mediaText}>Document: {attachment.uri}</Text>
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
  attachment: {
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
