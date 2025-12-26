import React, { useState, useEffect } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Flex,
  Heading,
  Text,
  Spinner,
  Center,
  VStack,
  Card,
  CardBody,
  Image,
  Progress,
  Button,
  Icon,
  HStack,
  Badge,
  useBreakpointValue,
} from '@chakra-ui/react';
import { FaArrowLeft, FaMusic } from 'react-icons/fa';
import { analyzePlaylist } from '../api';
import { useAuth } from '../App';

const FeatureProgress = ({ label, value }) => (
  <Box>
    <HStack justify="space-between" mb={2}>
      <Text
        textTransform="capitalize"
        fontWeight="500"
        color="#FFFFFF"
        fontSize={{ base: 'sm', md: 'md' }}
      >
        {label}
      </Text>
      <Badge
        bg="#1DB954"
        color="black"
        fontSize={{ base: 'xs', md: 'sm' }}
        px={3}
        py={1}
        borderRadius="full"
        fontWeight="bold"
      >
        {(value * 100).toFixed(0)}%
      </Badge>
    </HStack>
    <Progress
      value={value * 100}
      colorScheme="green"
      size="md"
      borderRadius="full"
      bg="#282828"
      sx={{
        '& > div': {
          bg: '#1DB954',
          transition: 'width 1s ease',
          boxShadow: '0 0 15px rgba(29,185,84,0.4)',
        },
      }}
    />
  </Box>
);

