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
import { analyzeRecent } from '../api';
import { useAuth } from '../App';

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
  const { token } = useAuth();
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalysis = async () => {
      if (!token) return;
      try {
        setLoading(true);
        setError(null);
        const res = await analyzeRecent(token);
        setAnalysis(res.data);
      } catch (err) {
        console.error("Failed to fetch recent analysis", err);
        if (err.response?.status === 403) {
          setError("Could not fetch recent tracks. This can happen if you have a 'Private Session' enabled in your Spotify client. Please disable it and try again.");
        } else {
          const errorMessage = err.response?.data?.detail ? JSON.stringify(err.response.data.detail) : 'Could not load analysis data for your recent tracks.';
          setError(errorMessage);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, [token]);

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