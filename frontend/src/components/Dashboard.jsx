import React, { useState, useEffect, useMemo } from 'react';
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
  IconButton,
  Avatar,
  Icon,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  Badge,
  Tooltip,
  Fade,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useBreakpointValue,
  Divider,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
} from '@chakra-ui/react';
import {
  FaHome,
  FaClock,
  FaList,
  FaHeart,
  FaSearch,
  FaTh,
  FaListUl,
  FaBars,
  FaPlay,
  FaSpotify,
  FaSignOutAlt,
  FaHeadphones,
} from 'react-icons/fa';
import { getPlaylists, getRecentlyPlayed } from '../api';
import { useAuth } from '../App';
import BottomNavBar from './BottomNavBar';

const SidebarContent = ({ onClose }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navItems = [
    { name: 'Home', icon: FaHome, path: '/' },
    { name: 'Analyze Recent', icon: FaClock, path: '/analyze/recent' },
    { name: 'Analyze Playlists', icon: FaList, path: '/analyze/playlists' },
    { name: 'Liked Songs', icon: FaHeart, path: '/liked' },
  ];

  return (
    <VStack align="stretch" h="full" spacing={0}>
      {/* Logo */}
      <Flex p={6} align="center">
        <Icon as={FaSpotify} fontSize="3xl" color="#1DB954" mr={3} />
        <Heading size="lg" fontWeight="900" letterSpacing="-0.8px" color="#FFFFFF">
          Aurafy
        </Heading>
      </Flex>

      <Divider borderColor="#282828" />

      {/* Navigation */}
      <VStack align="stretch" spacing={1} px={3} py={4} flex={1}>
        {navItems.map((item) => (
          <RouterLink key={item.path} to={item.path} style={{ textDecoration: 'none' }}>
            <Flex
              align="center"
              p={3}
              borderRadius="md"
              bg={location.pathname === item.path ? '#282828' : 'transparent'}
              color={location.pathname === item.path ? '#FFFFFF' : '#B3B3B3'}
              _hover={{ bg: '#282828' }}
              transition="0.2s"
            >
              <Icon as={item.icon} mr={4} fontSize="lg" color={location.pathname === item.path ? '#1DB954' : '#B3B3B3'} />
              <Text fontWeight="500">{item.name}</Text>
            </Flex>
          </RouterLink>
        ))}
      </VStack>

      {/* User */}
      <Box p={4}>
        <Divider borderColor="#282828" mb={4} />
        <Flex align="center">
          <Avatar size="sm" src={user?.images?.[0]?.url} name={user?.display_name} mr={3} />
          <Box flex={1}>
            <Text fontWeight="bold" fontSize="sm" color="#FFFFFF" noOfLines={1}>
              {user?.display_name}
            </Text>
            <Text fontSize="xs" color="#9B9B9B">
              {user?.email || 'Spotify User'}
            </Text>
          </Box>
          <Tooltip label="Logout">
            <IconButton
              icon={<FaSignOutAlt />}
              variant="ghost"
              color="#B3B3B3"
              _hover={{ color: '#1DB954' }}
              size="sm"
              onClick={logout}
              aria-label="Logout"
            />
          </Tooltip>
        </Flex>
      </Box>
    </VStack>
  );
};

