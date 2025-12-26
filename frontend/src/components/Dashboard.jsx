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
  Button,
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
  Grid,
  AspectRatio,
  useColorModeValue,
  Divider,
} from '@chakra-ui/react';
import { 
  FaHome, 
  FaPalette, 
  FaSignOutAlt,
  FaBars,
  FaList,
  FaPlay,
  FaSearch,
  FaTh,
  FaListUl,
  FaHeart,
  FaClock,
  FaSpotify,
  FaEllipsisH,
  FaHeadphones,
} from 'react-icons/fa';
import { getPlaylists, getRecentlyPlayed } from '../api';
import { useAuth } from '../App';
import BottomNavBar from './BottomNavBar';

const SidebarContent = ({ onClose, ...rest }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const bgColor = useColorModeValue('rgba(18, 18, 18, 0.98)', 'rgba(18, 18, 18, 0.98)');
  const borderColor = useColorModeValue('whiteAlpha.200', 'whiteAlpha.200');

  const navItems = [
    { name: 'Home', icon: FaHome, path: '/' },
    { name: 'Analyze Recent', icon: FaClock, path: '/analyze/recent' },
    { name: 'Analyze Playlist', icon: FaList, path: '/analyze/playlists' },
    { name: 'Liked Songs', icon: FaHeart, path: '/liked' },
  ];

  return (
    <Box
      bg={bgColor}
      borderRight="1px"
      borderRightColor={borderColor}
      w={{ base: 'full', md: '260px' }}
      pos="fixed"
      h="full"
      p="4"
      color="white"
      backdropFilter="blur(16px)"
      fontFamily="'Circular', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
      zIndex="10"
      {...rest}
    >
      <Flex h="16" alignItems="center" mx="4" justifyContent="space-between">
        <Flex align="center">
          <Icon as={FaSpotify} fontSize="2xl" color="#1DB954" mr="2" />
          <Text fontSize="xl" fontWeight="900" letterSpacing="-0.5px">
            Aurafy
          </Text>
        </Flex>
      </Flex>
      
      <VStack spacing="1" align="stretch" mt="8">
        {navItems.map((link) => (
          <NavItem key={link.name} icon={link.icon} path={link.path} isActive={location.pathname === link.path}>
            {link.name}
          </NavItem>
        ))}
      </VStack>
      
      <Box pos="absolute" bottom="6" w="calc(100% - 32px)">
        <Divider borderColor="whiteAlpha.200" mb="4" />
        <Flex align="center" mb="4">
          <Avatar size="sm" name={user?.display_name} src={user?.images?.[0]?.url} />
          <Box ml="3" flex="1" overflow="hidden">
            <Text fontSize="sm" fontWeight="700" noOfLines={1}>{user?.display_name}</Text>
            <Text fontSize="xs" color="gray.400" noOfLines={1}>{user?.email || 'Spotify User'}</Text>
          </Box>
          <Tooltip label="Logout">
            <IconButton
              size="sm"
              variant="ghost"
              colorScheme="whiteAlpha"
              icon={<FaSignOutAlt />}
              onClick={logout}
              _hover={{ bg: '#1db954', color: 'white' }}
            />
          </Tooltip>
        </Flex>
      </Box>
    </Box>
  );
};

const NavItem = ({ icon, children, path, isActive, ...rest }) => {
  return (
    <RouterLink to={path} style={{ textDecoration: 'none' }}>
      <Flex
        align="center"
        p="3"
        mx="2"
        borderRadius="lg"
        cursor="pointer"
        bg={isActive ? 'rgba(29, 185, 84, 0.2)' : 'transparent'}
        color={isActive ? '#1db954' : 'gray.300'}
        _hover={{
          bg: 'rgba(255, 255, 255, 0.1)',
          color: 'white',
        }}
        transition="all 0.2s ease"
        fontSize="md"
        fontWeight="600"
        {...rest}
      >
        {icon && (
          <Icon
            mr="4"
            fontSize="18"
            as={icon}
          />
        )}
        {children}
      </Flex>
    </RouterLink>
  );
};


