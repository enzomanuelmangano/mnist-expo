import React from 'react';
import { Slot } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

function Layout() {
  return (
    <>
      <StatusBar style="light" />
      <Slot />
    </>
  );
}

// eslint-disable-next-line import/no-default-export
export default Layout;
