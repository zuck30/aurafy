import React from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { Box, Flex, Icon, Text, useColorModeValue } from '@chakra-ui/react';
import { FaHome, FaClock, FaList, FaHeart } from 'react-icons/fa';

const NavItem = ({ icon, children, path, isActive }) => {
  const activeColor = useColorModeValue('white', 'white');
  const inactiveColor = useColorModeValue('gray.500', 'gray.400');
  const activeBgColor = useColorModeValue('#1db954', 'rgba(29, 185, 84, 0.2)');

  return (
    <RouterLink to={path} style={{ textDecoration: 'none', flex: 1 }}>
      <Flex
        direction="column"
        align="center"
        justify="center"
        p="2"
        borderRadius="md"
        bg={isActive ? activeBgColor : 'transparent'}
        color={isActive ? activeColor : inactiveColor}
        _hover={{
          bg: 'rgba(255, 255, 255, 0.1)',
          color: 'white',
        }}
        transition="all 0.2s ease"
      >
        <Icon as={icon} fontSize="xl" />
        <Text fontSize="xs" mt="1">{children}</Text>
      </Flex>
    </RouterLink>
  );
};

const BottomNavBar = () => {
  const location = useLocation();
  const bgColor = useColorModeValue('rgba(18, 18, 18, 0.98)', 'rgba(18, 18, 18, 0.98)');
  const borderColor = useColorModeValue('whiteAlpha.200', 'whiteAlpha.200');

  const navItems = [
    { name: 'Home', icon: FaHome, path: '/' },
    { name: 'Recent', icon: FaClock, path: '/analyze/recent' },
    { name: 'Playlists', icon: FaList, path: '/analyze/playlists' },
    { name: 'Liked', icon: FaHeart, path: '/liked' },
  ];

  return (
    <Box
      display={{ base: 'block', md: 'none' }}
      position="fixed"
      bottom="0"
      left="0"
      right="0"
      bg={bgColor}
      borderTop="1px"
      borderTopColor={borderColor}
      zIndex="10"
      backdropFilter="blur(16px)"
      fontFamily="'Circular', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    >
      <Flex justify="space-around" align="center" p="2">
        {navItems.map((item) => (
          <NavItem key={item.name} icon={item.icon} path={item.path} isActive={location.pathname === item.path}>
            {item.name}
          </NavItem>
        ))}
      </Flex>
    </Box>
  );
};

export default BottomNavBar;
