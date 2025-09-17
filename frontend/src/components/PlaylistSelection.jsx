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
} from '@chakra-ui/react';
import { FaArrowLeft } from 'react-icons/fa';
import { getPlaylists } from '../api';
import { useAuth } from '../App';

const PlaylistCard = ({ playlist }) => (
  <RouterLink to={`/analyze/playlist/${playlist.id}`}>
    <Card
      bg={{ base: 'gray.100', _dark: 'gray.700' }}
      _hover={{ transform: 'scale(1.05)', shadow: 'lg' }}
      transition="all 0.2s"
    >
      <CardBody>
        <Image src={playlist.images[0]?.url} alt={playlist.name} borderRadius="lg" />
        <VStack mt="4" spacing="2" align="start">
          <Heading size="md">{playlist.name}</Heading>
          <Text noOfLines={2}>{playlist.description || 'No description'}</Text>
          <Text fontSize="sm" color="gray.500">{playlist.tracks.total} tracks</Text>
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
      <Center h="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  return (
    <Box p={8}>
      <Button as={RouterLink} to="/" leftIcon={<Icon as={FaArrowLeft} />} mb={8} variant="outline">
        Back to Dashboard
      </Button>
      <Heading mb={8}>Select a Playlist to Analyze</Heading>
      <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4, xl: 5 }} spacing={6}>
        {playlists.map(p => <PlaylistCard key={p.id} playlist={p} />)}
      </SimpleGrid>
    </Box>
  );
};

export default PlaylistSelection;
