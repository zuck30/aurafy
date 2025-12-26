import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Box,
  Heading,
  SimpleGrid,
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
  useBreakpointValue,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react';
import { FaArrowLeft, FaPlay, FaMusic, FaExclamationTriangle } from 'react-icons/fa';
import { getPlaylists } from '../api';
import { useAuth } from '../App';

const PlaylistCard = ({ playlist }) => {
  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <RouterLink to={`/analyze/playlist/${playlist.id}`} style={{ textDecoration: 'none' }}>
      <Card
        bg="#121212"
        borderRadius="xl"
        overflow="hidden"
        border="1px solid #282828"
        transition="all 0.3s"
        _hover={{ 
          transform: 'translateY(-4px)', 
          boxShadow: '0 20px 40px rgba(29,185,84,0.15)',
          bg: '#181818'
        }}
        role="group"
      >
        <Box position="relative" height="200px" overflow="hidden">
          {playlist.images && playlist.images.length > 0 ? (
            <Image
              src={playlist.images[0]?.url}
              alt={playlist.name}
              width="100%"
              height="100%"
              objectFit="cover"
              transition="transform 0.3s"
              _groupHover={{ transform: 'scale(1.05)' }}
            />
          ) : (
            <Box
              width="100%"
              height="100%"
              bg="#282828"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Icon as={FaMusic} color="#1DB954" boxSize={12} />
            </Box>
          )}
          <Box
            position="absolute"
            top="0"
            left="0"
            right="0"
            bottom="0"
            bg="linear-gradient(to top, rgba(0,0,0,0.8), transparent 60%)"
            opacity={0}
            _groupHover={{ opacity: 1 }}
            transition="opacity 0.3s"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <IconButton
              aria-label={`Analyze ${playlist.name}`}
              icon={<FaPlay />}
              size="lg"
              colorScheme="green"
              bg="#1DB954"
              borderRadius="full"
              _hover={{ bg: '#1ed760', transform: 'scale(1.1)' }}
              transition="all 0.2s"
            />
          </Box>
        </Box>
        <CardBody p={4}>
          <VStack align="start" spacing={2}>
            <Text
              fontWeight="bold"
              color="#FFFFFF"
              fontSize="md"
              noOfLines={1}
              width="100%"
            >
              {playlist.name || 'Unnamed Playlist'}
            </Text>
            <Text
              fontSize="sm"
              color="#B3B3B3"
              noOfLines={2}
              width="100%"
            >
              {playlist.description || 'No description'}
            </Text>
            <HStack spacing={2} mt={1} flexWrap="wrap">
              <Badge
                bg="#1DB954"
                color="black"
                fontSize="xs"
                px={3}
                py={1}
                borderRadius="full"
                fontWeight="bold"
              >
                {playlist.tracks?.total || 0} tracks
              </Badge>
              <Badge
                bg="#282828"
                color="#B3B3B3"
                fontSize="xs"
                px={3}
                py={1}
                borderRadius="full"
              >
                By {playlist.owner?.display_name || 'Unknown'}
              </Badge>
              {playlist.public !== undefined && (
                <Badge
                  bg={playlist.public ? "#1DB954" : "#666"}
                  color="black"
                  fontSize="xs"
                  px={3}
                  py={1}
                  borderRadius="full"
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
  const { token, logout } = useAuth();
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const isMobile = useBreakpointValue({ base: true, md: false });

  useEffect(() => {
    console.log('🔍 PlaylistSelection mounted');
    console.log('Token from useAuth:', token ? `${token.substring(0, 20)}...` : 'No token');
  }, [token]);

  useEffect(() => {
    const fetchPlaylists = async () => {
      if (!token) {
        console.error('❌ No token available');
        setError("No authentication token found. Please login again.");
        setLoading(false);
        return;
      }

      console.log('🚀 Fetching playlists with token:', token.substring(0, 30) + '...');

      try {
        setLoading(true);
        setError(null);

        const res = await getPlaylists(token);
        console.log('✅ Playlists fetched successfully:', res.data.items?.length || 0, 'playlists');
        
        if (res.data.items && res.data.items.length > 0) {
          setPlaylists(res.data.items);
        } else {
          setPlaylists([]);
          setError({
            title: "No Playlists Found",
            message: "You don't have any playlists to analyze.",
            type: "info"
          });
        }

      } catch (err) {
        console.error('❌ Failed to fetch playlists:', err);
        
        if (err.response) {
          console.error('Response status:', err.response.status);
          console.error('Response data:', err.response.data);
          
          if (err.response.status === 403) {
            // Token expired - try to refresh
            const refreshToken = localStorage.getItem('refreshToken');
            if (refreshToken) {
              try {
                console.log('🔄 Attempting token refresh...');
                const refreshRes = await fetch(
                  `http://localhost:8000/api/refresh_token?refresh_token=${refreshToken}`
                );
                
                if (refreshRes.ok) {
                  const data = await refreshRes.json();
                  const newToken = data.access_token;
                  localStorage.setItem('token', newToken);
                  
                  // Retry fetching playlists
                  console.log('🔄 Retrying with new token...');
                  const retryRes = await getPlaylists(newToken);
                  setPlaylists(retryRes.data.items || []);
                  return;
                }
              } catch (refreshErr) {
                console.error('Token refresh failed:', refreshErr);
              }
            }
            
            setError({
              title: "Session Expired",
              message: "Your session has expired. Please log in again.",
              type: "error",
              retry: true
            });
          } else if (err.response.status === 401) {
            setError({
              title: "Unauthorized",
              message: "You don't have permission to access playlists.",
              type: "error"
            });
          } else {
            setError({
              title: `Error ${err.response.status}`,
              message: "Failed to load playlists. Please try again.",
              type: "error",
              details: err.response.data
            });
          }
        } else if (err.request) {
          setError({
            title: "Connection Error",
            message: "No response from server. Is the backend running?",
            type: "error"
          });
        } else {
          setError({
            title: "Request Error",
            message: err.message || "An unexpected error occurred.",
            type: "error"
          });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylists();
  }, [token, navigate]);

  const handleRetry = () => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken) {
      // Try to refresh token
      fetch(`http://localhost:8000/api/refresh_token?refresh_token=${refreshToken}`)
        .then(res => {
          if (res.ok) return res.json();
          throw new Error('Token refresh failed');
        })
        .then(data => {
          localStorage.setItem('token', data.access_token);
          window.location.reload();
        })
        .catch(() => {
          // If refresh fails, go to login
          logout();
          navigate('/login');
        });
    } else {
      // No refresh token, go to login
      logout();
      navigate('/login');
    }
  };

  if (loading) {
    return (
      <Center minH="100vh" bg="#000">
        <VStack spacing={6}>
          <Spinner size="xl" color="#1DB954" thickness="4px" />
          <Text color="#B3B3B3" fontSize={{ base: 'lg', md: 'xl' }} fontWeight="medium">
            Loading your playlists...
          </Text>
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
      <Button
        as={RouterLink}
        to="/"
        leftIcon={<Icon as={FaArrowLeft} />}
        mb={{ base: 6, md: 8 }}
        size="md"
        bg="#1DB954"
        color="black"
        borderRadius="full"
        fontWeight="bold"
        px={6}
        _hover={{
          bg: '#1ed760',
          transform: 'scale(1.05)',
        }}
        transition="all 0.3s"
      >
        Back to Dashboard
      </Button>

      <HStack spacing={4} mb={{ base: 6, md: 8 }} align="center">
        <Icon as={FaMusic} color="#1DB954" boxSize={8} />
        <Heading
          size={{ base: 'xl', md: '2xl' }}
          fontWeight="900"
          letterSpacing="-0.5px"
          color="#FFFFFF"
        >
          Choose a Playlist to Analyze
        </Heading>
      </HStack>

      {error ? (
        <Center minH="50vh">
          <VStack spacing={6} maxW="600px" textAlign="center">
            <Alert
              status={error.type === 'error' ? 'error' : 'info'}
              borderRadius="xl"
              bg="#121212"
              border="1px solid"
              borderColor={error.type === 'error' ? '#E53E3E' : '#3182CE'}
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              p={8}
            >
              <AlertIcon
                as={error.type === 'error' ? FaExclamationTriangle : FaMusic}
                boxSize={10}
                color={error.type === 'error' ? '#E53E3E' : '#3182CE'}
                mb={4}
              />
              <AlertTitle fontSize="xl" mb={2}>
                {error.title}
              </AlertTitle>
              <AlertDescription fontSize="md" color="#B3B3B3">
                {error.message}
              </AlertDescription>
              
              {error.details && (
                <Box 
                  mt={4} 
                  p={4} 
                  bg="#1a1a1a" 
                  borderRadius="md" 
                  width="100%"
                  maxH="200px"
                  overflowY="auto"
                >
                  <Text fontSize="sm" fontFamily="monospace" color="#B3B3B3">
                    {JSON.stringify(error.details, null, 2)}
                  </Text>
                </Box>
              )}
              
              <VStack spacing={4} mt={6}>
                {error.retry ? (
                  <>
                    <Button
                      onClick={handleRetry}
                      size="lg"
                      bg="#1DB954"
                      color="black"
                      borderRadius="full"
                      fontWeight="bold"
                      px={8}
                      _hover={{ bg: '#1ed760' }}
                    >
                      Log In Again
                    </Button>
                    <Button
                      onClick={() => navigate('/')}
                      size="md"
                      variant="outline"
                      color="#1DB954"
                      borderColor="#1DB954"
                      borderRadius="full"
                      _hover={{ bg: '#1DB954', color: 'black' }}
                    >
                      Back to Dashboard
                    </Button>
                  </>
                ) : (
                  <Button
                    onClick={() => navigate('/')}
                    size="lg"
                    bg="#1DB954"
                    color="black"
                    borderRadius="full"
                    fontWeight="bold"
                    px={8}
                    _hover={{ bg: '#1ed760' }}
                  >
                    Back to Dashboard
                  </Button>
                )}
                
                {error.type === 'info' && (
                  <Button
                    as="a"
                    href="https://open.spotify.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    size="md"
                    variant="outline"
                    color="#1DB954"
                    borderColor="#1DB954"
                    borderRadius="full"
                    _hover={{ bg: '#1DB954', color: 'black' }}
                  >
                    Create Playlists on Spotify
                  </Button>
                )}
              </VStack>
            </Alert>
          </VStack>
        </Center>
      ) : playlists.length === 0 ? (
        <Center minH="50vh">
          <VStack spacing={6} textAlign="center">
            <Icon as={FaMusic} color="#1DB954" boxSize={16} />
            <Heading size="lg" color="#FFFFFF">
              No Playlists Found
            </Heading>
            <Text color="#B3B3B3" fontSize="lg" maxW="500px">
              You don't have any playlists to analyze. Create some playlists on Spotify first!
            </Text>
            <HStack spacing={4} mt={4}>
              <Button
                as="a"
                href="https://open.spotify.com/"
                target="_blank"
                rel="noopener noreferrer"
                size="lg"
                bg="#1DB954"
                color="black"
                borderRadius="full"
                fontWeight="bold"
                px={8}
                _hover={{ bg: '#1ed760' }}
              >
                Go to Spotify
              </Button>
              <Button
                onClick={() => navigate('/')}
                size="lg"
                variant="outline"
                color="#1DB954"
                borderColor="#1DB954"
                borderRadius="full"
                _hover={{ bg: '#1DB954', color: 'black' }}
              >
                Back to Dashboard
              </Button>
            </HStack>
          </VStack>
        </Center>
      ) : (
        <>
          <Text color="#B3B3B3" fontSize="lg" mb={6}>
            Found {playlists.length} playlist{playlists.length !== 1 ? 's' : ''}
          </Text>
          
          <SimpleGrid
            columns={{ base: 1, sm: 2, md: 3, lg: 4, xl: 5 }}
            spacing={{ base: 4, md: 6 }}
          >
            {playlists.map(playlist => (
              <PlaylistCard key={playlist.id} playlist={playlist} />
            ))}
          </SimpleGrid>
          
          <Box mt={8} pt={6} borderTop="1px solid #282828">
            <Text color="#B3B3B3" fontSize="sm" textAlign="center">
              Note: Only playlists you own or have access to are shown here.
              Private playlists are marked with a gray badge.
            </Text>
          </Box>
        </>
      )}
    </Box>
  );
};

export default PlaylistSelection;