const PlaylistCard = ({ playlist, viewMode }) => {
  const bgColor = useColorModeValue('rgba(40, 40, 40, 0.95)', 'rgba(40, 40, 40, 0.95)');
  const hoverBgColor = useColorModeValue('rgba(60, 60, 60, 0.95)', 'rgba(60, 60, 60, 0.95)');
  const borderColor = useColorModeValue('rgba(255,255,255,0.05)', 'rgba(255,255,255,0.05)');

  return (
    <RouterLink to={`/analyze/playlist/${playlist.id}`}>
      {viewMode === 'grid' ? (
        <Card
          bg={bgColor}
          borderRadius="xl"
          overflow="hidden"
          boxShadow="0 8px 32px rgba(0, 0, 0, 0.2)"
          border="1px solid"
          borderColor={borderColor}
          _hover={{
            transform: 'scale(1.03)',
            boxShadow: '0 12px 48px rgba(0, 0, 0, 0.3)',
            bg: hoverBgColor,
          }}
          transition="all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)"
          position="relative"
          role="group"
        >
          <Box position="relative" aspectRatio="1/1">
            <Image
              src={playlist.images[0]?.url || 'https://via.placeholder.com/300'}
              alt={playlist.name}
              objectFit="cover"
              w="full"
              h="full"
            />
            <Box
              position="absolute"
              top="0"
              left="0"
              right="0"
              bottom="0"
              bgGradient="linear(to-t, rgba(0,0,0,0.6), transparent)"
              opacity="0"
              _groupHover={{ opacity: 1 }}
              transition="opacity 0.2s ease"
              display="flex"
              alignItems="flex-end"
              justifyContent="flex-start"
              p="4"
            >
              <IconButton
                aria-label="Play playlist"
                icon={<FaPlay />}
                colorScheme="green"
                variant="solid"
                size="lg"
                borderRadius="full"
                bg="#1db954"
                _hover={{ bg: '#1ed760', transform: 'scale(1.1)' }}
                transition="all 0.2s ease"
              />
            </Box>
          </Box>
          <CardBody p="4">
            <VStack align="start" spacing="1">
              <Heading size="md" fontWeight="black" color="white" noOfLines={1}>
                {playlist.name}
              </Heading>
              <Text fontSize="sm" color="gray.300" noOfLines={1}>
                {playlist.description || 'No description'}
              </Text>
              <HStack spacing="2">
                <Badge colorScheme="green" variant="subtle">
                  {playlist.tracks.total} tracks
                </Badge>
                <Badge colorScheme="gray" variant="subtle">
                  By {playlist.owner.display_name}
                </Badge>
              </HStack>
            </VStack>
          </CardBody>
        </Card>
      ) : (
        <Flex
          align="center"
          p="4"
          bg={bgColor}
          borderRadius="xl"
          border="1px solid"
          borderColor={borderColor}
          _hover={{ bg: hoverBgColor, transform: 'translateX(4px)' }}
          transition="all 0.2s ease"
          boxShadow="0 4px 16px rgba(0, 0, 0, 0.1)"
        >
          <Image
            boxSize="64px"
            src={playlist.images[0]?.url || 'https://via.placeholder.com/64'}
            alt={playlist.name}
            mr="4"
            borderRadius="md"
          />
          <Box flex="1">
            <Text fontWeight="bold" color="white" fontSize="lg" noOfLines={1}>
              {playlist.name}
            </Text>
            <Text fontSize="sm" color="gray.300" noOfLines={1}>
              {playlist.description || 'No description'} • {playlist.tracks.total} tracks
            </Text>
            <Text fontSize="xs" color="gray.500">
              By {playlist.owner.display_name}
            </Text>
          </Box>
          <IconButton
            aria-label="Play playlist"
            icon={<FaPlay />}
            variant="ghost"
            color="gray.400"
            _hover={{ color: '#1db954' }}
          />
        </Flex>
      )}
    </RouterLink>
  );
};

