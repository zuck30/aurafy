import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
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
  Progress,
  Button,
  Icon,
  HStack,
  Badge,
  useBreakpointValue,
  keyframes,
} from '@chakra-ui/react';
import { FaArrowLeft, FaMusic } from 'react-icons/fa';
import { useAuth } from '../App';
import api from '../api';

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

const RecentAnalysis = () => {
  const { token, recentTracks } = useAuth();
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isMobile = useBreakpointValue({ base: true, md: false });

  useEffect(() => {
    const performAnalysis = async () => {
      if (!token || recentTracks.length === 0) {
        setLoading(false);
        setError("No recent tracks found. Please listen to some music or visit the dashboard first.");
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const track_ids = [...new Set(recentTracks.map(item => item?.track?.id).filter(id => id))];

        if (track_ids.length === 0) {
          setError("Could not find any valid tracks in your recent history.");
          setLoading(false);
          return;
        }

        const audioFeaturesRes = await api.post('/audio_features', {
          track_ids,
          access_token: token,
        });
        const audio_features = audioFeaturesRes.data;

        const auraRes = await api.post('/calculate_aura', {
          features_list: audio_features,
        });
        const analysisResult = auraRes.data;

        setAnalysis({
          analysis: analysisResult,
          details: { name: "Recently Played", tracks: recentTracks },
        });
      } catch (err) {
        console.error("Failed to perform recent analysis", err);
        setError(err.response?.data?.detail ? JSON.stringify(err.response.data.detail) : 'An error occurred during analysis.');
      } finally {
        setLoading(false);
      }
    };

    performAnalysis();
  }, [token, recentTracks]);

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
            Analyzing your music aura...
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

  const { analysis: analysisResult } = analysis;
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
        {/* Left side: Aura */}
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
              <HStack spacing="4" align="center">
                <Icon as={FaMusic} color="#1db954" boxSize="8" />
                <Heading
                  size={{ base: 'lg', md: 'xl' }}
                  fontWeight="black"
                  letterSpacing="-1px"
                >
                  Your Recent Aura Analysis
                </Heading>
              </HStack>
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
                Your Music Vibe Is...
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
              <Heading
                size={{ base: 'lg', md: 'xl' }}
                fontWeight="black"
                letterSpacing="-1px"
                mb="6"
              >
                Audio Features Breakdown
              </Heading>
              {avg_features && Object.keys(avg_features).length > 0 ? (
                <VStack spacing={{ base: '4', md: '6' }} align="stretch">
                  <FeatureProgress label="Danceability" value={avg_features.danceability} color="pink" />
                  <FeatureProgress label="Energy" value={avg_features.energy} color="yellow" />
                  <FeatureProgress label="Positivity" value={avg_features.valence} color="orange" />
                  <FeatureProgress label="Acousticness" value={avg_features.acousticness} color="teal" />
                </VStack>
              ) : (
                <Text
                  fontSize={{ base: 'md', md: 'lg' }}
                  color="gray.300"
                  fontWeight="bold"
                >
                  Not enough data to display audio features.
                </Text>
              )}
            </CardBody>
          </Card>
        </VStack>
      </Flex>
    </Box>
  );
};

export default RecentAnalysis;