const PlaylistCard = ({ playlist, isListView }) => {
  return (
    <RouterLink to={`/analyze/playlist/${playlist.id}`} style={{ textDecoration: 'none' }}>
      {isListView ? (
        <Flex
          p={3}
          bg="#121212"
          borderRadius="md"
          align="center"
          _hover={{ bg: '#181818' }}
          transition="0.2s"
        >
          <Image
            src={playlist.images[0]?.url || 'https://via.placeholder.com/64'}
            boxSize="50px"
            borderRadius="md"
            mr={4}
          />
          <Box flex={1}>
            <Text fontWeight="bold" color="#FFFFFF" noOfLines={1}>{playlist.name}</Text>
            <Text fontSize="sm" color="#B3B3B3" noOfLines={1}>
              {playlist.tracks.total} songs • {playlist.owner.display_name}
            </Text>
          </Box>
          <IconButton
            icon={<FaPlay />}
            variant="ghost"
            color="#B3B3B3"
            _hover={{ color: '#1DB954' }}
            aria-label="Play"
          />
        </Flex>
      ) : (
        <Card
          bg="#121212"
          borderRadius="lg"
          overflow="hidden"
          role="group"
          transition="all 0.3s"
          _hover={{ transform: 'scale(1.04)', bg: '#181818' }}
        >
          <Box position="relative">
            <Image
              src={playlist.images[0]?.url || 'https://via.placeholder.com/300'}
              alt={playlist.name}
              aspectRatio={1}
              objectFit="cover"
            />
            <Flex
              position="absolute"
              inset={0}
              bg="linear-gradient(to top, rgba(0,0,0,0.7), transparent)"
              opacity={0}
              _groupHover={{ opacity: 1 }}
              transition="0.3s"
              align="center"
              justify="center"
            >
              <IconButton
                icon={<FaPlay />}
                size="lg"
                colorScheme="green"
                bg="#1DB954"
                borderRadius="full"
                _hover={{ bg: '#1ed760', transform: 'scale(1.1)' }}
                aria-label="Play playlist"
              />
            </Flex>
          </Box>
          <CardBody p={4}>
            <VStack align="start" spacing={1}>
              <Text fontWeight="bold" color="#FFFFFF" noOfLines={1}>{playlist.name}</Text>
              <Text fontSize="sm" color="#B3B3B3" noOfLines={1}>
                {playlist.owner.display_name}
              </Text>
              <Badge colorScheme="green" variant="subtle">
                {playlist.tracks.total} tracks
              </Badge>
            </VStack>
          </CardBody>
        </Card>
      )}
    </RouterLink>
  );
};

const TrackItem = ({ item, isListView, index }) => {
  const formatDuration = (ms) => {
    const min = Math.floor(ms / 60000);
    const sec = ((ms % 60000) / 1000).toFixed(0);
    return `${min}:${sec.padStart(2, '0')}`;
  };

  if (isListView) {
    return (
      <Tr
        _hover={{ bg: '#181818' }}
        transition="0.2s"
        cursor="pointer"
      >
        <Td color="#B3B3B3">{index + 1}</Td>
        <Td>
          <HStack>
            <Image
              src={item.track.album.images[0]?.url}
              boxSize="40px"
              borderRadius="sm"
            />
            <Box>
              <Text fontWeight="bold" color="#FFFFFF" noOfLines={1}>{item.track.name}</Text>
              <Text fontSize="sm" color="#B3B3B3">
                {item.track.artists.map(a => a.name).join(', ')}
              </Text>
            </Box>
          </HStack>
        </Td>
        <Td color="#B3B3B3">{item.track.album.name}</Td>
        <Td color="#B3B3B3">{formatDuration(item.track.duration_ms)}</Td>
        <Td>
          <IconButton icon={<FaPlay />} variant="ghost" color="#B3B3B3" _hover={{ color: '#1DB954' }} aria-label="Play" />
        </Td>
      </Tr>
    );
  }

  return (
    <Card
      bg="#121212"
      borderRadius="lg"
      overflow="hidden"
      role="group"
      _hover={{ transform: 'scale(1.04)', bg: '#181818' }}
      transition="all 0.3s"
    >
      <Box position="relative">
        <Image
          src={item.track.album.images[0]?.url || 'https://via.placeholder.com/300'}
          alt={item.track.name}
          aspectRatio={1}
          objectFit="cover"
        />
        <Flex
          position="absolute"
          inset={0}
          bg="linear-gradient(to top, rgba(0,0,0,0.7), transparent)"
          opacity={0}
          _groupHover={{ opacity: 1 }}
          transition="0.3s"
          align="center"
          justify="center"
        >
          <IconButton
            icon={<FaPlay />}
            size="lg"
            colorScheme="green"
            bg="#1DB954"
            borderRadius="full"
            _hover={{ bg: '#1ed760', transform: 'scale(1.1)' }}
            aria-label="Play"
          />
        </Flex>
      </Box>
      <CardBody p={4}>
        <VStack align="start" spacing={1}>
          <Text fontWeight="bold" color="#FFFFFF" noOfLines={1}>{item.track.name}</Text>
          <Text fontSize="sm" color="#B3B3B3" noOfLines={1}>
            {item.track.artists.map(a => a.name).join(', ')}
          </Text>
          <Badge colorScheme="green" variant="subtle">
            {formatDuration(item.track.duration_ms)}
          </Badge>
        </VStack>
      </CardBody>
    </Card>
  );
};