const TrackItem = ({ item, viewMode, index }) => {
  const formatDuration = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const bgColor = useColorModeValue('rgba(40, 40, 40, 0.95)', 'rgba(40, 40, 40, 0.95)');
  const hoverBgColor = useColorModeValue('rgba(60, 60, 60, 0.95)', 'rgba(60, 60, 60, 0.95)');
  const borderColor = useColorModeValue('rgba(255,255,255,0.05)', 'rgba(255,255,255,0.05)');

  if (viewMode === 'list') {
    return (
      <Tr
        _hover={{ bg: hoverBgColor }}
        transition="all 0.2s ease"
      >
        <Td>{index + 1}</Td>
        <Td>
          <Flex align="center">
            <Image
              boxSize="40px"
              src={item.track.album.images[0]?.url}
              alt={item.track.name}
              mr="4"
              borderRadius="sm"
            />
            <Box>
              <Text fontWeight="bold" color="white">{item.track.name}</Text>
              <Text fontSize="sm" color="gray.300">{item.track.artists.map(a => a.name).join(', ')}</Text>
            </Box>
          </Flex>
        </Td>
        <Td color="gray.300">{item.track.album.name}</Td>
        <Td color="gray.300">
          <Flex align="center">
            <Icon as={FaClock} mr="2" />
            {formatDuration(item.track.duration_ms)}
          </Flex>
        </Td>
        <Td>
          <IconButton
            aria-label="Play track"
            icon={<FaPlay />}
            variant="ghost"
            color="gray.400"
            _hover={{ color: '#1db954' }}
          />
        </Td>
      </Tr>
    );
  }

  return (
    <Card
      bg={bgColor}
      borderRadius="xl"
      boxShadow="0 8px 32px rgba(0, 0, 0, 0.2)"
      border="1px solid"
      borderColor={borderColor}
      _hover={{
        transform: 'scale(1.03)',
        boxShadow: '0 12px 48px rgba(0, 0, 0, 0.3)',
      }}
      transition="all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)"
      role="group"
    >
      <Box position="relative" aspectRatio="1/1">
        <Image
          src={item.track.album.images[0]?.url || 'https://via.placeholder.com/300'}
          alt={item.track.name}
          objectFit="cover"
          w="full"
          h="full"
        />
        <Box
          position="absolute"
          top="0"
          left="0"
          right="0"
          bottom="0"
          bgGradient="linear(to-t, rgba(0,0,0,0.6), transparent)"
          opacity="0"
          _groupHover={{ opacity: 1 }}
          transition="opacity 0.2s ease"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <IconButton
            aria-label="Play track"
            icon={<FaPlay />}
            colorScheme="green"
            variant="solid"
            size="lg"
            borderRadius="full"
            bg="#1db954"
            _hover={{ bg: '#1ed760', transform: 'scale(1.1)' }}
            transition="all 0.2s ease"
          />
        </Box>
      </Box>
      <CardBody p="4">
        <VStack align="start" spacing="1">
          <Heading size="sm" fontWeight="bold" color="white" noOfLines={1}>
            {item.track.name}
          </Heading>
          <Text fontSize="sm" color="gray.300" noOfLines={1}>
            {item.track.artists.map(a => a.name).join(', ')}
          </Text>
          <HStack spacing="2">
            <Badge colorScheme="green" variant="subtle">
              {formatDuration(item.track.duration_ms)}
            </Badge>
          </HStack>
        </VStack>
      </CardBody>
    </Card>
  );
};

