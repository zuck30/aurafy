import React from 'react';
import { Box, Button, Center, Heading, Text, VStack, Icon } from '@chakra-ui/react';
import { FaSpotify } from 'react-icons/fa';

const LOGIN_URL = 'http://localhost:8000/api/login';

const Login = () => {
  return (
    <Box position="relative" h="100vh" w="100vw" overflow="hidden">
      {/* Background Video */}
      <Box
        as="iframe"
        src="https://www.youtube.com/embed/V9PVRfjEBTI?autoplay=1&mute=1&loop=1&playlist=V9PVRfjEBTI&controls=0&showinfo=0&autohide=1&modestbranding=1"
        position="absolute"
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
        w="120%"
        h="120%"
        pointerEvents="none"
        zIndex="-1"
      />

      {/* Overlay */}
      <Box position="absolute" top="0" left="0" w="100%" h="100%" bg="blackAlpha.600" />

      <Center position="relative" h="100%" px={4}>
        <Box
          p={{ base: 6, md: 10 }}
          maxW="md"
          w="full"
          bg="whiteAlpha.100"
          backdropFilter="blur(10px)"
          borderRadius="xl"
          boxShadow="lg"
          textAlign="center"
          border="1px solid"
          borderColor="whiteAlpha.200"
        >
          <VStack spacing={6}>
            <Heading as="h1" size="2xl" color="white" fontWeight="bold">
              Aurafy
            </Heading>
            <Text fontSize="lg" color="gray.200">
              Discover the hidden aura of your Spotify playlists.
            </Text>
            <Text color="gray.300">
              Connect your Spotify account to get started.
            </Text>

            <Button
              as="a"
              href={LOGIN_URL}
              size="lg"
              w="full"
              colorScheme="green"
              leftIcon={<Icon as={FaSpotify} />}
              _hover={{ bg: 'green.500' }}
            >
              Continue with Spotify
            </Button>

            <Text fontSize="xs" color="gray.400" pt={4}>
              By continuing, you agree to our non-existent Terms of Service.
            </Text>
          </VStack>
        </Box>
      </Center>
    </Box>
  );
};

export default Login;
