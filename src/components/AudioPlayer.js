import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  Image,
  Platform,
  Pressable,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import Slider from '@react-native-community/slider';
import TrackPlayer, {
  Event,
  State,
  Capability,
  useProgress,
  usePlaybackState,
  useTrackPlayerEvents,
} from 'react-native-track-player';

import Icon from './Icon';

const setup = async ({ title, src, date, cover }) => {
  await TrackPlayer.setupPlayer();
  await TrackPlayer.updateOptions({
    stopWithApp: true,
    capabilities: [
      Capability.Play,
      Capability.Pause,
      Capability.SkipToNext,
      Capability.SkipToPrevious,
      Capability.Stop,
    ],
    compactCapabilities: [Capability.Play, Capability.Pause],
  });

  await TrackPlayer.add({
    url: src,
    title,
    artist: date,
    artwork: cover,
  });
};

const togglePlayback = async playbackState => {
  const currentTrack = await TrackPlayer.getCurrentTrack();
  if (currentTrack == null) {
    // TODO: Perhaps present an error or restart the playlist?
  } else {
    if (playbackState === State.Paused) {
      await TrackPlayer.play();
    } else {
      await TrackPlayer.pause();
    }
  }
};

const AudioPlayer = ({ article, onClose }) => {
  const playbackState = usePlaybackState();
  const progress = useProgress();

  const [trackArtwork, setTrackArtwork] = useState();
  const [trackTitle, setTrackTitle] = useState();
  const [trackArtist, setTrackArtist] = useState();

  useTrackPlayerEvents([Event.PlaybackTrackChanged], async event => {
    if (event.type === Event.PlaybackTrackChanged && event.nextTrack != null) {
      const track = await TrackPlayer.getTrack(event.nextTrack);
      const { title, artist, artwork } = track || {};
      setTrackTitle(title);
      setTrackArtist(artist);
      setTrackArtwork(artwork);
    }
  });

  useEffect(() => {
    setup(article);
  }, [article]);

  return (
    <View style={styles.screenContainer}>
      <SafeAreaView style={styles.hideButton}>
        <Pressable onPress={onClose}>
          <Icon name="down" size={40} color="#fff" />
        </Pressable>
      </SafeAreaView>
      <View style={styles.contentContainer}>
        <Image style={styles.artwork} source={{ uri: `${trackArtwork}` }} />
        <Text style={styles.titleText}>{trackTitle}</Text>
        <Text style={styles.artistText}>{trackArtist}</Text>
        <Slider
          style={styles.progressContainer}
          value={progress.position}
          minimumValue={0}
          maximumValue={progress.duration}
          thumbTintColor="#FFD479"
          minimumTrackTintColor="#FFD479"
          maximumTrackTintColor="#FFFFFF"
          onSlidingComplete={async value => {
            await TrackPlayer.seekTo(value);
          }}
        />
        <View style={styles.progressLabelContainer}>
          <Text style={styles.progressLabelText}>
            {new Date(progress.position * 1000).toISOString().substr(14, 5)}
          </Text>
          <Text style={styles.progressLabelText}>
            {new Date((progress.duration - progress.position) * 1000)
              .toISOString()
              .substr(14, 5)}
          </Text>
        </View>
      </View>
      <View style={styles.actionRowContainer}>
        <Pressable onPress={() => TrackPlayer.skipToPrevious()}>
          <Icon name="prev" size={40} color="#FFD479" />
        </Pressable>
        <Pressable onPress={() => togglePlayback(playbackState)}>
          <Icon
            name={playbackState === State.Playing ? 'pause' : 'play'}
            size={50}
            color="#FFD479"
          />
        </Pressable>
        <Pressable onPress={() => TrackPlayer.skipToNext()}>
          <Icon name="next" size={40} color="#FFD479" />
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    alignItems: 'center',
  },
  hideButton: {
    alignSelf: 'flex-start',
    marginLeft: 6,
  },
  contentContainer: {
    width: '100%',
    flex: 1,
    alignItems: 'center',
  },
  artwork: {
    width: 200,
    height: 200,
    marginTop: Platform.OS === 'ios' ? 80 : 50,
    borderRadius: 4,
    backgroundColor: 'grey',
  },
  titleText: {
    width: 320,
    fontSize: 15,
    marginTop: 30,
    color: 'white',
    fontWeight: '600',
  },
  artistText: {
    marginTop: 10,
    color: '#bbb',
    fontSize: 16,
    fontWeight: '200',
  },
  progressContainer: {
    height: 20,
    width: 360,
    marginTop: Platform.OS === 'ios' ? 60 : 40,
    flexDirection: 'row',
  },
  progressLabelContainer: {
    width: 340,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressLabelText: {
    color: 'white',
    marginTop: 8,
    fontVariant: ['tabular-nums'],
  },
  actionRowContainer: {
    width: '60%',
    flexDirection: 'row',
    marginBottom: Platform.OS === 'ios' ? 150 : 80,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

export default AudioPlayer;