const UserProfileCard = ({ user }) => {
  const bgColor = useColorModeValue('linear-gradient(135deg, rgba(40,40,40,0.95), rgba(60,60,60,0.95))', 'linear-gradient(135deg, rgba(40,40,40,0.95), rgba(60,60,60,0.95))');
  const borderColor = useColorModeValue('rgba(255,255,255,0.05)', 'rgba(255,255,255,0.05)');

  return (
    <Card
      bg={bgColor}
      borderRadius="xl"
      boxShadow="0 8px 32px rgba(0,0,0,0.2)"
      border="1px solid"
      borderColor={borderColor}
      _hover={{ transform: 'scale(1.02)', boxShadow: '0 12px 48px rgba(0,0,0,0.3)' }}
      transition="all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)"
      h="100%"
    >
      <CardBody p="6">
        <Flex align="center" direction={{ base: 'column', md: 'row' }} gap="6">
          <Avatar size={{ base: 'xl', md: '2xl' }} name={user?.display_name} src={user?.images?.[0]?.url} border="2px solid #1db954" />
          <Box textAlign={{ base: 'center', md: 'left' }}>
            <Heading size="xl" fontWeight="black" letterSpacing="-1px" color="white">
              {user?.display_name}
            </Heading>
            <HStack mt="2" justify={{ base: 'center', md: 'start' }} spacing="4">
              <Flex align="center">
                <Icon as={FaHeadphones} color="#1db954" mr="2" />
                <Text fontSize="md" color="gray.300" fontWeight="bold">
                  {user?.followers?.total || 0} Followers
                </Text>
              </Flex>
            </HStack>
            <Text fontSize="sm" color="gray.400" mt="2">
              {user?.email || 'No email provided'}
            </Text>
          </Box>
        </Flex>
      </CardBody>
    </Card>
  );
};

const StatsCard = ({ playlists, recentTracks }) => {
  const bgColor = useColorModeValue('linear-gradient(135deg, rgba(40,40,40,0.95), rgba(60,60,60,0.95))', 'linear-gradient(135deg, rgba(40,40,40,0.95), rgba(60,60,60,0.95))');
  const borderColor = useColorModeValue('rgba(255,255,255,0.05)', 'rgba(255,255,255,0.05)');

  return (
    <Card
      bg={bgColor}
      borderRadius="xl"
      boxShadow="0 8px 32px rgba(0,0,0,0.2)"
      border="1px solid"
      borderColor={borderColor}
      _hover={{ transform: 'scale(1.02)', boxShadow: '0 12px 48px rgba(0,0,0,0.3)' }}
      transition="all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)"
      h="100%"
    >
      <CardBody p="6">
        <Heading size="xl" fontWeight="black" letterSpacing="-1px" mb="6" color="white">
          Music Stats
        </Heading>
        <VStack align="stretch" spacing="4">
          <Flex justify="space-between" align="center" p="4" bg="rgba(255,255,255,0.05)" borderRadius="md">
            <Text fontSize="lg" color="gray.200" fontWeight="bold">Playlists</Text>
            <Badge colorScheme="green" fontSize="lg" px="4" py="1" borderRadius="full">
              {playlists.length}
            </Badge>
          </Flex>
          <Flex justify="space-between" align="center" p="4" bg="rgba(255,255,255,0.05)" borderRadius="md">
            <Text fontSize="lg" color="gray.200" fontWeight="bold">Recent Tracks</Text>
            <Badge colorScheme="green" fontSize="lg" px="4" py="1" borderRadius="full">
              {recentTracks.length}
            </Badge>
          </Flex>
        </VStack>
      </CardBody>
    </Card>
  );
};

