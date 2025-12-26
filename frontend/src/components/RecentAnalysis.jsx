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
} from '@chakra-ui/react';
import { FaArrowLeft, FaMusic } from 'react-icons/fa';
import { useAuth } from '../App';
import { analyzeRecent } from '../api';

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

const RecentAnalysis = () => {
  const { token, recentTracks } = useAuth();
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isMobile = useBreakpointValue({ base: true, md: false });

  useEffect(() => {
    const performAnalysis = async () => {
      if (!token) {
        setLoading(false);
        setError("No token found. Please login.");
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const res = await analyzeRecent(token);
        setAnalysis(res.data);

      } catch (err) {
        console.error("Failed to perform recent analysis", err);
        setError(err.response?.data?.detail ? JSON.stringify(err.response.data.detail) : 'An error occurred during analysis.');
      } finally {
        setLoading(false);
      }
    };

    performAnalysis();
  }, [token]);

  if (loading) {
    return (
      <Center minH="100vh" bg="#000">
        <VStack spacing={6}>
          <Spinner size="xl" color="#1DB954" thickness="4px" />
          <Text color="#B3B3B3" fontSize={{ base: 'lg', md: 'xl' }} fontWeight="medium">
            Analyzing your music aura...
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

  const { analysis: analysisResult } = analysis;
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
        {/* Left Column: Aura */}
        <VStack flex={1} spacing={{ base: 6, md: 8 }} align="stretch">
          {/* Header Card */}
          <Card
            bg="#121212"
            borderRadius="xl"
            border="1px solid #282828"
            transition="all 0.3s"
            _hover={{ transform: 'translateY(-4px)', boxShadow: '0 20px 40px rgba(29,185,84,0.15)' }}
          >
            <CardBody p={{ base: 6, md: 8 }}>
              <HStack spacing={4} align="center">
                <Icon as={FaMusic} color="#1DB954" boxSize={8} />
                <Heading
                  size={{ base: 'lg', md: 'xl' }}
                  fontWeight="900"
                  color="#FFFFFF"
                  letterSpacing="-0.5px"
                >
                  Your Recent Aura Analysis
                </Heading>
              </HStack>
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
                  Your Music Vibe Is...
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
              <Heading
                size={{ base: 'lg', md: 'xl' }}
                fontWeight="900"
                color="#FFFFFF"
                letterSpacing="-0.5px"
                mb={6}
              >
                Audio Features
              </Heading>

              {avg_features && Object.keys(avg_features).length > 0 ? (
                <VStack spacing={{ base: 4, md: 6 }} align="stretch">
                  <FeatureProgress label="Danceability" value={avg_features.danceability} />
                  <FeatureProgress label="Energy" value={avg_features.energy} />
                  <FeatureProgress label="Positivity" value={avg_features.valence} />
                  <FeatureProgress label="Acousticness" value={avg_features.acousticness} />
                </VStack>
              ) : (
                <Text fontSize="lg" color="#B3B3B3" fontWeight="medium">
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