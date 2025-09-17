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
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  Badge,
  Tooltip,
  Fade,
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
      bg="rgba(18, 18, 18, 0.95)"
      borderRight="1px"
      borderRightColor="whiteAlpha.200"
      w={{ base: 'full', md: '240px' }}
      pos="fixed"
      h="full"
      p="4"
      color="white"
      backdropFilter="blur(12px)"
      fontFamily="'Circular', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
      {...rest}
    >
      <Flex h="16" alignItems="center" mx="4" justifyContent="space-between">
        <Text fontSize="xl" fontWeight="900" letterSpacing="-0.5px">
          Aurafy
        </Text>
        <IconButton
          display={{ base: 'flex', md: 'none' }}
          onClick={onClose}
          variant="ghost"
          colorScheme="whiteAlpha"
          aria-label="close menu"
          icon={<FaPalette />}
        />
      </Flex>
      {navItems.map((link) => (
        <NavItem key={link.name} icon={link.icon} path={link.path} isActive={location.pathname === link.path}>
          {link.name}
        </NavItem>
      ))}
      <VStack pos="absolute" bottom="6" w="full" spacing="4" px="4">
        <Flex align="center">
          <Avatar size="sm" name={user?.display_name} src={user?.images?.[0]?.url} />
          <Text ml="3" fontSize="sm" fontWeight="700" noOfLines={1}>{user?.display_name}</Text>
        </Flex>
        <Button
          w="full"
          size="md"
          variant="ghost"
          colorScheme="whiteAlpha"
          leftIcon={<FaSignOutAlt />}
          onClick={logout}
          fontWeight="700"
          _hover={{ bg: '#1db954', color: 'white', transform: 'translateY(-2px)' }}
          _active={{ transform: 'translateY(0)' }}
          transition="all 0.3s ease"
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
        p="3"
        mx="2"
        borderRadius="md"
        cursor="pointer"
        bg={isActive ? '#1db954' : 'transparent'}
        color={isActive ? 'white' : 'gray.300'}
        _hover={{
          bg: '#1db954',
          color: 'white',
        }}
        transition="all 0.2s"
        fontSize="sm"
        fontWeight="700"
        letterSpacing="0.5px"
        {...rest}
      >
        {icon && (
          <Icon
            mr="3"
            fontSize="18"
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
      ml={{ base: 0, md: '240px' }}
      px={{ base: 4, md: 6 }}
      height="16"
      alignItems="center"
      bg="rgba(18, 18, 18, 0.95)"
      borderBottomWidth="1px"
      borderBottomColor="whiteAlpha.200"
      backdropFilter="blur(12px)"
      justifyContent="space-between"
      color="white"
      fontFamily="'Circular', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
      {...rest}
    >
      <IconButton
        variant="ghost"
        colorScheme="whiteAlpha"
        onClick={onOpen}
        aria-label="open menu"
        icon={<FaBars />}
      />
      <Text fontSize="lg" fontWeight="900" letterSpacing="-0.5px">
        Dashboard
      </Text>
      <Avatar size="sm" name={user?.display_name} src={user?.images?.[0]?.url} />
    </Flex>
  );
};

