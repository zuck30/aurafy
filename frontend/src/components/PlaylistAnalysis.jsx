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

const FeatureProgress = ({ label, value, color }) => (
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
  const { token } = useAuth();
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isMobile = useBreakpointValue({ base: true, md: false });

  useEffect(() => {
    const fetchAnalysis = async () => {
      if (!token || !id) return;
      try {
        setLoading(true);
        setError(null);
        const res = await analyzePlaylist(id, token);
        setAnalysis(res.data);
      } catch (err) {
        console.error("Failed to fetch playlist analysis", err);
        const errorMessage = err.response?.data?.detail
          ? JSON.stringify(err.response.data.detail)
          : 'Could not load analysis data for this playlist.';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, [id, token]);

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
        <VStack spacing={8}>
          <Heading
            size={{ base: 'xl', md: '2xl' }}
            fontWeight="900"
            color="#FFFFFF"
            letterSpacing="-1px"
          >
            Something Went Wrong
          </Heading>
          <Text color="#B3B3B3" fontSize={{ base: 'md', md: 'lg' }} textAlign="center">
            {error}
          </Text>
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
            py={6}
            _hover={{
              bg: '#1ed760',
              transform: 'scale(1.05)',
            }}
            transition="all 0.3s"
          >
            Back to Dashboard
          </Button>
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
                <Image
                  boxSize={{ base: '140px', md: '180px' }}
                  src={playlistDetails.images[0]?.url || 'https://via.placeholder.com/300'}
                  alt={playlistDetails.name}
                  borderRadius="md"
                  objectFit="cover"
                  boxShadow="0 4px 16px rgba(0,0,0,0.4)"
                />
                <VStack align={{ base: 'center', sm: 'start' }} spacing={2}>
                  <Heading
                    size={{ base: 'lg', md: 'xl' }}
                    fontWeight="900"
                    letterSpacing="-0.5px"
                    color="#FFFFFF"
                  >
                    {playlistDetails.name}
                  </Heading>
                  <Text
                    fontSize={{ base: 'md', md: 'lg' }}
                    color="#B3B3B3"
                    noOfLines={3}
                  >
                    {playlistDetails.description || 'No description available'}
                  </Text>
                  <HStack spacing={3}>
                    <Badge bg="#1DB954" color="black" fontSize="sm" px={3} py={1} borderRadius="full">
                      {playlistDetails.tracks.total} tracks
                    </Badge>
                    <Badge bg="#282828" color="#B3B3B3" fontSize="sm" px={3} py={1} borderRadius="full">
                      By {playlistDetails.owner.display_name}
                    </Badge>
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
                  Your Playlist’s Vibe Is...
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
                <Button
                  mt={4}
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
                    <FeatureProgress label="Danceability" value={avg_features.danceability} color="green" />
                    <FeatureProgress label="Energy" value={avg_features.energy} color="green" />
                    <FeatureProgress label="Positivity" value={avg_features.valence} color="green" />
                    <FeatureProgress label="Acousticness" value={avg_features.acousticness} color="green" />
                  </>
                ) : (
                  <Text fontSize="lg" color="#B3B3B3" fontWeight="medium">
                    Not enough data to display audio features.
                  </Text>
                )}
              </VStack>
            </CardBody>
          </Card>
        </VStack>
      </Flex>
    </Box>
  );
};

export default PlaylistAnalysis;