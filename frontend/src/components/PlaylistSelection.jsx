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
} from '@chakra-ui/react';
import { FaArrowLeft, FaPlay, FaMusic } from 'react-icons/fa';
import { getPlaylists } from '../api';
import { useAuth } from '../App';

const PlaylistCard = ({ playlist }) => {
  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <RouterLink to={`/analyze/playlist/${playlist.id}`} style={{ textDecoration: 'none' }}>
      <Card
        bg="#121212"
        borderRadius="xl"
        overflow="hidden"
        border="1px solid #282828"
        transition="all 0.3s"
        _hover={{ 
          transform: 'translateY(-4px)', 
          boxShadow: '0 20px 40px rgba(29,185,84,0.15)',
          bg: '#181818'
        }}
      >
        <Box position="relative">
          <Image
            src={playlist.images[0]?.url || 'https://via.placeholder.com/300'}
            alt={playlist.name}
            aspectRatio={1}
            objectFit="cover"
          />
          <Box
            position="absolute"
            inset={0}
            bg="linear-gradient(to top, rgba(0,0,0,0.7), transparent)"
            opacity={isMobile ? 1 : 0}
            _groupHover={{ opacity: 1 }}
            transition="opacity 0.3s"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <IconButton
              aria-label="Play playlist"
              icon={<FaPlay />}
              size="lg"
              colorScheme="green"
              bg="#1DB954"
              borderRadius="full"
              _hover={{ bg: '#1ed760', transform: 'scale(1.1)' }}
              transition="all 0.2s"
            />
          </Box>
        </Box>
        <CardBody p={4}>
          <VStack align="start" spacing={1}>
            <Text
              fontWeight="bold"
              color="#FFFFFF"
              fontSize="md"
              noOfLines={1}
            >
              {playlist.name}
            </Text>
            <Text
              fontSize="sm"
              color="#B3B3B3"
              noOfLines={2}
            >
              {playlist.description || 'No description'}
            </Text>
            <HStack spacing={2} mt={1}>
              <Badge
                bg="#1DB954"
                color="black"
                fontSize="xs"
                px={3}
                py={1}
                borderRadius="full"
                fontWeight="bold"
              >
                {playlist.tracks.total} tracks
              </Badge>
              <Badge
                bg="#282828"
                color="#B3B3B3"
                fontSize="xs"
                px={3}
                py={1}
                borderRadius="full"
              >
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
      <Center minH="100vh" bg="#000">
        <VStack spacing={6}>
          <Spinner size="xl" color="#1DB954" thickness="4px" />
          <Text color="#B3B3B3" fontSize={{ base: 'lg', md: 'xl' }} fontWeight="medium">
            Loading your playlists...
          </Text>
        </VStack>
      </Center>
    );
  }

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

      <HStack spacing={4} mb={{ base: 6, md: 8 }} align="center">
        <Icon as={FaMusic} color="#1DB954" boxSize={8} />
        <Heading
          size={{ base: 'xl', md: '2xl' }}
          fontWeight="900"
          letterSpacing="-0.5px"
          color="#FFFFFF"
        >
          Choose a Playlist to Analyze
        </Heading>
      </HStack>

      <SimpleGrid
        columns={{ base: 2, sm: 3, md: 4, lg: 5, xl: 6 }}
        spacing={{ base: 4, md: 6 }}
      >
        {playlists.map(p => (
          <PlaylistCard key={p.id} playlist={p} />
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default PlaylistSelection;