const UserProfileCard = ({ user, playlists, recentTracks }) => {
  const totalTracks = playlists.reduce((sum, p) => sum + (p.tracks?.total || 0), 0);

  return (
    <Card
      bg="linear-gradient(135deg, #121212, #0a0a0a)"
      borderRadius="xl"
      overflow="hidden"
      boxShadow="0 10px 30px rgba(0,0,0,0.5)"
      position="relative"
      border="1px solid"
      borderColor="#282828"
      transition="all 0.3s"
      _hover={{ transform: 'translateY(-4px)', boxShadow: '0 20px 40px rgba(29,185,84,0.15)' }}
    >
      <Box
        position="absolute"
        inset={0}
        bg="linear-gradient(to bottom right, rgba(29,185,84,0.08), transparent 70%)"
        pointerEvents="none"
      />

      <CardBody p={{ base: 6, md: 8 }}>
        <Flex direction={{ base: 'column', md: 'row' }} align={{ base: 'center', md: 'flex-start' }} gap={8}>
          <Box position="relative">
            <Avatar
              size={{ base: '2xl', md: '3xl' }}
              src={user?.images?.[0]?.url}
              name={user?.display_name}
              border="4px solid"
              borderColor="#1DB954"
              boxShadow="0 0 30px rgba(29,185,84,0.4)"
            />
            <Box
              position="absolute"
              bottom={-2}
              right={-2}
              bg="#1DB954"
              color="black"
              borderRadius="full"
              px={3}
              py={1}
              fontSize="xs"
              fontWeight="bold"
            >
              Pro
            </Box>
          </Box>

          <VStack align={{ base: 'center', md: 'start' }} spacing={4} flex={1}>
            <VStack align={{ base: 'center', md: 'start' }} spacing={1}>
              <Heading
                size={{ base: '2xl', md: '3xl' }}
                fontWeight="900"
                letterSpacing="-1px"
                color="#FFFFFF"
              >
                {user?.display_name}
              </Heading>
              <Text fontSize="lg" color="#B3B3B3">
                Your Music Aura
              </Text>
            </VStack>

            <HStack spacing={6} flexWrap="wrap" justify={{ base: 'center', md: 'start' }}>
              <HStack>
                <Icon as={FaHeadphones} color="#1DB954" boxSize={5} />
                <VStack align="start" spacing={0}>
                  <Text fontWeight="bold" fontSize="lg" color="#FFFFFF">
                    {user?.followers?.total?.toLocaleString() || 0}
                  </Text>
                  <Text fontSize="xs" color="#9B9B9B">Followers</Text>
                </VStack>
              </HStack>

              <HStack>
                <Icon as={FaList} color="#1DB954" boxSize={5} />
                <VStack align="start" spacing={0}>
                  <Text fontWeight="bold" fontSize="lg" color="#FFFFFF">
                    {playlists.length}
                  </Text>
                  <Text fontSize="xs" color="#9B9B9B">Playlists</Text>
                </VStack>
              </HStack>

              <HStack>
                <Icon as={FaClock} color="#1DB954" boxSize={5} />
                <VStack align="start" spacing={0}>
                  <Text fontWeight="bold" fontSize="lg" color="#FFFFFF">
                    {totalTracks.toLocaleString()}
                  </Text>
                  <Text fontSize="xs" color="#9B9B9B">Tracks</Text>
                </VStack>
              </HStack>
            </HStack>
          </VStack>
        </Flex>
      </CardBody>
    </Card>
  );
};

const StatsCard = ({ playlists, recentTracks }) => {
  const totalPlaylists = playlists.length;
  const totalRecent = recentTracks.length;
  const avgTracksPerPlaylist = totalPlaylists > 0 ? Math.round(playlists.reduce((sum, p) => sum + (p.tracks?.total || 0), 0) / totalPlaylists) : 0;

  return (
    <Card
      bg="linear-gradient(135deg, #121212, #0a0a0a)"
      borderRadius="xl"
      overflow="hidden"
      boxShadow="0 10px 30px rgba(0,0,0,0.5)"
      border="1px solid"
      borderColor="#282828"
      transition="all 0.3s"
      _hover={{ transform: 'translateY(-4px)', boxShadow: '0 20px 40px rgba(29,185,84,0.15)' }}
    >
      <CardBody p={{ base: 6, md: 8 }}>
        <Heading size="xl" mb={6} fontWeight="900" letterSpacing="-0.5px" color="#FFFFFF">
          Your Stats
        </Heading>

        <SimpleGrid columns={{ base: 1, sm: 3 }} spacing={6}>
          <StatItem
            icon={FaList}
            label="Playlists"
            value={totalPlaylists}
            color="#1DB954"
          />
          <StatItem
            icon={FaClock}
            label="Recent Tracks"
            value={totalRecent}
            color="#1DB954"
          />
          <StatItem
            icon={FaTh}
            label="Avg Tracks/Playlist"
            value={avgTracksPerPlaylist}
            color="#1DB954"
          />
        </SimpleGrid>
      </CardBody>
    </Card>
  );
};