const PlaylistCard = ({ playlist, viewMode }) => (
  <RouterLink to={`/analyze/playlist/${playlist.id}`}>
    {viewMode === 'grid' ? (
      <Card
        bg="rgba(40, 40, 40, 0.9)"
        borderRadius="lg"
        overflow="hidden"
        boxShadow="0 4px 15px rgba(0, 0, 0, 0.3)"
        border="1px solid"
        borderColor="whiteAlpha.200"
        _hover={{
          transform: 'translateY(-4px)',
          boxShadow: '0 6px 20px rgba(0, 0, 0, 0.4)',
          bg: 'rgba(60, 60, 60, 0.9)',
        }}
        transition="all 0.3s ease"
        position="relative"
        _before={{
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '2px',
          bgGradient: 'linear(to-r, transparent, #1db954, transparent)',
        }}
      >
        <Box position="relative">
          <Image
            src={playlist.images[0]?.url || 'https://via.placeholder.com/150'}
            alt={playlist.name}
            borderRadius="lg"
            objectFit="cover"
            w="full"
            h={{ base: '140px', md: '180px' }}
          />
          <Box
            position="absolute"
            top="0"
            left="0"
            right="0"
            bottom="0"
            bg="rgba(0, 0, 0, 0.5)"
            opacity="0"
            _hover={{ opacity: 1 }}
            transition="opacity 0.2s"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <IconButton
              aria-label="Play playlist"
              icon={<FaPlay />}
              colorScheme="green"
              variant="solid"
              size="md"
              borderRadius="full"
              bg="#1db954"
              _hover={{ bg: '#1ed760', transform: 'translateY(-2px)' }}
              _active={{ transform: 'translateY(0)' }}
            />
          </Box>
        </Box>
        <CardBody p={{ base: 3, md: 4 }}>
          <VStack align="start" spacing="2">
            <Heading
              size="sm"
              fontWeight="900"
              color="white"
              noOfLines={1}
              fontFamily="'Circular', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
            >
              {playlist.name}
            </Heading>
            <Text
              fontSize={{ base: 'xs', md: 'sm' }}
              color="gray.300"
              noOfLines={2}
              fontFamily="'Circular', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
            >
              {playlist.description || 'No description available'}
            </Text>
            <Text
              fontSize="xs"
              color="gray.400"
              fontWeight="700"
            >
              {playlist.tracks.total} tracks
            </Text>
          </VStack>
        </CardBody>
      </Card>
    ) : (
      <Flex
        align="center"
        p={{ base: 2, md: 3 }}
        bg="rgba(40, 40, 40, 0.9)"
        borderRadius="md"
        border="1px solid"
        borderColor="whiteAlpha.200"
        _hover={{ bg: 'rgba(60, 60, 60, 0.9)', transform: 'translateY(-2px)' }}
        transition="all 0.2s"
        boxShadow="0 4px 10px rgba(0, 0, 0, 0.2)"
      >
        <Image
          boxSize={{ base: '40px', md: '48px' }}
          src={playlist.images[0]?.url || 'https://via.placeholder.com/48'}
          alt={playlist.name}
          mr={{ base: 3, md: 4 }}
          borderRadius="sm"
        />
        <Box flex="1">
          <Text
            fontWeight="700"
            color="white"
            noOfLines={1}
            fontSize={{ base: 'sm', md: 'md' }}
            fontFamily="'Circular', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
          >
            {playlist.name}
          </Text>
          <Text
            fontSize={{ base: 'xs', md: 'sm' }}
            color="gray.400"
            noOfLines={1}
            fontFamily="'Circular', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
          >
            {playlist.description || 'No description available'}
          </Text>
        </Box>
        <Text
          fontSize="xs"
          color="gray.400"
          fontWeight="700"
          mr={{ base: 2, md: 3 }}
        >
          {playlist.tracks.total} tracks
        </Text>
      </Flex>
    )}
  </RouterLink>
);

