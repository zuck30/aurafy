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
  HStack,
  Badge,
  useBreakpointValue,
  keyframes,
} from '@chakra-ui/react';
import { FaArrowLeft, FaPlay, FaMusic } from 'react-icons/fa';
import { getPlaylists } from '../api';
import { useAuth } from '../App';

const hoverAnimation = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.03); }
  100% { transform: scale(1); }
`;

const PlaylistCard = ({ playlist }) => {
  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <RouterLink to={`/analyze/playlist/${playlist.id}`}>
      <Card
        bg="rgba(40, 40, 40, 0.95)"
        borderRadius="xl"
        overflow="hidden"
        boxShadow="0 8px 32px rgba(0, 0, 0, 0.2)"
        border="1px solid rgba(255,255,255,0.05)"
        _hover={{
          transform: 'scale(1.03)',
          boxShadow: '0 12px 48px rgba(0, 0, 0, 0.3)',
          bg: 'rgba(60, 60, 60, 0.95)',
        }}
        transition="all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)"
        position="relative"
        _groupHover={{ animation: `${hoverAnimation} 2s infinite` }}
      >
        <Box position="relative" aspectRatio="1/1">
          <Image
            src={playlist.images[0]?.url || 'https://via.placeholder.com/300'}
            alt={playlist.name}
            objectFit="cover"
            w="full"
            h="full"
          />
          <Box
            position="absolute"
            top="0"
            left="0"
            right="0"
            bottom="0"
            bgGradient="linear(to-t, rgba(0,0,0,0.6), transparent)"
            opacity={isMobile ? 1 : 0}
            _groupHover={{ opacity: 1 }}
            transition="opacity 0.2s ease"
            display="flex"
            alignItems="flex-end"
            justifyContent="flex-start"
            p="4"
          >
            <IconButton
              aria-label="Play playlist"
              icon={<FaPlay />}
              colorScheme="green"
              variant="solid"
              size="lg"
              borderRadius="full"
              bg="#1db954"
              _hover={{ bg: '#1ed760', transform: 'scale(1.1)' }}
              transition="all 0.2s ease"
            />
          </Box>
        </Box>
        <CardBody p="4">
          <VStack align="start" spacing="1">
            <Heading size="md" fontWeight="black" color="white" noOfLines={1}>
              {playlist.name}
            </Heading>
            <Text fontSize="sm" color="gray.300" noOfLines={2}>
              {playlist.description || 'No description'}
            </Text>
            <HStack spacing="2">
              <Badge colorScheme="green" variant="subtle" fontSize="xs">
                {playlist.tracks.total} tracks
              </Badge>
              <Badge colorScheme="gray" variant="subtle" fontSize="xs">
                By {playlist.owner.display_name}
              </Badge>
            </HStack>
          </VStack>
        </CardBody>
      </Card>
    </RouterLink>
  );
};

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
        bg="rgba(18, 18, 18, 0.98)"
        backdropFilter="blur(20px)"
        fontFamily="'Circular Std', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
      >
        <VStack spacing="6">
          <Spinner size="xl" color="#1db954" thickness="4px" speed="0.65s" />
          <Text color="white" fontWeight="bold" fontSize={{ base: 'lg', md: 'xl' }}>
            Loading your playlists...
          </Text>
        </VStack>
      </Center>
    );
  }

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
      <HStack spacing="4" mb={{ base: '6', md: '8' }} align="center">
        <Icon as={FaMusic} color="#1db954" boxSize="8" />
        <Heading
          size={{ base: 'xl', md: '2xl' }}
          fontWeight="black"
          letterSpacing="-1px"
        >
          Choose a Playlist to Analyze
        </Heading>
      </HStack>
      <SimpleGrid
        columns={{ base: 2, sm: 3, md: 4, lg: 5, xl: 6 }}
        spacing="4"
      >
        {playlists.map(p => (
          <PlaylistCard key={p.id} playlist={p} />
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default PlaylistSelection;