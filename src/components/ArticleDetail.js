import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  Platform,
  Pressable,
  VirtualizedList,
  ImageBackground,
  ActivityIndicator,
} from 'react-native';

import { getNewsById } from '../services';
import { parseText } from '../utils';

import AudioPlayer from './AudioPlayer';
import Icon from './Icon';

const itemStyle = {
  fontSize: Platform.OS === 'ios' ? 18 : 16,
  marginBottom: 10,
};

const Item = ({ type, value }) => {
  if (type === 'title') {
    return <Text style={{ fontWeight: 'bold', ...itemStyle }}>{value}</Text>;
  }
  return <Text style={itemStyle}>{value}</Text>;
};

const ArticleDetail = ({ navigation, route }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [article, setArticle] = useState(null);
  const [formatTexts, setFormatTexts] = useState([]);

  const { id } = route.params;
  useEffect(() => {
    getNewsById(id).then(result => {
      const texts = parseText(result.transcript);
      setFormatTexts(texts);
      setArticle(result);
    });
  }, [id]);

  if (!article) {
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
    <View
      style={{ paddingVertical: 10, backgroundColor: '#fff', height: '100%' }}>
      <Modal
        animationType="slide"
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <ImageBackground
          source={{ uri: article.cover }}
          style={{ flex: 1 }}
          blurRadius={6}>
          <AudioPlayer
            article={article}
            onClose={() => setModalVisible(false)}
          />
        </ImageBackground>
      </Modal>
      <ImageBackground
        source={{ uri: article.cover }}
        style={{
          flexDirection: 'row',
          position: 'absolute',
          borderRadius: 2,
          overflow: 'hidden',
          bottom: 35,
          right: 35,
          zIndex: 100,
        }}>
        <Pressable onPress={() => setModalVisible(true)}>
          <Icon name="play" size={30} color="#fff" />
        </Pressable>
        <Pressable onPress={() => navigation.navigate('Home')}>
          <Icon name="home" size={30} color="orange" />
        </Pressable>
      </ImageBackground>
      <VirtualizedList
        data={formatTexts}
        style={{ paddingHorizontal: 10 }}
        keyExtractor={({ type, value }, index) => `${type}_${value}_${index}`}
        getItemCount={data => data.length}
        getItem={(data, index) => data[index]}
        renderItem={({ item }) => <Item {...item} />}
      />
    </View>
  );
};

export default ArticleDetail;