const Dashboard = () => {
  const { token, user, recentTracks, setRecentTracks, logout } = useAuth();
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [playlistViewMode, setPlaylistViewMode] = useState('grid');
  const [trackViewMode, setTrackViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const bgColor = useColorModeValue('rgba(18, 18, 18, 0.98)', 'rgba(18, 18, 18, 0.98)');
  const isMobile = useBreakpointValue({ base: true, md: false });

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
  }, [token, setRecentTracks]);

  const filteredPlaylists = useMemo(() => 
    playlists.filter(p =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description?.toLowerCase().includes(searchQuery.toLowerCase())
    ), [playlists, searchQuery]
  );

  const filteredRecentTracks = useMemo(() => 
    recentTracks.filter(item =>
      item.track.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.track.artists.some(artist => artist.name.toLowerCase().includes(searchQuery.toLowerCase()))
    ), [recentTracks, searchQuery]
  );

  if (loading) {
    return (
      <Center
        h="100vh"
        bg={bgColor}
        backdropFilter="blur(20px)"
        fontFamily="'Circular', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
      >
        <VStack spacing="4">
          <Spinner size="xl" color="#1db954" thickness="4px" speed="0.65s" />
          <Text color="white" fontWeight="bold" fontSize="lg">
            Work On Your Ideas..
          </Text>
        </VStack>
      </Center>
    );
  }

  return (
    <Box bg={bgColor} color="white" fontFamily="'Circular', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" minH="100vh">
      <SidebarContent display={{ base: 'none', md: 'block' }} />
      <BottomNavBar logout={logout} />

      <Box
        ml={{ base: 0, md: '260px' }}
        height="100vh"
        overflowY="auto"
        p={{ base: '4', md: '8' }}
        pb={{ base: '20', md: '8' }}
        maxW="container.xl"
        mx="auto"
        sx={{
          '&::-webkit-scrollbar': { width: '6px' },
          '&::-webkit-scrollbar-thumb': { 
            background: 'rgba(255, 255, 255, 0.2)', 
            borderRadius: '4px' 
          },
          '&::-webkit-scrollbar-thumb:hover': { 
            background: 'rgba(255, 255, 255, 0.3)' 
          },
        }}
      >
        <VStack spacing={{ base: '8', md: '12' }} align="stretch" mt={{ base: '4', md: '4' }}>
          <Flex direction={{ base: 'column', md: 'row' }} justify="space-between" align={{ base: 'stretch', md: 'center' }} mb="4">
            <VStack align={{ base: 'center', md: 'start' }} spacing="2">
              <Heading size={{ base: 'xl', md: '2xl' }} fontWeight="black" letterSpacing="-1px">
                Welcome back, {user?.display_name}
              </Heading>
              <Text fontSize="lg" color="gray.300" fontWeight="medium" textAlign={{ base: 'center', md: 'left' }}>
                Explore the <Text as="span" color="#1db954" fontWeight="bold">aura</Text> of your music world
              </Text>
            </VStack>
            <InputGroup maxW={{ base: 'full', md: 'sm' }} mt={{ base: '4', md: '0' }}>
              <InputLeftElement pointerEvents="none">
                <Icon as={FaSearch} color="gray.500" />
              </InputLeftElement>
              <Input
                placeholder="Search playlists, tracks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                bg="rgba(255, 255, 255, 0.08)"
                border="none"
                color="white"
                _placeholder={{ color: 'gray.500' }}
                borderRadius="full"
                _hover={{ bg: 'rgba(255, 255, 255, 0.12)' }}
                _focus={{ bg: 'rgba(255, 255, 255, 0.12)', boxShadow: '0 0 0 2px #1db954' }}
                transition="all 0.2s ease"
              />
            </InputGroup>
          </Flex>

          <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap="6" alignItems="stretch">
            <Fade in={true} transition={{ enter: { duration: 0.5 } }}>
              <UserProfileCard user={user} />
            </Fade>
            <Fade in={true} transition={{ enter: { duration: 0.5, delay: 0.1 } }}>
              <StatsCard playlists={playlists} recentTracks={recentTracks} />
            </Fade>
          </Grid>

          <Box>
            <Flex justify="space-between" align="center" mb="4">
              <Heading size="lg" fontWeight="black" letterSpacing="-0.5px">
                Your Playlists
              </Heading>
              <HStack spacing="2">
                <Tooltip label="Grid View" hasArrow>
                  <IconButton
                    aria-label="Grid view"
                    icon={<FaTh />}
                    variant={playlistViewMode === 'grid' ? 'solid' : 'ghost'}
                    colorScheme="green"
                    size="md"
                    onClick={() => setPlaylistViewMode('grid')}
                    bg={playlistViewMode === 'grid' ? '#1db954' : 'transparent'}
                    _hover={{ bg: '#1ed760', color: 'white' }}
                  />
                </Tooltip>
                <Tooltip label="List View" hasArrow>
                  <IconButton
                    aria-label="List view"
                    icon={<FaListUl />}
                    variant={playlistViewMode === 'list' ? 'solid' : 'ghost'}
                    colorScheme="green"
                    size="md"
                    onClick={() => setPlaylistViewMode('list')}
                    bg={playlistViewMode === 'list' ? '#1db954' : 'transparent'}
                    _hover={{ bg: '#1ed760', color: 'white' }}
                  />
                </Tooltip>
              </HStack>
            </Flex>
            <Fade in={true} transition={{ enter: { duration: 0.5 } }}>
              {playlistViewMode === 'grid' ? (
                <SimpleGrid
                  columns={{ base: 2, sm: 3, md: 4, lg: 5, xl: 6 }}
                  spacing="4"
                >
                  {filteredPlaylists.map(p => (
                    <PlaylistCard key={p.id} playlist={p} viewMode={playlistViewMode} />
                  ))}
                </SimpleGrid>
              ) : (
                <VStack spacing="2" align="stretch">
                  {filteredPlaylists.map(p => (
                    <PlaylistCard key={p.id} playlist={p} viewMode={playlistViewMode} />
                  ))}
                </VStack>
              )}
            </Fade>
          </Box>

          <Box>
            <Flex justify="space-between" align="center" mb="4">
              <Heading size="lg" fontWeight="black" letterSpacing="-0.5px">
                Recently Played
              </Heading>
              <HStack spacing="2">
                <Tooltip label="Grid View" hasArrow>
                  <IconButton
                    aria-label="Grid view"
                    icon={<FaTh />}
                    variant={trackViewMode === 'grid' ? 'solid' : 'ghost'}
                    colorScheme="green"
                    size="md"
                    mr={2}
                    onClick={() => setTrackViewMode('grid')}
                    bg={trackViewMode === 'grid' ? '#1db954' : 'transparent'}
                    _hover={{ bg: '#1ed760', color: 'white' }}
                  />
                </Tooltip>
                <Tooltip label="List View" hasArrow>
                  <IconButton
                    aria-label="List view"
                    icon={<FaListUl />}
                    variant={trackViewMode === 'list' ? 'solid' : 'ghost'}
                    colorScheme="green"
                    size="md"
                    onClick={() => setTrackViewMode('list')}
                    bg={trackViewMode === 'list' ? '#1db954' : 'transparent'}
                    _hover={{ bg: '#1ed760', color: 'white' }}
                  />
                </Tooltip>
              </HStack>
            </Flex>
            <Fade in={true} transition={{ enter: { duration: 0.5 } }}>
              {trackViewMode === 'grid' ? (
                <SimpleGrid
                  columns={{ base: 2, sm: 3, md: 4, lg: 5 }}
                  spacing="4"
                >
                  {filteredRecentTracks.map((item, index) => (
                    <TrackItem key={item.played_at} item={item} viewMode={trackViewMode} index={index} />
                  ))}
                </SimpleGrid>
              ) : (
                <Table variant="unstyled" size="md">
                  <Thead>
                    <Tr color="gray.500">
                      <Th>#</Th>
                      <Th>Title</Th>
                      <Th>Album</Th>
                      <Th>Duration</Th>
                      <Th></Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {filteredRecentTracks.map((item, index) => (
                      <TrackItem key={item.played_at} item={item} viewMode={trackViewMode} index={index} />
                    ))}
                  </Tbody>
                </Table>
              )}
            </Fade>
          </Box>
        </VStack>
      </Box>
    </Box>
  );
};

export default Dashboard;