const StatItem = ({ icon, label, value, color }) => (
  <VStack
    bg="#181818"
    p={6}
    borderRadius="lg"
    align="center"
    transition="0.3s"
    _hover={{ bg: '#282828', transform: 'translateY(-4px)' }}
  >
    <Icon as={icon} boxSize={10} color={color} mb={3} />
    <Text fontSize="3xl" fontWeight="900" color="#FFFFFF">
      {value.toLocaleString()}
    </Text>
    <Text fontSize="sm" color="#B3B3B3" mt={1}>
      {label}
    </Text>
  </VStack>
);

const Dashboard = () => {
  const { token, user, recentTracks, setRecentTracks } = useAuth();
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [playlistView, setPlaylistView] = useState('grid');
  const [trackView, setTrackView] = useState('grid');
  const [search, setSearch] = useState('');

  const { isOpen, onOpen, onClose } = useDisclosure();
  const isMobile = useBreakpointValue({ base: true, md: false });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [plRes, recRes] = await Promise.all([
          getPlaylists(token),
          getRecentlyPlayed(token),
        ]);
        setPlaylists(plRes.data.items);
        setRecentTracks(recRes.data.items);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchData();
  }, [token, setRecentTracks]);

  const filteredPlaylists = useMemo(() =>
    playlists.filter(p =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description?.toLowerCase().includes(search.toLowerCase())
    ), [playlists, search]
  );

  const filteredTracks = useMemo(() =>
    recentTracks.filter(t =>
      t.track.name.toLowerCase().includes(search.toLowerCase()) ||
      t.track.artists.some(a => a.name.toLowerCase().includes(search.toLowerCase()))
    ), [recentTracks, search]
  );

  if (loading) {
    return (
      <Center minH="100vh" bg="#000">
        <VStack>
          <Spinner size="xl" color="#1DB954" thickness="4px" />
          <Text mt={4} color="#B3B3B3">Loading your aura...</Text>
        </VStack>
      </Center>
    );
  }

  return (
    <Flex
      bg="#000"
      color="#FFFFFF"
      minH="100vh"
      fontFamily="'Circular Std', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    >
      {/* Sidebar - Desktop */}
      {!isMobile && (
        <Box
          w="280px"
          bg="#000"
          borderRight="1px solid"
          borderColor="#282828"
          position="fixed"
          h="100vh"
          overflowY="auto"
        >
          <SidebarContent />
        </Box>
      )}

      {/* Mobile Sidebar */}
      {isMobile && (
        <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
          <DrawerOverlay />
          <DrawerContent bg="#000">
            <DrawerCloseButton />
            <DrawerHeader>
              <Heading size="md" color="#FFFFFF">Aurafy</Heading>
            </DrawerHeader>
            <DrawerBody p={0}>
              <SidebarContent onClose={onClose} />
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      )}

      {/* Main Content */}
      <Box
        flex={1}
        ml={{ md: '280px' }}
        overflowY="auto"
        p={{ base: 4, md: 8 }}
        pb={{ base: '80px', md: '40px' }}
      >
        {/* Header */}
        <Flex
          direction={{ base: 'column', md: 'row' }}
          justify="space-between"
          align={{ md: 'center' }}
          mb={8}
          gap={4}
        >
          <VStack align={{ base: 'center', md: 'start' }} spacing={1}>
            <Heading size={{ base: '2xl', md: '3xl' }} fontWeight="900" letterSpacing="-1px" color="#FFFFFF">
              Welcome back
            </Heading>
            <Text color="#B3B3B3" fontSize="lg">
              {user?.display_name}
            </Text>
          </VStack>

          <InputGroup maxW="400px">
            <InputLeftElement pointerEvents="none">
              <Icon as={FaSearch} color="#B3B3B3" />
            </InputLeftElement>
            <Input
              placeholder="Search playlists, tracks..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              bg="#181818"
              border="none"
              color="#FFFFFF"
              _placeholder={{ color: '#B3B3B3' }}
              borderRadius="full"
              _focus={{ boxShadow: '0 0 0 2px #1DB954' }}
            />
          </InputGroup>
        </Flex>

        {/* User Profile & Stats */}
        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6} mb={12}>
          <Fade in={true} transition={{ enter: { duration: 0.5 } }}>
            <UserProfileCard user={user} playlists={playlists} recentTracks={recentTracks} />
          </Fade>

          <Fade in={true} transition={{ enter: { duration: 0.5, delay: 0.1 } }}>
            <StatsCard playlists={playlists} recentTracks={recentTracks} />
          </Fade>
        </SimpleGrid>

        {/* Playlists Section */}
        <Box mb={12}>
          <Flex justify="space-between" align="center" mb={6}>
            <Heading size="xl" fontWeight="900" color="#FFFFFF">Your Playlists</Heading>
            <HStack spacing={2}>
              <Tooltip label="Grid view">
                <IconButton
                  icon={<FaTh />}
                  variant={playlistView === 'grid' ? 'solid' : 'ghost'}
                  colorScheme="green"
                  onClick={() => setPlaylistView('grid')}
                  aria-label="Grid"
                  color="#B3B3B3"
                  _hover={{ color: '#FFFFFF' }}
                />
              </Tooltip>
              <Tooltip label="List view">
                <IconButton
                  icon={<FaListUl />}
                  variant={playlistView === 'list' ? 'solid' : 'ghost'}
                  colorScheme="green"
                  onClick={() => setPlaylistView('list')}
                  aria-label="List"
                  color="#B3B3B3"
                  _hover={{ color: '#FFFFFF' }}
                />
              </Tooltip>
            </HStack>
          </Flex>

          {playlistView === 'grid' ? (
            <SimpleGrid columns={{ base: 2, sm: 3, md: 4, lg: 5, xl: 6 }} spacing={4}>
              {filteredPlaylists.map(p => (
                <PlaylistCard key={p.id} playlist={p} isListView={false} />
              ))}
            </SimpleGrid>
          ) : (
            <VStack spacing={2} align="stretch">
              {filteredPlaylists.map(p => (
                <PlaylistCard key={p.id} playlist={p} isListView={true} />
              ))}
            </VStack>
          )}
        </Box>

        {/* Recent Tracks */}
        <Box>
          <Flex justify="space-between" align="center" mb={6}>
            <Heading size="xl" fontWeight="900" color="#FFFFFF">Recently Played</Heading>
            <HStack spacing={2}>
              <Tooltip label="Grid view">
                <IconButton
                  icon={<FaTh />}
                  variant={trackView === 'grid' ? 'solid' : 'ghost'}
                  colorScheme="green"
                  onClick={() => setTrackView('grid')}
                  aria-label="Grid"
                  color="#B3B3B3"
                  _hover={{ color: '#FFFFFF' }}
                />
              </Tooltip>
              <Tooltip label="List view">
                <IconButton
                  icon={<FaListUl />}
                  variant={trackView === 'list' ? 'solid' : 'ghost'}
                  colorScheme="green"
                  onClick={() => setTrackView('list')}
                  aria-label="List"
                  color="#B3B3B3"
                  _hover={{ color: '#FFFFFF' }}
                />
              </Tooltip>
            </HStack>
          </Flex>

          {trackView === 'grid' ? (
            <SimpleGrid columns={{ base: 2, sm: 3, md: 4, lg: 5 }} spacing={4}>
              {filteredTracks.map((item, i) => (
                <TrackItem key={item.played_at} item={item} isListView={false} index={i} />
              ))}
            </SimpleGrid>
          ) : (
            <Table variant="unstyled">
              <Thead>
                <Tr color="#B3B3B3">
                  <Th>#</Th>
                  <Th>Title</Th>
                  <Th>Album</Th>
                  <Th>Duration</Th>
                  <Th></Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredTracks.map((item, i) => (
                  <TrackItem key={item.played_at} item={item} isListView={true} index={i} />
                ))}
              </Tbody>
            </Table>
          )}
        </Box>
      </Box>

      {/* Mobile Bottom Nav */}
      {isMobile && <BottomNavBar onMenuOpen={onOpen} />}
    </Flex>
  );
};

export default Dashboard;