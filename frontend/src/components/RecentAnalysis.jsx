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
    <Text mb="1" textTransform="capitalize" fontWeight="bold">{label}</Text>
    <Progress 
      value={value * 100} 
      colorScheme={color} 
      size="lg" 
      borderRadius="md" 
      bg={{ base: 'gray.200', _dark: 'gray.600' }} 
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

  const bgColor = { base: 'gray.50', _dark: 'gray.900' };
  const cardBgColor = { base: 'white', _dark: 'gray.800' };

  if (loading) {
    return (
      <Center h="100vh" bg={bgColor}>
        <VStack spacing={4}>
          <Spinner size="xl" color="green.400" />
          <Text>Analyzing your recent tracks...</Text>
        </VStack>
      </Center>
    );
  }

  if (error || !analysis) {
    return (
      <Center h="100vh" bg={bgColor}>
        <VStack>
          <Heading>Analysis Failed</Heading>
          <Text color="red.400" mt={4}>{error}</Text>
          <Button as={RouterLink} to="/" leftIcon={<Icon as={FaArrowLeft} />} mt={8}>
            Back to Dashboard
          </Button>
        </VStack>
      </Center> 
    );
  }

  const { analysis: analysisResult } = analysis;
  const { aura, avg_features } = analysisResult;

  return (
    <Box bg={bgColor} minH="100vh" p={{ base: 4, md: 8 }}>
      <Button as={RouterLink} to="/" leftIcon={<Icon as={FaArrowLeft} />} mb={8} variant="outline">
        Back to Dashboard
      </Button>
      <Flex direction={{ base: 'column', lg: 'row' }} gap={8}>
        {/* Left side: Aura */}
        <VStack flex="1" spacing={6} align="stretch">
           <Card bg={cardBgColor} shadow="lg">
            <CardBody>
                <Heading size="lg">Analysis of your Recently Played Tracks</Heading>
            </CardBody>
          </Card>
          <Card bg={aura.color} color="white" p={6} shadow="2xl">
            <Heading size="md" mb={2} opacity="0.8">Your Recent Aura Is...</Heading>
            <Heading size="2xl" mb={4}>{aura.name}</Heading>
            <Text fontSize="lg">{aura.description}</Text>
          </Card>
        </VStack>

        {/* Right side: Audio Features */}
        <VStack flex="1" spacing={6} align="stretch">
          <Card bg={cardBgColor} p={6} shadow="lg">
            <Heading size="lg" mb={6}>Average Audio Features</Heading>
            {avg_features && Object.keys(avg_features).length > 0 ? (
              <VStack spacing={5} align="stretch">
                <FeatureProgress label="Danceability" value={avg_features.danceability} color="pink" />
                <FeatureProgress label="Energy" value={avg_features.energy} color="yellow" />
                <FeatureProgress label="Positivity" value={avg_features.valence} color="orange" />
                <FeatureProgress label="Acousticness" value={avg_features.acousticness} color="teal" />
              </VStack>
            ) : (
              <Text>Not enough data to display audio features.</Text>
            )}
          </Card>
        </VStack>
      </Flex>
    </Box>
  );
};

export default RecentAnalysis;