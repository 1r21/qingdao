import React, { useEffect, useState } from 'react';
import {
  Text,
  View,
  Alert,
  Image,
  Pressable,
  VirtualizedList,
  ActivityIndicator,
} from 'react-native';

import { getNews } from '../services';

const Thumb = ({ uri, date, title }) => {
  const [cover, setCover] = useState('http://ai.1r21.cn/place/1016.jpg');

  return (
    <View
      style={{
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
      }}>
      <Image
        style={{ width: '100%', height: 200 }}
        source={{
          uri: cover,
        }}
        onLoad={() => setCover(uri)}
      />
      <Text style={{ marginVertical: 10 }}>{date}</Text>
      <Text style={{ fontSize: 15 }}>{title}</Text>
    </View>
  );
};

const Articles = ({ navigation }) => {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    getNews()
      .then(({ list }) => {
        setArticles(list);
      })
      .catch(err => {
        Alert.alert(err);
      });
  }, []);

  if (articles.length === 0) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
        }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <VirtualizedList
      data={articles}
      initialNumToRender={4}
      keyExtractor={item => item.id}
      getItemCount={data => data.length}
      getItem={(data, index) => data[index]}
      renderItem={({ item }) => (
        <Pressable
          onPress={() => {
            navigation.navigate('Detail', { id: item.id, date: item.date });
          }}>
          <Thumb title={item.title} uri={item.cover} date={item.date} />
        </Pressable>
      )}
    />
  );
};

export default Articles;
