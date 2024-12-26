import { Stack } from 'expo-router';
import 'react-native-reanimated';

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useState } from "react"

// Prevent the splash screen from auto-hiding before asset loading is complete.
// SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  // Create a client
  const [queryClient] = useState(() => new QueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      <Stack>
        <Stack.Screen 
          name="(tabs)" 
          options={{ 
            headerShown: false 
          }} 
        />
      </Stack>
    </QueryClientProvider>
  )
}
