import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { Redirect } from 'expo-router';

export default function Index() {
  // Instead of using router.replace, use the Redirect component
  // which safely handles navigation after layout mounting
  return <Redirect href="/auth/register" />;
}
