import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Box,
  Heading,
  Grid,
  GridItem,
  Card,
  CardBody,
  Image,
  Text,
  VStack,
  Spinner,
  Center,
  Icon,
  Button,
  IconButton,
  HStack,
  Badge,
  Divider,
  keyframes,
  Flex,
  useBreakpointValue,
} from '@chakra-ui/react';
import {
  FaArrowLeft,
  FaPlay,
  FaMusic,
  FaFire,
  FaBolt,
  FaHeadphones,
  FaList,
} from 'react-icons/fa';
import { getPlaylists } from '../api';
import { useAuth } from '../App';
import logo from './aurafy.png';

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-8px); }
`;

const PlaylistCard = ({ playlist }) => {
  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <RouterLink to={`/analyze/playlist/${playlist.id}`} style={{ textDecoration: 'none' }}>
      <Card
        bg="rgba(18, 18, 18, 0.9)"
        borderRadius="2xl"
        overflow="hidden"
        border="1px solid rgba(255, 255, 255, 0.1)"
        backdropFilter="blur(20px)"
        transition="all 0.3s"
        _hover={{ 
          transform: 'translateY(-8px)', 
          boxShadow: '0 30px 60px rgba(29, 185, 84, 0.15)',
          borderColor: '#1DB954',
        }}
        role="group"
        height="100%"
      >
        <Box position="relative" height="200px" overflow="hidden">
          {playlist.images && playlist.images.length > 0 ? (
            <Image
              src={playlist.images[0]?.url}
              alt={playlist.name}
              width="100%"
              height="100%"
              objectFit="cover"
              transition="transform 0.5s"
              _groupHover={{ transform: 'scale(1.1)' }}
            />
          ) : (
            <Box
              width="100%"
              height="100%"
              bg="rgba(40, 40, 40, 0.5)"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Icon as={FaMusic} color="#1DB954" boxSize={16} opacity={0.5} />
            </Box>
          )}
          <Box
            position="absolute"
            top="0"
            left="0"
            right="0"
            bottom="0"
            bg="linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.8) 100%)"
            opacity={0.7}
            transition="opacity 0.3s"
            _groupHover={{ opacity: 0.9 }}
          />
          <Box
            position="absolute"
            bottom="4"
            left="4"
            right="4"
          >
            <Badge
              bg="rgba(29, 185, 84, 0.9)"
              color="black"
              fontSize="xs"
              px={3}
              py={1}
              borderRadius="full"
              fontWeight="bold"
              backdropFilter="blur(10px)"
            >
              {playlist.tracks?.total || 0} tracks
            </Badge>
          </Box>
          <Box
            position="absolute"
            top="50%"
            left="50%"
            transform="translate(-50%, -50%)"
            opacity={0}
            _groupHover={{ opacity: 1 }}
            transition="all 0.3s"
          >
            <IconButton
              aria-label={`Analyze ${playlist.name}`}
              icon={<FaPlay />}
              size="lg"
              bg="rgba(29, 185, 84, 0.9)"
              color="black"
              borderRadius="full"
              _hover={{ 
                bg: '#1DB954',
                transform: 'scale(1.1)',
                boxShadow: '0 0 30px rgba(29, 185, 84, 0.5)'
              }}
              transition="all 0.2s"
              backdropFilter="blur(10px)"
            />
          </Box>
        </Box>
        <CardBody p={5}>
          <VStack align="start" spacing={3}>
            <Text
              fontWeight="900"
              color="#FFFFFF"
              fontSize="lg"
              noOfLines={1}
              width="100%"
              letterSpacing="-0.5px"
            >
              {playlist.name || 'Unnamed Playlist'}
            </Text>
            <Text
              fontSize="sm"
              color="gray.300"
              noOfLines={2}
              width="100%"
              lineHeight="1.6"
            >
              {playlist.description || 'No description available'}
            </Text>
            <Divider borderColor="rgba(255, 255, 255, 0.1)" />
            <HStack spacing={2} flexWrap="wrap">
              <Badge
                bg="rgba(255, 255, 255, 0.1)"
                color="gray.300"
                fontSize="xs"
                px={3}
                py={1}
                borderRadius="full"
                fontWeight="medium"
                border="1px solid rgba(255, 255, 255, 0.1)"
              >
                By {playlist.owner?.display_name || 'Unknown'}
              </Badge>
              {playlist.public !== undefined && (
                <Badge
                  bg={playlist.public ? "rgba(29, 185, 84, 0.1)" : "rgba(102, 102, 102, 0.1)"}
                  color={playlist.public ? "#1DB954" : "#666"}
                  fontSize="xs"
                  px={3}
                  py={1}
                  borderRadius="full"
                  border={`1px solid ${playlist.public ? 'rgba(29, 185, 84, 0.3)' : 'rgba(102, 102, 102, 0.3)'}`}
                >
                  {playlist.public ? 'Public' : 'Private'}
                </Badge>
              )}
            </HStack>
          </VStack>
        </CardBody>
      </Card>
    </RouterLink>
  );
};

const PlaylistSelection = () => {
  const { token } = useAuth();
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const isMobile = useBreakpointValue({ base: true, md: false });

  useEffect(() => {
    const fetchPlaylists = async () => {
      if (!token) {
        setError("Please log in to view your playlists.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const res = await getPlaylists(token);
        
        if (res.data.items && res.data.items.length > 0) {
          setPlaylists(res.data.items);
        } else {
          setPlaylists([]);
        }

      } catch (err) {
        console.error('Failed to fetch playlists:', err);
        
        if (err.response?.status === 403) {
          const refreshToken = localStorage.getItem('refreshToken');
          if (refreshToken) {
            try {
              const refreshRes = await fetch(
                `http://localhost:8000/api/refresh_token?refresh_token=${refreshToken}`
              );
              
              if (refreshRes.ok) {
                const data = await refreshRes.json();
                const newToken = data.access_token;
                localStorage.setItem('token', newToken);
                
                const retryRes = await getPlaylists(newToken);
                setPlaylists(retryRes.data.items || []);
                return;
              }
            } catch (refreshErr) {
              console.error('Token refresh failed:', refreshErr);
            }
          }
          
          setError("Session expired. Please log in again.");
        } else {
          setError("Failed to load playlists. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylists();
  }, [token, navigate]);

  if (loading) {
    return (
      <Center minH="100vh" bg="#000">
        <VStack spacing={8}>
          <Box
            w="80px"
            h="80px"
            animation={`${float} 3s ease-in-out infinite`}
          >
            <Image
              src={logo}
              alt="Aurafy Logo"
              w="100%"
              h="100%"
              objectFit="contain"
              filter="drop-shadow(0 0 20px rgba(29,185,84,0.3))"
            />
          </Box>
          <VStack spacing={4}>
            <Spinner size="xl" color="#1DB954" thickness="4px" />
            <Heading
              size="lg"
              fontWeight="900"
              letterSpacing="-1px"
              bgGradient="linear(to-r, white, #1db954)"
              bgClip="text"
            >
              Loading Your Playlists
            </Heading>
            <Text color="gray.400" fontSize="md">
              Fetching your Spotify playlists...
            </Text>
          </VStack>
        </VStack>
      </Center>
    );
  }

  if (error) {
    return (
      <Center minH="100vh" bg="#000" p={6}>
        <VStack spacing={8} maxW="500px" textAlign="center">
          <Icon as={FaHeadphones} color="#1DB954" boxSize={12} />
          <Heading size="xl" fontWeight="900" color="white">
            Unable to Load Playlists
          </Heading>
          <Text color="gray.300" fontSize="lg">
            {error}
          </Text>
          <VStack spacing={4}>
            <Button
              as={RouterLink}
              to="/"
              leftIcon={<Icon as={FaArrowLeft} />}
              size="lg"
              bg="#1DB954"
              color="black"
              borderRadius="full"
              fontWeight="bold"
              px={8}
              _hover={{ bg: '#1ed760', transform: 'scale(1.05)' }}
              transition="all 0.3s"
            >
              Back to Dashboard
            </Button>
            <Button
              onClick={() => window.location.reload()}
              size="md"
              variant="outline"
              color="#1DB954"
              borderColor="#1DB954"
              borderRadius="full"
              _hover={{ bg: '#1DB954', color: 'black' }}
            >
              Try Again
            </Button>
          </VStack>
        </VStack>
      </Center>
    );
  }

  return (
    <Box
      bg="#000"
      minH="100vh"
      p={{ base: 4, md: 8 }}
      color="#FFFFFF"
      fontFamily="'Circular Std', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    >
      {/* Navigation */}
      <Flex justify="space-between" align="center" mb={{ base: 8, md: 12 }}>
        <Button
          as={RouterLink}
          to="/"
          leftIcon={<Icon as={FaArrowLeft} />}
          variant="ghost"
          color="#B3B3B3"
          _hover={{ color: '#1DB954', bg: 'rgba(29, 185, 84, 0.1)' }}
          size="lg"
        >
          Back to Dashboard
        </Button>
        
        {playlists.length > 0 && (
          <Badge
            bg="rgba(29, 185, 84, 0.1)"
            color="#1DB954"
            fontSize="md"
            px={6}
            py={3}
            borderRadius="full"
            border="1px solid rgba(29, 185, 84, 0.3)"
            fontWeight="bold"
          >
            {playlists.length} Playlist{playlists.length !== 1 ? 's' : ''}
          </Badge>
        )}
      </Flex>

      {/* Main Content */}
      <VStack spacing={{ base: 10, md: 12 }} maxW="1200px" mx="auto">
        <VStack spacing={4} textAlign="center">
          <Box
            w="60px"
            h="60px"
            animation={`${float} 4s ease-in-out infinite`}
          >
            <Image
              src={logo}
              alt="Aurafy Logo"
              w="100%"
              h="100%"
              objectFit="contain"
              filter="drop-shadow(0 0 20px rgba(29,185,84,0.3))"
            />
          </Box>
          <Heading
            size={{ base: '2xl', md: '3xl' }}
            fontWeight="900"
            letterSpacing="-1px"
            bgGradient="linear(to-r, white, #1db954)"
            bgClip="text"
          >
            Select a Playlist
          </Heading>
          <Text color="#B3B3B3" fontSize="lg">
            Choose a playlist to analyze its unique music aura
          </Text>
        </VStack>

        {playlists.length === 0 ? (
          <Card
            bg="rgba(18, 18, 18, 0.9)"
            borderRadius="2xl"
            border="1px solid rgba(255, 255, 255, 0.1)"
            backdropFilter="blur(20px)"
            boxShadow="0 20px 40px -12px rgba(0, 0, 0, 0.8)"
            w="full"
            maxW="600px"
            mx="auto"
          >
            <CardBody p={{ base: 8, md: 12 }}>
              <VStack spacing={6} textAlign="center">
                <Icon as={FaMusic} color="#1DB954" boxSize={16} />
                <Heading size="lg" color="white">
                  No Playlists Found
                </Heading>
                <Text color="gray.300" fontSize="md">
                  You don't have any playlists to analyze yet. Create some playlists on Spotify first!
                </Text>
                <VStack spacing={4} w="full" pt={4}>
                  <Button
                    as="a"
                    href="https://open.spotify.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    w="full"
                    size="lg"
                    bg="#1DB954"
                    color="black"
                    borderRadius="xl"
                    fontWeight="bold"
                    _hover={{ bg: '#1ed760', transform: 'scale(1.02)' }}
                    transition="all 0.3s"
                  >
                    Create Playlists on Spotify
                  </Button>
                  <Button
                    as={RouterLink}
                    to="/"
                    w="full"
                    size="md"
                    variant="outline"
                    color="#1DB954"
                    borderColor="#1DB954"
                    borderRadius="xl"
                    _hover={{ bg: '#1DB954', color: 'black' }}
                  >
                    Back to Dashboard
                  </Button>
                </VStack>
              </VStack>
            </CardBody>
          </Card>
        ) : (
          <>
            <Grid
              templateColumns={{
                base: '1fr',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)',
                lg: 'repeat(4, 1fr)',
                xl: 'repeat(5, 1fr)',
              }}
              gap={{ base: 6, md: 8 }}
              w="full"
            >
              {playlists.map(playlist => (
                <GridItem key={playlist.id}>
                  <PlaylistCard playlist={playlist} />
                </GridItem>
              ))}
            </Grid>

            <Card
              bg="rgba(18, 18, 18, 0.9)"
              borderRadius="2xl"
              border="1px solid rgba(255, 255, 255, 0.1)"
              backdropFilter="blur(20px)"
              w="full"
              maxW="800px"
              mx="auto"
            >
              <CardBody p={{ base: 6, md: 8 }}>
                <VStack spacing={4} align="center">
                  <HStack spacing={3}>
                    <Icon as={FaList} color="#1DB954" boxSize={6} />
                    <Text
                      fontSize="sm"
                      color="gray.400"
                      fontWeight="600"
                      letterSpacing="1px"
                      textTransform="uppercase"
                    >
                      About Playlist Analysis
                    </Text>
                  </HStack>
                  <Text color="gray.300" fontSize="md" textAlign="center">
                    Each playlist has a unique musical aura based on its tracks' audio features.
                    Select any playlist above to discover its vibe, energy, and character!
                  </Text>
                  <HStack spacing={3} pt={2}>
                    <Badge
                      bg="rgba(29, 185, 84, 0.1)"
                      color="#1DB954"
                      fontSize="xs"
                      px={4}
                      py={2}
                      borderRadius="full"
                      border="1px solid rgba(29, 185, 84, 0.3)"
                    >
                      Danceability
                    </Badge>
                    <Badge
                      bg="rgba(29, 185, 84, 0.1)"
                      color="#1DB954"
                      fontSize="xs"
                      px={4}
                      py={2}
                      borderRadius="full"
                      border="1px solid rgba(29, 185, 84, 0.3)"
                    >
                      Energy
                    </Badge>
                    <Badge
                      bg="rgba(29, 185, 84, 0.1)"
                      color="#1DB954"
                      fontSize="xs"
                      px={4}
                      py={2}
                      borderRadius="full"
                      border="1px solid rgba(29, 185, 84, 0.3)"
                    >
                      Positivity
                    </Badge>
                  </HStack>
                </VStack>
              </CardBody>
            </Card>
          </>
        )}
      </VStack>
    </Box>
  );
};

export default PlaylistSelection;