const TrackItem = ({ item, viewMode }) => (
  viewMode === 'grid' ? (
    <Card
      bg="rgba(40, 40, 40, 0.9)"
      borderRadius="md"
      boxShadow="0 4px 10px rgba(0, 0, 0, 0.2)"
      border="1px solid"
      borderColor="whiteAlpha.200"
      _hover={{ bg: 'rgba(60, 60, 60, 0.9)', transform: 'translateY(-2px)' }}
      transition="all 0.2s"
    >
      <CardBody p={{ base: 2, md: 3 }}>
        <Flex align="center">
          <Image
            boxSize={{ base: '40px', md: '48px' }}
            src={item.track.album.images[0]?.url || 'https://via.placeholder.com/48'}
            alt={item.track.name}
            mr={{ base: 3, md: 4 }}
            borderRadius="sm"
          />
          <Box flex="1">
            <Text
              fontWeight="700"
              color="white"
              noOfLines={1}
              fontSize={{ base: 'sm', md: 'md' }}
              fontFamily="'Circular', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
            >
              {item.track.name}
            </Text>
            <Text
              fontSize={{ base: 'xs', md: 'sm' }}
              color="gray.400"
              fontFamily="'Circular', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
            >
              {item.track.artists.map(artist => artist.name).join(', ')}
            </Text>
          </Box>
        </Flex>
      </CardBody>
    </Card>
  ) : (
    <Flex
      align="center"
      p={{ base: 2, md: 3 }}
      bg="rgba(40, 40, 40, 0.9)"
      borderRadius="md"
      border="1px solid"
      borderColor="whiteAlpha.200"
      _hover={{ bg: 'rgba(60, 60, 60, 0.9)', transform: 'translateY(-2px)' }}
      transition="all 0.2s"
      boxShadow="0 4px 10px rgba(0, 0, 0, 0.2)"
    >
      <Image
        boxSize={{ base: '40px', md: '48px' }}
        src={item.track.album.images[0]?.url || 'https://via.placeholder.com/48'}
        alt={item.track.name}
        mr={{ base: 3, md: 4 }}
        borderRadius="sm"
      />
      <Box flex="1">
        <Text
          fontWeight="700"
          color="white"
          noOfLines={1}
          fontSize={{ base: 'sm', md: 'md' }}
          fontFamily="'Circular', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
        >
          {item.track.name}
        </Text>
        <Text
          fontSize={{ base: 'xs', md: 'sm' }}
          color="gray.400"
          fontFamily="'Circular', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
        >
          {item.track.artists.map(artist => artist.name).join(', ')}
        </Text>
      </Box>
    </Flex>
  )
);

const UserProfileCard = ({ user }) => (
  <Card
    bg="rgba(40, 40, 40, 0.9)"
    borderRadius="lg"
    boxShadow="0 4px 15px rgba(0, 0, 0, 0.3)"
    border="1px solid"
    borderColor="whiteAlpha.200"
    _hover={{ transform: 'translateY(-4px)', boxShadow: '0 6px 20px rgba(0, 0, 0, 0.4)' }}
    transition="all 0.3s ease"
    _before={{
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '2px',
      bgGradient: 'linear(to-r, transparent, #1db954, transparent)',
    }}
  >
    <CardBody p={{ base: 4, md: 6 }}>
      <Flex align="center" direction={{ base: 'column', sm: 'row' }} gap={{ base: 4, sm: 6 }}>
        <Avatar size={{ base: 'lg', md: 'xl' }} name={user?.display_name} src={user?.images?.[0]?.url} />
        <Box textAlign={{ base: 'center', sm: 'left' }}>
          <Heading
            size={{ base: 'md', md: 'lg' }}
            fontWeight="900"
            letterSpacing="-0.5px"
            color="white"
          >
            {user?.display_name}
          </Heading>
          <Text
            fontSize={{ base: 'sm', md: 'md' }}
            color="gray.300"
            mt={2}
            fontWeight="700"
          >
            {user?.followers?.total || 0} Followers
          </Text>
          <Text
            fontSize={{ base: 'xs', md: 'sm' }}
            color="gray.400"
            mt={1}
          >
            {user?.email || 'No email provided'}
          </Text>
        </Box>
      </Flex>
    </CardBody>
  </Card>
);

const StatsCard = ({ playlists, recentTracks }) => (
  <Card
    bg="rgba(40, 40, 40, 0.9)"
    borderRadius="lg"
    boxShadow="0 4px 15px rgba(0, 0, 0, 0.3)"
    border="1px solid"
    borderColor="whiteAlpha.200"
    _hover={{ transform: 'translateY(-4px)', boxShadow: '0 6px 20px rgba(0, 0, 0, 0.4)' }}
    transition="all 0.3s ease"
    _before={{
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '2px',
      bgGradient: 'linear(to-r, transparent, #1db954, transparent)',
    }}
  >
    <CardBody p={{ base: 4, md: 6 }}>
      <Heading
        size={{ base: 'md', md: 'lg' }}
        fontWeight="900"
        letterSpacing="-0.5px"
        mb={4}
        color="white"
      >
        Your Music Stats
      </Heading>
      <VStack align="stretch" spacing={3}>
        <Flex justify="space-between" align="center">
          <Text fontSize={{ base: 'sm', md: 'md' }} color="gray.300" fontWeight="700">
            Playlists
          </Text>
          <Badge colorScheme="green" fontSize={{ base: 'sm', md: 'md' }} px={3} py={1}>
            {playlists.length}
          </Badge>
        </Flex>
        <Flex justify="space-between" align="center">
          <Text fontSize={{ base: 'sm', md: 'md' }} color="gray.300" fontWeight="700">
            Recent Tracks
          </Text>
          <Badge colorScheme="green" fontSize={{ base: 'sm', md: 'md' }} px={3} py={1}>
            {recentTracks.length}
          </Badge>
        </Flex>
      </VStack>
    </CardBody>
  </Card>
);

