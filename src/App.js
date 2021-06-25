import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Articles from './components/Articles';
import ArticleDetail from './components/ArticleDetail';

export { default as playerService } from './services/playerService';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={Articles}
          options={{ title: 'Home' }}
        />
        <Stack.Screen
          name="Detail"
          component={ArticleDetail}
          options={({ route }) => ({ title: route.params?.date })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
