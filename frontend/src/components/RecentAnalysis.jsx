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
} from '@chakra-ui/react';
import { FaArrowLeft } from 'react-icons/fa';
import { useAuth } from '../App';
import api from '../api'; // Import the default export

const FeatureProgress = ({ label, value, color }) => (
  <Box>
    <Text
      mb="2"
      textTransform="capitalize"
      fontWeight="700"
      color="white"
      fontSize={{ base: 'sm', md: 'md' }}
      fontFamily="'Circular', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    >
      {label}
    </Text>
    <Progress
      value={value * 100}
      colorScheme={color}
      size="lg"
      borderRadius="md"
      bg="rgba(255, 255, 255, 0.1)"
      sx={{
        '& > div': {
          transition: 'width 0.5s ease-in-out',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
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

  useEffect(() => {
    const performAnalysis = async () => {
      if (!token || recentTracks.length === 0) {
        setLoading(false);
        // If there are no recent tracks, we can't analyze.
        // This could happen if the user navigates here directly without visiting the dashboard.
        if (recentTracks.length === 0 && !loading) {
            setError("No recent tracks found. Please listen to some music or visit the dashboard first.");
        }
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // 1. Extract track IDs
        const track_ids = recentTracks
          .map(item => item?.track?.id)
          .filter(id => id);
        const unique_track_ids = [...new Set(track_ids)];

        if (unique_track_ids.length === 0) {
            setError("Could not find any valid tracks in your recent history.");
            setLoading(false);
            return;
        }

        // 2. Get audio features
        const audioFeaturesRes = await api.post('/audio_features', {
          track_ids: unique_track_ids,
          access_token: token,
        });
        const audio_features = audioFeaturesRes.data;

        // 3. Calculate aura
        const auraRes = await api.post('/calculate_aura', {
          features_list: audio_features,
        });
        const analysisResult = auraRes.data;

        // 4. Set final analysis object for rendering
        setAnalysis({
            analysis: analysisResult,
            details: { name: "Recently Played", tracks: recentTracks }
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
        bg="rgba(18, 18, 18, 0.95)"
        backdropFilter="blur(12px)"
        fontFamily="'Circular', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
      >
        <VStack spacing={4}>
          <Spinner size="xl" color="#1db954" />
          <Text color="white" fontWeight="700" fontSize={{ base: 'md', md: 'lg' }}>
            Analyzing your recent tracks...
          </Text>
        </VStack>
      </Center>
    );
  }

  if (error || !analysis) {
    return (
      <Center
        h="100vh"
        bg="rgba(18, 18, 18, 0.95)"
        backdropFilter="blur(12px)"
        fontFamily="'Circular', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
      >
        <VStack spacing={6}>
          <Heading
            size={{ base: 'lg', md: 'xl' }}
            fontWeight="900"
            color="white"
            letterSpacing="-0.5px"
          >
            Analysis Failed
          </Heading>
          <Text color="#ff4d4f" fontSize={{ base: 'sm', md: 'md' }} fontWeight="700">
            {error}
          </Text>
          <Button
            as={RouterLink}
            to="/"
            leftIcon={<Icon as={FaArrowLeft} />}
            size="md"
            bg="#1db954"
            color="white"
            borderRadius="full"
            fontWeight="700"
            letterSpacing="0.5px"
            boxShadow="0 4px 15px rgba(29, 185, 84, 0.3)"
            _hover={{
              bg: '#1ed760',
              transform: 'translateY(-2px)',
              boxShadow: '0 6px 20px rgba(29, 185, 84, 0.4)',
            }}
            _active={{ transform: 'translateY(0)' }}
            transition="all 0.3s ease"
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
      bg="rgba(18, 18, 18, 0.95)"
      minH="100vh"
      p={{ base: 4, md: 6 }}
      fontFamily="'Circular', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
      color="white"
      backdropFilter="blur(12px)"
    >
      <Button
        as={RouterLink}
        to="/"
        leftIcon={<Icon as={FaArrowLeft} />}
        mb={{ base: 6, md: 8 }}
        size="md"
        bg="#1db954"
        color="white"
        borderRadius="full"
        fontWeight="700"
        letterSpacing="0.5px"
        boxShadow="0 4px 15px rgba(29, 185, 84, 0.3)"
        _hover={{
          bg: '#1ed760',
          transform: 'translateY(-2px)',
          boxShadow: '0 6px 20px rgba(29, 185, 84, 0.4)',
        }}
        _active={{ transform: 'translateY(0)' }}
        transition="all 0.3s ease"
      >
        Back to Dashboard
      </Button>
      <Flex
        direction={{ base: 'column', lg: 'row' }}
        gap={{ base: 4, md: 6 }}
        maxW="1400px"
        mx="auto"
      >
        {/* Left side: Aura */}
        <VStack flex="1" spacing={{ base: 4, md: 6 }} align="stretch">
          <Card
            bg="rgba(40, 40, 40, 0.9)"
            borderRadius="lg"
            boxShadow="0 4px 15px rgba(0, 0, 0, 0.3)"
            border="1px solid"
            borderColor="whiteAlpha.200"
            _hover={{
              transform: 'translateY(-4px)',
              boxShadow: '0 6px 20px rgba(0, 0, 0, 0.4)',
            }}
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
              >
                Analysis of Your Recently Played Tracks
              </Heading>
            </CardBody>
          </Card>
          <Card
            bg={aura.color}
            color="white"
            p={{ base: 4, md: 6 }}
            borderRadius="lg"
            boxShadow="0 4px 15px rgba(0, 0, 0, 0.3)"
            border="1px solid"
            borderColor="whiteAlpha.200"
            _hover={{
              transform: 'translateY(-4px)',
              boxShadow: '0 6px 20px rgba(0, 0, 0, 0.4)',
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
            <CardBody>
              <Heading
                size="md"
                mb={2}
                opacity="0.8"
                fontWeight="700"
                letterSpacing="-0.5px"
              >
                Your Recent Aura Is...
              </Heading>
              <Heading
                size={{ base: 'xl', md: '2xl' }}
                mb={4}
                fontWeight="900"
                letterSpacing="-1px"
              >
                {aura.name}
              </Heading>
              <Text
                fontSize={{ base: 'sm', md: 'lg' }}
                fontWeight="700"
                lineHeight="1.6"
              >
                {aura.description}
              </Text>
            </CardBody>
          </Card>
        </VStack>

        {/* Right side: Audio Features */}
        <VStack flex="1" spacing={{ base: 4, md: 6 }} align="stretch">
          <Card
            bg="rgba(40, 40, 40, 0.9)"
            p={{ base: 4, md: 6 }}
            borderRadius="lg"
            boxShadow="0 4px 15px rgba(0, 0, 0, 0.3)"
            border="1px solid"
            borderColor="whiteAlpha.200"
            _hover={{
              transform: 'translateY(-4px)',
              boxShadow: '0 6px 20px rgba(0, 0, 0, 0.4)',
            }}
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
            <CardBody>
              <Heading
                size={{ base: 'md', md: 'lg' }}
                mb={6}
                fontWeight="900"
                letterSpacing="-0.5px"
              >
                Average Audio Features
              </Heading>
              {avg_features && Object.keys(avg_features).length > 0 ? (
                <VStack spacing={{ base: 4, md: 5 }} align="stretch">
                  <FeatureProgress label="Danceability" value={avg_features.danceability} color="pink" />
                  <FeatureProgress label="Energy" value={avg_features.energy} color="yellow" />
                  <FeatureProgress label="Positivity" value={avg_features.valence} color="orange" />
                  <FeatureProgress label="Acousticness" value={avg_features.acousticness} color="teal" />
                </VStack>
              ) : (
                <Text
                  fontSize={{ base: 'sm', md: 'md' }}
                  color="gray.300"
                  fontWeight="700"
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