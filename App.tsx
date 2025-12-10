import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { BoxingTimerProvider } from './src/context/BoxingTimerContext';
import { SetupPage } from './src/screens/SetupPage';
import { TimerPage } from './src/screens/TimerPage';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <BoxingTimerProvider>
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
              headerShown: false,
              animationEnabled: true,
            }}
          >
            <Stack.Screen
              name="Setup"
              component={SetupScreenWrapper}
              options={{ animationTypeForReplace: 'fade' }}
            />
            <Stack.Screen
              name="Timer"
              component={TimerScreenWrapper}
              options={{ animationTypeForReplace: 'fade' }}
            />
          </Stack.Navigator>
        </NavigationContainer>
        <StatusBar style="light" />
      </BoxingTimerProvider>
    </SafeAreaProvider>
  );
}

function SetupScreenWrapper({ navigation }: any) {
  return <SetupPage onNavigateToTimer={() => navigation.navigate('Timer')} />;
}

function TimerScreenWrapper({ navigation }: any) {
  return <TimerPage onNavigateToSetup={() => navigation.navigate('Setup')} />;
}
