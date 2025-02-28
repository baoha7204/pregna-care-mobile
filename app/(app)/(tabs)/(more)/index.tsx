'use client';

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import useSession from '@/hooks/useSession';
import { theme } from '@/styles/theme';

const ProfileScreen = () => {
  const { signOut } = useSession();

  const router = useRouter();

  const menuItems = [
    {
      icon: <Ionicons name='person-outline' size={24} color={theme.primary} />,
      title: 'My profile',
      onPress: () => router.push('/edit-profile'),
    },
    // {
    //   icon: <FontAwesome5 name='baby-carriage' size={24} color='#2AA1AF' />,
    //   title: 'My Registry Builder',
    //   onPress: () => router.push('/registry-builder'),
    // },
    // {
    //   icon: <Ionicons name='settings-outline' size={24} color='#2AA1AF' />,
    //   title: 'Settings',
    //   onPress: () => router.push('/settings'),
    // },
    {
      icon: <FontAwesome5 name='seedling' size={24} color={theme.primary} />,
      title: 'My Fatus',
      // onPress: () => router.push('/baby-center'),
    },
    // {
    //   icon: <Ionicons name='chatbubble-outline' size={24} color='#2AA1AF' />,
    //   title: 'Community',
    //   onPress: () => router.push('/community'),
    // },
    // {
    //   icon: <Ionicons name='star-outline' size={24} color='#2AA1AF' />,
    //   title: 'Love the app? Rate it',
    //   onPress: () => console.log('Rate app'),
    // },
    // {
    //   icon: <Ionicons name='share-outline' size={24} color='#2AA1AF' />,
    //   title: 'Share the app',
    //   onPress: () => console.log('Share app'),
    // },
    // {
    //   icon: (
    //     <Ionicons name='information-circle-outline' size={24} color='#2AA1AF' />
    //   ),
    //   title: 'About Us',
    //   onPress: () => router.push('/about'),
    // },
    // {
    //   icon: <Ionicons name='help-circle-outline' size={24} color='#2AA1AF' />,
    //   title: 'FAQ',
    //   onPress: () => router.push('/faq'),
    // },
    // {
    //   icon: <Ionicons name='megaphone-outline' size={24} color='#2AA1AF' />,
    //   title: 'Feedback',
    //   onPress: () => router.push('/feedback'),
    // },
    // {
    //   icon: <Ionicons name='code-outline' size={24} color='#2AA1AF' />,
    //   title: 'Software Attribution',
    //   onPress: () => router.push('/attribution'),
    // },
    {
      icon: <Ionicons name='exit-outline' size={24} color={theme.primary} />,
      title: 'Log out',
      onPress: () => signOut(),
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle='light-content' />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>More</Text>
      </View>

      <View style={styles.menuContainer}>
        {menuItems.map((item, index) => (
          <React.Fragment key={index}>
            <TouchableOpacity style={styles.menuItem} onPress={item.onPress}>
              <View style={styles.iconContainer}>{item.icon}</View>
              <Text style={styles.menuItemText}>{item.title}</Text>
              <Ionicons name='chevron-forward' size={20} color='#CCCCCC' />
            </TouchableOpacity>
            {index < menuItems.length - 1 && <View style={styles.separator} />}
          </React.Fragment>
        ))}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    backgroundColor: theme.primary,
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '500',
  },
  menuContainer: {
    flex: 1,
    paddingTop: 5,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  iconContainer: {
    width: 30,
    alignItems: 'center',
    marginRight: 15,
  },
  menuItemText: {
    flex: 1,
    fontSize: 16,
    color: '#555555',
  },
  separator: {
    height: 1,
    backgroundColor: '#EEEEEE',
    marginLeft: 65,
  },
  bottomTabBar: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    paddingBottom: 25, // Extra padding for iPhone X and newer
    paddingTop: 10,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: {
    fontSize: 12,
    marginTop: 4,
    color: '#999999',
  },
  activeTabLabel: {
    color: '#2AA1AF',
  },
});

export default ProfileScreen;
