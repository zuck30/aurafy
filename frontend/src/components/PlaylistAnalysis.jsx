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
} from '@chakra-ui/react';
import { FaArrowLeft } from 'react-icons/fa';
import { analyzePlaylist } from '../api';
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

const PlaylistAnalysis = () => {
  const { id } = useParams();
  const { token } = useAuth();
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchAnalysis = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const res = await analyzePlaylist(token, id);
      setAnalysis(res.data);
    } catch (error) {
      console.error("Failed to fetch playlist analysis", error);
    } finally {
      setLoading(false);
    }
  };

  fetchAnalysis();
}, [token, id]);

  const bgColor = { base: 'gray.50', _dark: 'gray.900' };
  const cardBgColor = { base: 'white', _dark: 'gray.800' };
  const textColor = { base: 'gray.600', _dark: 'gray.300' };

  if (loading) {
    return (
      <Center h="100vh" bg={bgColor}>
        <VStack spacing={4}>
          <Spinner size="xl" color="green.400" />
          <Text>Analyzing your playlist's aura...</Text>
        </VStack>
      </Center>
    );
  }

  if (!analysis) {
    return (
      <Center h="100vh" bg={bgColor}>
        <VStack>
          <Heading>Analysis Failed</Heading>
          <Text>Could not load analysis data for this playlist.</Text>
          <Button as={RouterLink} to="/" leftIcon={<Icon as={FaArrowLeft} />} mt={8}>
            Back to Dashboard
          </Button>
        </VStack>
      </Center>
    );
  }

  const { analysis: analysisResult, details: playlistDetails } = analysis;
  const { aura, avg_features } = analysisResult;

  return (
    <Box bg={bgColor} minH="100vh" p={{ base: 4, md: 8 }}>
      <Button as={RouterLink} to="/" leftIcon={<Icon as={FaArrowLeft} />} mb={8} variant="outline">
        Back to Dashboard
      </Button>
      <Flex direction={{ base: 'column', lg: 'row' }} gap={8}>
        {/* Left side: Playlist Info & Aura */}
        <VStack flex="1" spacing={6} align="stretch">
          <Card bg={cardBgColor} shadow="lg">
            <CardBody>
              <Flex align="center" direction={{ base: 'column', sm: 'row' }}>
                <Image
                  boxSize="150px"
                  src={playlistDetails.images[0]?.url}
                  alt={playlistDetails.name}
                  borderRadius="md"
                  mr={{ base: 0, sm: 6 }}
                  mb={{ base: 4, sm: 0 }}
                />
                <Box textAlign={{ base: 'center', sm: 'left' }}>
                  <Heading size="lg">{playlistDetails.name}</Heading>
                  <Text color={textColor} noOfLines={3}>{playlistDetails.description}</Text>
                </Box>
              </Flex>
            </CardBody>
          </Card>
          <Card bg={aura.color} color="white" p={6} shadow="2xl">
            <Heading size="md" mb={2} opacity="0.8">Your Playlist's Aura Is...</Heading>
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

export default PlaylistAnalysis;