const PlaylistAnalysis = () => {
  const { id } = useParams();
  const { token, logout } = useAuth();
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isMobile = useBreakpointValue({ base: true, md: false });

  useEffect(() => {
    console.log('🔍 PlaylistAnalysis mounted');
    console.log('Playlist ID:', id);
    console.log('Token from useAuth:', token ? `${token.substring(0, 20)}...` : 'No token');
  }, [id, token]);

  useEffect(() => {
    const fetchAnalysis = async () => {
      if (!token) {
        console.error('❌ No token available');
        setError("No authentication token found. Please login again.");
        setLoading(false);
        return;
      }

      if (!id) {
        console.error('❌ No playlist ID provided');
        setError("No playlist ID provided.");
        setLoading(false);
        return;
      }

      console.log('🚀 Starting playlist analysis for ID:', id);
      console.log('Using token:', token.substring(0, 30) + '...');

      try {
        setLoading(true);
        setError(null);

        const res = await analyzePlaylist(token, id);
        console.log('✅ Playlist analysis successful:', res.data);
        setAnalysis(res.data);

      } catch (err) {
        console.error('❌ Playlist analysis failed:', err);
        
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
                  
                  // Retry the analysis
                  console.log('🔄 Retrying analysis with new token...');
                  const retryRes = await analyzePlaylist(newToken, id);
                  setAnalysis(retryRes.data);
                  return;
                }
              } catch (refreshErr) {
                console.error('Token refresh failed:', refreshErr);
              }
            }
            
            setError({
              title: "Session Expired",
              message: "Your session has expired. Please log in again.",
              details: err.response.data
            });
          } else if (err.response.status === 404) {
            setError({
              title: "Playlist Not Found",
              message: "The playlist you're looking for doesn't exist or you don't have access to it.",
              details: err.response.data
            });
          } else {
            setError({
              title: `Error ${err.response.status}`,
              message: "Failed to analyze playlist.",
              details: err.response.data
            });
          }
        } else if (err.request) {
          setError({
            title: "Connection Error",
            message: "No response from server. Is the backend running?",
            details: null
          });
        } else {
          setError({
            title: "Request Error",
            message: err.message || "An unexpected error occurred.",
            details: null
          });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, [id, token, logout]);

  if (loading) {
    return (
      <Center minH="100vh" bg="#000">
        <VStack spacing={6}>
          <Spinner size="xl" color="#1DB954" thickness="4px" />
          <Text color="#B3B3B3" fontSize={{ base: 'lg', md: 'xl' }} fontWeight="medium">
            Analyzing your playlist's aura...
          </Text>
        </VStack>
      </Center>
    );
  }

  if (error || !analysis) {
    return (
      <Center minH="100vh" bg="#000">
        <VStack spacing={8} maxW="600px" px={4}>
          <Heading
            size={{ base: 'xl', md: '2xl' }}
            fontWeight="900"
            color="#FFFFFF"
            letterSpacing="-1px"
            textAlign="center"
          >
            {error?.title || "Something Went Wrong"}
          </Heading>
          
          <Text color="#B3B3B3" fontSize={{ base: 'md', md: 'lg' }} textAlign="center">
            {error?.message || "Could not load analysis data for this playlist."}
          </Text>
          
          {error?.details && (
            <Box 
              bg="#1a1a1a" 
              p={4} 
              borderRadius="lg" 
              border="1px solid #333"
              width="100%"
            >
              <Text color="#ff3333" fontWeight="bold" mb={2} fontSize="sm">
                Error Details:
              </Text>
              <Text 
                color="#B3B3B3" 
                fontSize="xs" 
                fontFamily="monospace" 
                whiteSpace="pre-wrap"
                overflowX="auto"
              >
                {typeof error.details === 'string' 
                  ? error.details 
                  : JSON.stringify(error.details, null, 2)}
              </Text>
            </Box>
          )}
          
          <VStack spacing={4} pt={4}>
            <Button
              as={RouterLink}
              to="/analyze/playlists"
              leftIcon={<Icon as={FaArrowLeft} />}
              size="lg"
              bg="#1DB954"
              color="black"
              borderRadius="full"
              fontWeight="bold"
              px={8}
              py={6}
              _hover={{
                bg: '#1ed760',
                transform: 'scale(1.05)',
              }}
              transition="all 0.3s"
            >
              Back to Playlists
            </Button>
            
            {(error?.title === "Session Expired" || error?.title?.includes("403")) && (
              <Button
                onClick={() => {
                  localStorage.removeItem('token');
                  localStorage.removeItem('refreshToken');
                  window.location.href = '/login';
                }}
                size="md"
                variant="outline"
                color="#1DB954"
                borderColor="#1DB954"
                borderRadius="full"
                _hover={{ bg: '#1DB954', color: 'black' }}
              >
                Log In Again
              </Button>
            )}
            
            <Button
              onClick={() => {
                const currentToken = localStorage.getItem('token');
                if (currentToken && id) {
                  window.open(`http://localhost:8000/api/analyze/playlist/${id}?access_token=${currentToken}`, '_blank');
                }
              }}
              size="sm"
              variant="ghost"
              color="#B3B3B3"
              _hover={{ color: '#1DB954' }}
            >
              Test API Directly
            </Button>
          </VStack>
        </VStack>
      </Center>
    );
  }

  const { analysis: analysisResult, details: playlistDetails } = analysis;
  const { aura, avg_features } = analysisResult;

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
        to="/analyze/playlists"
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
        Back to Playlists
      </Button>

      <Flex
        direction={{ base: 'column', lg: 'row' }}
        gap={{ base: 6, md: 8 }}
      >
        {/* Left Column: Playlist Info + Aura */}
        <VStack flex={1} spacing={{ base: 6, md: 8 }} align="stretch">
          {/* Playlist Info Card */}
          <Card
            bg="#121212"
            borderRadius="xl"
            overflow="hidden"
            border="1px solid #282828"
            transition="all 0.3s"
            _hover={{ transform: 'translateY(-4px)', boxShadow: '0 20px 40px rgba(29,185,84,0.15)' }}
          >
            <CardBody p={{ base: 6, md: 8 }}>
              <Flex
                direction={{ base: 'column', sm: 'row' }}
                align={{ base: 'center', sm: 'start' }}
                gap={{ base: 4, sm: 6 }}
              >
                {playlistDetails.images && playlistDetails.images.length > 0 ? (
                  <Image
                    boxSize={{ base: '140px', md: '180px' }}
                    src={playlistDetails.images[0]?.url}
                    alt={playlistDetails.name}
                    borderRadius="md"
                    objectFit="cover"
                    boxShadow="0 4px 16px rgba(0,0,0,0.4)"
                  />
                ) : (
                  <Box
                    boxSize={{ base: '140px', md: '180px' }}
                    bg="#282828"
                    borderRadius="md"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    boxShadow="0 4px 16px rgba(0,0,0,0.4)"
                  >
                    <Icon as={FaMusic} color="#1DB954" boxSize={12} />
                  </Box>
                )}
                <VStack align={{ base: 'center', sm: 'start' }} spacing={2} flex={1}>
                  <Heading
                    size={{ base: 'lg', md: 'xl' }}
                    fontWeight="900"
                    letterSpacing="-0.5px"
                    color="#FFFFFF"
                    textAlign={{ base: 'center', sm: 'left' }}
                  >
                    {playlistDetails.name || 'Unnamed Playlist'}
                  </Heading>
                  <Text
                    fontSize={{ base: 'md', md: 'lg' }}
                    color="#B3B3B3"
                    noOfLines={3}
                    textAlign={{ base: 'center', sm: 'left' }}
                  >
                    {playlistDetails.description || 'No description available'}
                  </Text>
                  <HStack spacing={3} flexWrap="wrap" justify={{ base: 'center', sm: 'start' }}>
                    <Badge bg="#1DB954" color="black" fontSize="sm" px={3} py={1} borderRadius="full">
                      {playlistDetails.tracks?.total || 0} tracks
                    </Badge>
                    <Badge bg="#282828" color="#B3B3B3" fontSize="sm" px={3} py={1} borderRadius="full">
                      By {playlistDetails.owner?.display_name || 'Unknown'}
                    </Badge>
                    {playlistDetails.public !== undefined && (
                      <Badge 
                        bg={playlistDetails.public ? "#1DB954" : "#666"} 
                        color="black" 
                        fontSize="sm" 
                        px={3} 
                        py={1} 
                        borderRadius="full"
                      >
                        {playlistDetails.public ? 'Public' : 'Private'}
                      </Badge>
                    )}
                  </HStack>
                </VStack>
              </Flex>
            </CardBody>
          </Card>

          {/* Aura Card */}
          <Card
            bg="#121212"
            borderRadius="xl"
            border="1px solid #282828"
            transition="all 0.3s"
            _hover={{ transform: 'translateY(-4px)', boxShadow: '0 20px 40px rgba(29,185,84,0.15)' }}
          >
            <CardBody p={{ base: 6, md: 8 }}>
              <VStack align="start" spacing={4}>
                <Text fontSize="md" color="#B3B3B3" fontWeight="medium">
                  Your Playlist's Vibe Is...
                </Text>
                <Heading
                  size={{ base: '2xl', md: '3xl' }}
                  fontWeight="900"
                  letterSpacing="-1px"
                  color="#FFFFFF"
                >
                  {aura.name}
                </Heading>
                <Text fontSize="lg" color="#B3B3B3" lineHeight="1.8">
                  {aura.description}
                </Text>
                <HStack spacing={4} mt={2}>
                  <Button
                    size="md"
                    bg="#1DB954"
                    color="black"
                    borderRadius="full"
                    fontWeight="bold"
                    px={6}
                    _hover={{ bg: '#1ed760', transform: 'scale(1.05)' }}
                    transition="all 0.3s"
                  >
                    Share Your Aura
                  </Button>
                  <Box
                    width="40px"
                    height="40px"
                    borderRadius="full"
                    bg={aura.color || '#1DB954'}
                    boxShadow={`0 0 15px ${aura.color || '#1DB954'}80`}
                  />
                </HStack>
              </VStack>
            </CardBody>
          </Card>
        </VStack>

        {/* Right Column: Audio Features */}
        <VStack flex={1} spacing={{ base: 6, md: 8 }} align="stretch">
          <Card
            bg="#121212"
            borderRadius="xl"
            border="1px solid #282828"
            transition="all 0.3s"
            _hover={{ transform: 'translateY(-4px)', boxShadow: '0 20px 40px rgba(29,185,84,0.15)' }}
          >
            <CardBody p={{ base: 6, md: 8 }}>
              <HStack spacing={4} mb={6}>
                <Icon as={FaMusic} color="#1DB954" boxSize={6} />
                <Heading
                  size={{ base: 'lg', md: 'xl' }}
                  fontWeight="900"
                  color="#FFFFFF"
                  letterSpacing="-0.5px"
                >
                  Audio Features
                </Heading>
              </HStack>

              <VStack spacing={{ base: 4, md: 6 }} align="stretch">
                {avg_features && Object.keys(avg_features).length > 0 ? (
                  <>
                    <FeatureProgress label="Danceability" value={avg_features.danceability} />
                    <FeatureProgress label="Energy" value={avg_features.energy} />
                    <FeatureProgress label="Positivity" value={avg_features.valence} />
                    <FeatureProgress label="Acousticness" value={avg_features.acousticness} />
                    {avg_features.instrumentalness !== undefined && (
                      <FeatureProgress label="Instrumentalness" value={avg_features.instrumentalness} />
                    )}
                    {avg_features.tempo !== undefined && (
                      <Box>
                        <HStack justify="space-between" mb={2}>
                          <Text
                            textTransform="capitalize"
                            fontWeight="500"
                            color="#FFFFFF"
                            fontSize={{ base: 'sm', md: 'md' }}
                          >
                            Tempo
                          </Text>
                          <Badge
                            bg="#1DB954"
                            color="black"
                            fontSize={{ base: 'xs', md: 'sm' }}
                            px={3}
                            py={1}
                            borderRadius="full"
                            fontWeight="bold"
                          >
                            {avg_features.tempo.toFixed(0)} BPM
                          </Badge>
                        </HStack>
                        <Progress
                          value={Math.min(avg_features.tempo, 200) / 2} // Normalize for display
                          colorScheme="green"
                          size="md"
                          borderRadius="full"
                          bg="#282828"
                          sx={{
                            '& > div': {
                              bg: '#1DB954',
                              transition: 'width 1s ease',
                              boxShadow: '0 0 15px rgba(29,185,84,0.4)',
                            },
                          }}
                        />
                      </Box>
                    )}
                  </>
                ) : (
                  <Text fontSize="lg" color="#B3B3B3" fontWeight="medium">
                    Not enough data to display audio features.
                  </Text>
                )}
              </VStack>
            </CardBody>
          </Card>
          
          {/* Additional Info Card */}
          <Card
            bg="#121212"
            borderRadius="xl"
            border="1px solid #282828"
            transition="all 0.3s"
            _hover={{ transform: 'translateY(-4px)', boxShadow: '0 20px 40px rgba(29,185,84,0.15)' }}
          >
            <CardBody p={{ base: 6, md: 8 }}>
              <VStack align="start" spacing={4}>
                <Heading
                  size={{ base: 'md', md: 'lg' }}
                  fontWeight="700"
                  color="#FFFFFF"
                  letterSpacing="-0.5px"
                >
                  About This Analysis
                </Heading>
                <Text fontSize="sm" color="#B3B3B3" lineHeight="1.6">
                  This analysis is based on the average audio features of all tracks in your playlist. 
                  Spotify provides these features to help understand the musical characteristics of your collection.
                </Text>
                <Button
                  as="a"
                  href={`https://open.spotify.com/playlist/${id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  size="sm"
                  variant="outline"
                  color="#1DB954"
                  borderColor="#1DB954"
                  borderRadius="full"
                  _hover={{ bg: '#1DB954', color: 'black' }}
                  width="100%"
                >
                  Open in Spotify
                </Button>
              </VStack>
            </CardBody>
          </Card>
        </VStack>
      </Flex>
    </Box>
  );
};

export default PlaylistAnalysis;