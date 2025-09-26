import React from 'react';
import { Box, Button, Center, Heading, Text, VStack, Image, Icon } from '@chakra-ui/react';
import { FaSpotify } from 'react-icons/fa';
import logo from './aurafy.png'; 

const LOGIN_URL = '/api/login';

const Login = () => {
  return (
    <Box
      minH="100vh"
      w="100vw"
      overflow="hidden"
      position="relative"
      fontFamily="'Circular', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    >
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
        allow="autoplay; encrypted-media"
      />

      {/* Background Pattern */}
      <Box
        position="absolute"
        top="0"
        left="0"
        right="0"
        bottom="0"
     
        animation="float 20s ease-in-out infinite"
        sx={{
          '@keyframes float': {
            '0%, 100%': { transform: 'translateY(0px)' },
            '50%': { transform: 'translateY(-20px)' },
          },
        }}
      />

      {/* Overlay */}
      <Box
        position="absolute"
        top="0"
        left="0"
        w="100%"
        h="100%"
        bg="blackAlpha.700"
        backdropFilter="blur(12px)"
      />

      <Center h="100vh" px={{ base: 4, md: 6 }}>
        <Box
          p={{ base: 6, md: 10 }}
          maxW="md"
          w="full"
          bg="rgba(18, 18, 18, 0.95)"
          backdropFilter="blur(20px)"
          borderRadius="3xl"
          boxShadow="0 20px 60px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255, 255, 255, 0.1)"
          textAlign="center"
          border="1px solid"
          borderColor="whiteAlpha.200"
          position="relative"
          overflow="hidden"
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
          <VStack spacing={8}>
            {/* Logo Section */}
            <Box
              w={{ base: '100px', md: '120px' }}
              h={{ base: '100px', md: '120px' }}
              mx="auto"
            >
              <Image
                src={logo}
                alt="Aurafy Logo"
                w="100%"
                h="100%"
                objectFit="contain"
              />
            </Box>

            <Heading
              as="h1"
              size={{ base: '2xl', md: '3xl' }}
              fontWeight="900"
              letterSpacing="-1px"
              color="white"
            >
              Aurafy
            </Heading>

            {/* Content Section */}
            <VStack spacing={4}>
              <Text
                fontSize={{ base: 'md', md: 'lg' }}
                color="white"
                fontWeight="700"
              >
                Discover the <Text as="span" color="#1ed760">aura</Text> of your Spotify playlists
              </Text>
              <Text fontSize="sm" color="gray.300" lineHeight="1.6">
                Connect your Spotify account to unlock a vibrant, personalized experience.
              </Text>
            </VStack>

            {/* Login Section */}
            <Button
              as="a"
              href={LOGIN_URL}
              size="lg"
              w="full"
              bg="#1db954"
              color="white"
              leftIcon={<Icon as={FaSpotify} boxSize={6} />}
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
              Continue with Spotify
            </Button>

            {/* Footer Section */}
            <Text fontSize="xs" color="gray.400" pt={4}>
              By continuing, you agree to our{' '}
              <Text as="span" color="#1db954" _hover={{ textDecor: 'underline' }}>
                non-existent Terms of Service
              </Text>.
            </Text>
          </VStack>
        </Box>
      </Center>
    </Box>
  );
};

export default Login;