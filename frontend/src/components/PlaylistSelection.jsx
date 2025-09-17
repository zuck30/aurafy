import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
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
} from '@chakra-ui/react';
import { FaArrowLeft, FaPlay } from 'react-icons/fa';
import { getPlaylists } from '../api';
import { useAuth } from '../App';

const PlaylistCard = ({ playlist }) => (
  <RouterLink to={`/analyze/playlist/${playlist.id}`}>
    <Card
      bg="rgba(40, 40, 40, 0.9)"
      borderRadius="lg"
      overflow="hidden"
      boxShadow="0 4px 15px rgba(0, 0, 0, 0.3)"
      border="1px solid"
      borderColor="whiteAlpha.200"
      _hover={{
        transform: 'translateY(-4px)',
        boxShadow: '0 6px 20px rgba(0, 0, 0, 0.4)',
        bg: 'rgba(60, 60, 60, 0.9)',
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
      <Box position="relative">
        <Image
          src={playlist.images[0]?.url || 'https://via.placeholder.com/150'}
          alt={playlist.name}
          borderRadius="lg"
          objectFit="cover"
          w="full"
          h={{ base: '140px', md: '180px' }}
        />
        <Box
          position="absolute"
          top="0"
          left="0"
          right="0"
          bottom="0"
          bg="rgba(0, 0, 0, 0.5)"
          opacity="0"
          _hover={{ opacity: 1 }}
          transition="opacity 0.2s"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <IconButton
            aria-label="Play playlist"
            icon={<FaPlay />}
            colorScheme="green"
            variant="solid"
            size="md"
            borderRadius="full"
            bg="#1db954"
            _hover={{ bg: '#1ed760', transform: 'translateY(-2px)' }}
            _active={{ transform: 'translateY(0)' }}
          />
        </Box>
      </Box>
      <CardBody p={{ base: 3, md: 4 }}>
        <VStack align="start" spacing="2">
          <Heading
            size="sm"
            fontWeight="900"
            color="white"
            noOfLines={1}
            fontFamily="'Circular', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
          >
            {playlist.name}
          </Heading>
          <Text
            fontSize={{ base: 'xs', md: 'sm' }}
            color="gray.300"
            noOfLines={2}
            fontFamily="'Circular', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
          >
            {playlist.description || 'No description available'}
          </Text>
          <Text
            fontSize="xs"
            color="gray.400"
            fontWeight="700"
          >
            {playlist.tracks.total} tracks
          </Text>
        </VStack>
      </CardBody>
    </Card>
  </RouterLink>
);

const PlaylistSelection = () => {
  const { token } = useAuth();
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlaylists = async () => {
      if (!token) return;
      try {
        setLoading(true);
        const res = await getPlaylists(token);
        setPlaylists(res.data.items);
      } catch (error) {
        console.error("Failed to fetch playlists", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylists();
  }, [token]);

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
            Loading your playlists...
          </Text>
        </VStack>
      </Center>
    );
  }

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
      <Heading
        mb={{ base: 6, md: 8 }}
        size={{ base: 'lg', md: 'xl' }}
        fontWeight="900"
        letterSpacing="-0.5px"
      >
        Select a Playlist to Analyze
      </Heading>
      <SimpleGrid
        columns={{ base: 1, sm: 2, md: 3, lg: 4, xl: 5 }}
        spacing={{ base: 3, md: 4 }}
        overflowX="auto"
        sx={{
          '&::-webkit-scrollbar': { height: '6px' },
          '&::-webkit-scrollbar-thumb': { bg: 'gray.700', borderRadius: 'full' },
          '&::-webkit-scrollbar-track': { bg: 'transparent' },
        }}
      >
        {playlists.map(p => <PlaylistCard key={p.id} playlist={p} />)}
      </SimpleGrid>
    </Box>
  );
};

export default PlaylistSelection;