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
  keyframes,
} from '@chakra-ui/react';
import { FaArrowLeft, FaMusic } from 'react-icons/fa';
import { analyzePlaylist } from '../api';
import { useAuth } from '../App';

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const FeatureProgress = ({ label, value, color }) => (
  <Box>
    <HStack justify="space-between" mb="2">
      <Text
        textTransform="capitalize"
        fontWeight="bold"
        color="white"
        fontSize={{ base: 'sm', md: 'md' }}
        fontFamily="'Circular Std', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
      >
        {label}
      </Text>
      <Badge
        colorScheme={color}
        fontSize={{ base: 'xs', md: 'sm' }}
        px="3"
        py="1"
        borderRadius="full"
      >
        {(value * 100).toFixed(0)}%
      </Badge>
    </HStack>
    <Progress
      value={value * 100}
      colorScheme={color}
      size="lg"
      borderRadius="full"
      bg="rgba(255, 255, 255, 0.08)"
      sx={{
        '& > div': {
          transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: '0 2px 12px rgba(0, 0, 0, 0.3)',
          borderRadius: 'full',
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
      <Center
        h="100vh"
        bg="rgba(18, 18, 18, 0.98)"
        backdropFilter="blur(20px)"
        fontFamily="'Circular Std', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
      >
        <VStack spacing="6">
          <Spinner size="xl" color="#1db954" thickness="4px" speed="0.65s" />
          <Text color="white" fontWeight="bold" fontSize={{ base: 'lg', md: 'xl' }}>
            Analyzing your playlist's aura...
          </Text>
        </VStack>
      </Center>
    );
  }

  if (error || !analysis) {
    return (
      <Center
        h="100vh"
        bg="rgba(18, 18, 18, 0.98)"
        backdropFilter="blur(20px)"
        fontFamily="'Circular Std', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
      >
        <VStack spacing="8">
          <Heading
            size={{ base: 'xl', md: '2xl' }}
            fontWeight="black"
            color="white"
            letterSpacing="-1px"
          >
            Something Went Wrong
          </Heading>
          <Text color="#ff4d4f" fontSize={{ base: 'md', md: 'lg' }} fontWeight="bold" textAlign="center">
            {error}
          </Text>
          <Button
            as={RouterLink}
            to="/"
            leftIcon={<Icon as={FaArrowLeft} />}
            size="lg"
            bg="#1db954"
            color="white"
            borderRadius="full"
            fontWeight="bold"
            px="8"
            py="6"
            boxShadow="0 8px 32px rgba(29, 185, 84, 0.3)"
            _hover={{
              bg: '#1ed760',
              transform: 'scale(1.05)',
              boxShadow: '0 12px 48px rgba(29, 185, 84, 0.4)',
            }}
            _active={{ transform: 'scale(1)' }}
            transition="all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)"
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
      bg="rgba(18, 18, 18, 0.98)"
      minH="100vh"
      p={{ base: '4', md: '8' }}
      fontFamily="'Circular Std', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
      color="white"
      maxW="container.xl"
      mx="auto"
    >
      <Button
        as={RouterLink}
        to="/"
        leftIcon={<Icon as={FaArrowLeft} />}
        mb={{ base: '6', md: '8' }}
        size="md"
        bg="#1db954"
        color="white"
        borderRadius="full"
        fontWeight="bold"
        px="6"
        boxShadow="0 8px 32px rgba(29, 185, 84, 0.3)"
        _hover={{
          bg: '#1ed760',
          transform: 'scale(1.05)',
          boxShadow: '0 12px 48px rgba(29, 185, 84, 0.4)',
        }}
        _active={{ transform: 'scale(1)' }}
        transition="all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)"
      >
        Back to Dashboard
      </Button>
      <Flex
        direction={{ base: 'column', lg: 'row' }}
        gap={{ base: '6', md: '8' }}
      >
        {/* Left side: Playlist Info & Aura */}
        <VStack flex="1" spacing={{ base: '6', md: '8' }} align="stretch">
          <Card
            bg="linear-gradient(135deg, rgba(40,40,40,0.95), rgba(60,60,60,0.95))"
            borderRadius="xl"
            boxShadow="0 8px 32px rgba(0,0,0,0.2)"
            border="1px solid rgba(255,255,255,0.05)"
            _hover={{
              transform: 'scale(1.02)',
              boxShadow: '0 12px 48px rgba(0,0,0,0.3)',
            }}
            transition="all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)"
          >
            <CardBody p={{ base: '6', md: '8' }}>
              <Flex
                align="center"
                direction={{ base: 'column', sm: 'row' }}
                gap={{ base: '4', sm: '6' }}
              >
                <Image
                  boxSize={{ base: '140px', md: '180px' }}
                  src={playlistDetails.images[0]?.url || 'https://via.placeholder.com/300'}
                  alt={playlistDetails.name}
                  borderRadius="md"
                  objectFit="cover"
                  boxShadow="0 4px 16px rgba(0,0,0,0.3)"
                />
                <Box textAlign={{ base: 'center', sm: 'left' }}>
                  <Heading
                    size={{ base: 'lg', md: 'xl' }}
                    fontWeight="black"
                    letterSpacing="-1px"
                  >
                    {playlistDetails.name}
                  </Heading>
                  <Text
                    fontSize={{ base: 'md', md: 'lg' }}
                    color="gray.300"
                    noOfLines={3}
                    mt="2"
                    fontWeight="medium"
                  >
                    {playlistDetails.description || 'No description available'}
                  </Text>
                  <HStack mt="2" spacing="3">
                    <Badge colorScheme="green" variant="subtle" fontSize="sm">
                      {playlistDetails.tracks.total} tracks
                    </Badge>
                    <Badge colorScheme="gray" variant="subtle" fontSize="sm">
                      By {playlistDetails.owner.display_name}
                    </Badge>
                  </HStack>
                </Box>
              </Flex>
            </CardBody>
          </Card>
          <Card
            bg={aura.color}
            color="white"
            p={{ base: '6', md: '8' }}
            borderRadius="xl"
            boxShadow="0 8px 32px rgba(0,0,0,0.2)"
            border="1px solid rgba(255,255,255,0.05)"
            _hover={{
              transform: 'scale(1.02)',
              boxShadow: '0 12px 48px rgba(0,0,0,0.3)',
              animation: `${pulse} 2s infinite`,
            }}
            transition="all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)"
          >
            <CardBody>
              <Text
                fontSize={{ base: 'md', md: 'lg' }}
                fontWeight="bold"
                opacity="0.8"
                mb="2"
              >
                Your Playlist’s Vibe Is...
              </Text>
              <Heading
                size={{ base: '2xl', md: '3xl' }}
                fontWeight="black"
                letterSpacing="-1.5px"
                mb="4"
              >
                {aura.name}
              </Heading>
              <Text
                fontSize={{ base: 'md', md: 'lg' }}
                fontWeight="medium"
                lineHeight="1.8"
                opacity="0.9"
              >
                {aura.description}
              </Text>
              <Button
                mt="6"
                size="md"
                bg="whiteAlpha.200"
                color="white"
                borderRadius="full"
                _hover={{ bg: 'whiteAlpha.300', transform: 'scale(1.05)' }}
                _active={{ transform: 'scale(1)' }}
                transition="all 0.2s ease"
              >
                Share Your Aura
              </Button>
            </CardBody>
          </Card>
        </VStack>

        {/* Right side: Audio Features */}
        <VStack flex="1" spacing={{ base: '6', md: '8' }} align="stretch">
          <Card
            bg="linear-gradient(135deg, rgba(40,40,40,0.95), rgba(60,60,60,0.95))"
            p={{ base: '6', md: '8' }}
            borderRadius="xl"
            boxShadow="0 8px 32px rgba(0,0,0,0.2)"
            border="1px solid rgba(255,255,255,0.05)"
            _hover={{
              transform: 'scale(1.02)',
              boxShadow: '0 12px 48px rgba(0,0,0,0.3)',
            }}
            transition="all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)"
          >
            <CardBody>
              <HStack spacing="4" mb="6">
                <Icon as={FaMusic} color="#1db954" boxSize="6" />
                <Heading
                  size={{ base: 'lg', md: 'xl' }}
                  fontWeight="black"
                  letterSpacing="-1px"
                >
                  Audio Features Breakdown
                </Heading>
              </HStack>
              <VStack spacing={{ base: '4', md: '6' }} align="stretch">
                {avg_features && Object.keys(avg_features).length > 0 ? (
                  <>
                    <FeatureProgress label="Danceability" value={avg_features.danceability} color="pink" />
                    <FeatureProgress label="Energy" value={avg_features.energy} color="yellow" />
                    <FeatureProgress label="Positivity" value={avg_features.valence} color="orange" />
                    <FeatureProgress label="Acousticness" value={avg_features.acousticness} color="teal" />
                  </>
                ) : (
                  <Text
                    fontSize={{ base: 'md', md: 'lg' }}
                    color="gray.300"
                    fontWeight="bold"
                  >
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