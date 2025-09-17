import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import {
  Box,
  Flex,
  Text,
  VStack,
  Heading,
  SimpleGrid,
  Card,
  CardBody,
  Image,
  Spinner,
  Center,
  useDisclosure,
  IconButton,
  Avatar,
  Button,
  Icon,
  Drawer,
  DrawerContent,
} from '@chakra-ui/react';
import { 
  FaHome, 
  FaPalette, 
  FaSignOutAlt,
  FaBars,
  FaList,
} from 'react-icons/fa';
import { getPlaylists, getRecentlyPlayed } from '../api';
import { useAuth } from '../App';

const SidebarContent = ({ onClose, ...rest }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navItems = [
    { name: 'Home', icon: FaHome, path: '/' },
    { name: 'Analyze Recent', icon: FaPalette, path: '/analyze/recent' },
    { name: 'Analyze Playlist', icon: FaList, path: '/analyze/playlists' },
  ];

  return (
    <Box
      bg={{ base: 'white', _dark: 'gray.900' }}
      borderRight="1px"
      borderRightColor={{ base: 'gray.200', _dark: 'gray.700' }}
      w={{ base: 'full', md: 60 }}
      pos="fixed"
      h="full"
      {...rest}
    >
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold">
          Aurafy
        </Text>
        <IconButton
          display={{ base: 'flex', md: 'none' }}
          onClick={onClose}
          variant="outline"
          aria-label="close menu"
          icon={<FaPalette />}
        />
      </Flex>
      {navItems.map((link) => (
        <NavItem key={link.name} icon={link.icon} path={link.path} isActive={location.pathname === link.path}>
          {link.name}
        </NavItem>
      ))}
      <VStack pos="absolute" bottom="8" w="full" spacing="4">
        <Flex align="center">
          <Avatar size="sm" name={user?.display_name} src={user?.images?.[0]?.url} />
          <Text ml="3">{user?.display_name}</Text>
        </Flex>
        <Button
          w="80%"
          colorScheme="red"
          leftIcon={<FaSignOutAlt />}
          onClick={logout}
        >
          Logout
        </Button>
      </VStack>
    </Box>
  );
};

const NavItem = ({ icon, children, path, isActive, ...rest }) => {
  return (
    <RouterLink to={path} style={{ textDecoration: 'none' }}>
      <Flex
        align="center"
        p="4"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        bg={isActive ? 'green.400' : 'transparent'}
        color={isActive ? 'white' : 'inherit'}
        _hover={{
          bg: 'green.500',
          color: 'white',
        }}
        {...rest}
      >
        {icon && (
          <Icon
            mr="4"
            fontSize="16"
            as={icon}
          />
        )}
        {children}
      </Flex>
    </RouterLink>
  );
};

const MobileNav = ({ onOpen, ...rest }) => {
    const { user } = useAuth();
  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 24 }}
      height="20"
      alignItems="center"
      bg={{ base: 'white', _dark: 'gray.900' }}
      borderBottomWidth="1px"
      borderBottomColor={{ base: 'gray.200', _dark: 'gray.700' }}
      justifyContent="space-between"
      {...rest}
    >
      <IconButton
        variant="outline"
        onClick={onOpen}
        aria-label="open menu"
        icon={<FaBars />}
      />
      <Text fontSize="2xl" ml="8" fontFamily="monospace" fontWeight="bold">
        Dashboard
      </Text>
      <Avatar size="sm" name={user?.display_name} src={user?.images?.[0]?.url} />
    </Flex>
  );
};

const PlaylistCard = ({ playlist }) => (
  <RouterLink to={`/analyze/playlist/${playlist.id}`}>
    <Card
      bg={{ base: 'gray.100', _dark: 'gray.700' }}
      _hover={{ transform: 'scale(1.05)', shadow: 'lg' }}
      transition="all 0.2s"
    >
      <CardBody>
        <Image src={playlist.images[0]?.url} alt={playlist.name} borderRadius="lg" />
        <VStack mt="4" spacing="2" align="start">
          <Heading size="md">{playlist.name}</Heading>
          <Text noOfLines={2}>{playlist.description || 'No description'}</Text>
          <Text fontSize="sm" color="gray.500">{playlist.tracks.total} tracks</Text>
        </VStack>
      </CardBody>
    </Card>
  </RouterLink>
);

const TrackItem = ({ item }) => (
  <Flex align="center" p="2" _hover={{ bg: { base: 'gray.200', _dark: 'gray.600' } }} borderRadius="md">
    <Image boxSize="50px" src={item.track.album.images[0]?.url} alt={item.track.name} mr="4" borderRadius="md" />
    <Box>
      <Text fontWeight="bold">{item.track.name}</Text>
      <Text fontSize="sm" color="gray.500">
        {item.track.artists.map(artist => artist.name).join(', ')}
      </Text>
    </Box>
  </Flex>
);

const Dashboard = () => {
  const { token, user } = useAuth();
  const [playlists, setPlaylists] = useState([]);
  const [recentTracks, setRecentTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [playlistsRes, recentRes] = await Promise.all([
          getPlaylists(token),
          getRecentlyPlayed(token)
        ]);
        setPlaylists(playlistsRes.data.items);
        setRecentTracks(recentRes.data.items);
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchData();
    }
  }, [token]);

  if (loading) {
    return (
      <Center h="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  return (
    <Box minH="100vh" bg={{ base: 'gray.100', _dark: 'gray.800' }}>
      <SidebarContent onClose={() => onClose} display={{ base: 'none', md: 'block' }} />
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full"
      >
        <DrawerContent>
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer>

      <MobileNav display={{ base: 'flex', md: 'none' }} onOpen={onOpen} />

      <Box ml={{ base: 0, md: 60 }} p="8">
        <Heading mb="4">Welcome, {user?.display_name}</Heading>
        <Text fontSize="xl" mb="8">Here's your musical world at a glance.</Text>

        <VStack spacing="12" align="stretch">
          <Box>
            <Heading size="lg" mb="4">Your Playlists</Heading>
            <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={6}>
              {playlists.map(p => <PlaylistCard key={p.id} playlist={p} />)}
            </SimpleGrid>
          </Box>

          <Box>
            <Heading size="lg" mb="4">Recently Played</Heading>
            <VStack spacing="4" align="stretch">
              {recentTracks.slice(0, 10).map(item => <TrackItem key={item.played_at} item={item} />)}
            </VStack>
          </Box>
        </VStack>
      </Box>
    </Box>
  );
};

export default Dashboard;