const Dashboard = () => {
  const { token, user, recentTracks, setRecentTracks } = useAuth();
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [viewMode, setViewMode] = useState('grid'); // State for grid/list view
  const [searchQuery, setSearchQuery] = useState('');

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

  // Filter playlists and tracks based on search query
  const filteredPlaylists = playlists.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredRecentTracks = recentTracks.filter(item =>
    item.track.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.track.artists.some(artist => artist.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (loading) {
    return (
      <Center
        h="100vh"
        bg="rgba(18, 18, 18, 0.95)"
        backdropFilter="blur(12px)"
        fontFamily="'Circular', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
      >
        <VStack spacing={4}>
          <Spinner size="xl" color="#1db954" />
          <Text color="white" fontWeight="700" fontSize={{ base: 'md', md: 'lg' }}>
            Loading your music...
          </Text>
        </VStack>
      </Center>
    );
  }

  return (
    <Box
      minH="100vh"
      bg="rgba(18, 18, 18, 0.95)"
      color="white"
      fontFamily="'Circular', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
      backdropFilter="blur(12px)"
    >
      <SidebarContent onClose={onClose} display={{ base: 'none', md: 'block' }} />
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

      <Box
        ml={{ base: 0, md: '240px' }}
        p={{ base: 4, md: 6 }}
        maxW="1400px"
        mx="auto"
      >
        <Flex direction={{ base: 'column', md: 'row' }} justify="space-between" align={{ base: 'stretch', md: 'center' }} mb={{ base: 6, md: 8 }}>
          <VStack align="start" spacing={2}>
            <Heading
              size={{ base: 'lg', md: 'xl' }}
              fontWeight="900"
              letterSpacing="-0.5px"
            >
              Welcome, {user?.display_name}
            </Heading>
            <Text
              fontSize={{ base: 'md', md: 'lg' }}
              color="gray.300"
              fontWeight="700"
            >
              Discover the <Text as="span" color="#1ed760">aura</Text> of your Spotify playlists
            </Text>
          </VStack>
          <InputGroup maxW={{ base: 'full', md: '300px' }} mt={{ base: 4, md: 0 }}>
            <InputLeftElement pointerEvents="none">
              <Icon as={FaSearch} color="gray.400" />
            </InputLeftElement>
            <Input
              placeholder="Search playlists or tracks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              bg="rgba(255, 255, 255, 0.1)"
              border="1px solid"
              borderColor="whiteAlpha.200"
              color="white"
              _placeholder={{ color: 'gray.400' }}
              borderRadius="full"
              _hover={{ borderColor: '#1db954' }}
              _focus={{ borderColor: '#1db954', boxShadow: '0 0 0 1px #1db954' }}
            />
          </InputGroup>
        </Flex>

        <VStack spacing={{ base: 8, md: 12 }} align="stretch">
          {/* User Profile and Stats Widgets */}
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={{ base: 4, md: 6 }}>
            <Fade in={true}>
              <UserProfileCard user={user} />
            </Fade>
            <Fade in={true}>
              <StatsCard playlists={playlists} recentTracks={recentTracks} />
            </Fade>
          </SimpleGrid>

          {/* Playlists Section */}
          <Box>
            <Flex justify="space-between" align="center" mb={4}>
              <Heading
                size="md"
                fontWeight="900"
                letterSpacing="-0.5px"
              >
                Your Playlists
              </Heading>
              <Flex>
                <Tooltip label="Grid View" placement="top">
                  <IconButton
                    aria-label="Grid view"
                    icon={<FaTh />}
                    variant={viewMode === 'grid' ? 'solid' : 'ghost'}
                    colorScheme="green"
                    size="sm"
                    mr={2}
                    onClick={() => setViewMode('grid')}
                    bg={viewMode === 'grid' ? '#1db954' : 'transparent'}
                    _hover={{ bg: '#1ed760' }}
                  />
                </Tooltip>
                <Tooltip label="List View" placement="top">
                  <IconButton
                    aria-label="List view"
                    icon={<FaListUl />}
                    variant={viewMode === 'list' ? 'solid' : 'ghost'}
                    colorScheme="green"
                    size="sm"
                    onClick={() => setViewMode('list')}
                    bg={viewMode === 'list' ? '#1db954' : 'transparent'}
                    _hover={{ bg: '#1ed760' }}
                  />
                </Tooltip>
              </Flex>
            </Flex>
            <Fade in={true}>
              {viewMode === 'grid' ? (
                <SimpleGrid
                  columns={{ base: 1, sm: 2, md: 3, lg: 4, xl: 5 }}
                  spacing={{ base: 3, md: 4 }}
                  overflowX="auto"
                  sx={{
                    '&::-webkit-scrollbar': { height: '6px' },
                    '&::-webkit-scrollbar-thumb': { bg: 'gray.700', borderRadius: 'full' },
                    '&::-webkit-scrollbar-track': { bg: 'transparent' },
                  }}
                >
                  {filteredPlaylists.map(p => (
                    <PlaylistCard key={p.id} playlist={p} viewMode={viewMode} />
                  ))}
                </SimpleGrid>
              ) : (
                <VStack spacing={3} align="stretch">
                  {filteredPlaylists.map(p => (
                    <PlaylistCard key={p.id} playlist={p} viewMode={viewMode} />
                  ))}
                </VStack>
              )}
            </Fade>
          </Box>

          {/* Recently Played Section */}
          <Box>
            <Flex justify="space-between" align="center" mb={4}>
              <Heading
                size="md"
                fontWeight="900"
                letterSpacing="-0.5px"
              >
                Recently Played
              </Heading>
              <Flex>
                <Tooltip label="Grid View" placement="top">
                  <IconButton
                    aria-label="Grid view"
                    icon={<FaTh />}
                    variant={viewMode === 'grid' ? 'solid' : 'ghost'}
                    colorScheme="green"
                    size="sm"
                    mr={2}
                    onClick={() => setViewMode('grid')}
                    bg={viewMode === 'grid' ? '#1db954' : 'transparent'}
                    _hover={{ bg: '#1ed760' }}
                  />
                </Tooltip>
                <Tooltip label="List View" placement="top">
                  <IconButton
                    aria-label="List view"
                    icon={<FaListUl />}
                    variant={viewMode === 'list' ? 'solid' : 'ghost'}
                    colorScheme="green"
                    size="sm"
                    onClick={() => setViewMode('list')}
                    bg={viewMode === 'list' ? '#1db954' : 'transparent'}
                    _hover={{ bg: '#1ed760' }}
                  />
                </Tooltip>
              </Flex>
            </Flex>
            <Fade in={true}>
              {viewMode === 'grid' ? (
                <SimpleGrid
                  columns={{ base: 1, sm: 2, md: 3, lg: 4 }}
                  spacing={{ base: 3, md: 4 }}
                  overflowX="auto"
                  sx={{
                    '&::-webkit-scrollbar': { height: '6px' },
                    '&::-webkit-scrollbar-thumb': { bg: 'gray.700', borderRadius: 'full' },
                    '&::-webkit-scrollbar-track': { bg: 'transparent' },
                  }}
                >
                  {filteredRecentTracks.slice(0, 8).map(item => (
                    <TrackItem key={item.played_at} item={item} viewMode={viewMode} />
                  ))}
                </SimpleGrid>
              ) : (
                <VStack spacing={3} align="stretch">
                  {filteredRecentTracks.slice(0, 8).map(item => (
                    <TrackItem key={item.played_at} item={item} viewMode={viewMode} />
                  ))}
                </VStack>
              )}
            </Fade>
          </Box>
        </VStack>
      </Box>
    </Box>
  );
};

export default Dashboard;