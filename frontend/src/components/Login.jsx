import React from 'react';
import { Box, Button, Center, Heading, Text, VStack, Image, Icon, keyframes } from '@chakra-ui/react';
import { FaSpotify } from 'react-icons/fa';
import logo from './aurafy.png'; 

const LOGIN_URL = 'http://127.0.0.1:8000/api/login';

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
`;

const glow = keyframes`
  0%, 100% { box-shadow: 0 0 15px rgba(29, 185, 84, 0.2); }
  50% { box-shadow: 0 0 25px rgba(29, 185, 84, 0.4); }
`;

const Login = () => {
  return (
    <Box
      minH="100vh"
      w="100vw"
      position="relative"
      fontFamily="'Circular', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
      bg="#000"
    >
      {/* Background Video */}
      <Box
        as="iframe"
        src="https://www.youtube.com/embed/V9PVRfjEBTI?autoplay=1&mute=1&loop=1&playlist=V9PVRfjEBTI&controls=0&showinfo=0&autohide=1&modestbranding=1&rel=0&playsinline=1"
        position="absolute"
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
        w="130vw"
        h="130vh"
        minW="100vw"
        minH="100vh"
        pointerEvents="none"
        zIndex="0"
        allow="autoplay; encrypted-media; fullscreen"
        frameBorder="0"
        title="Background Video"
      />

      {/* Overlay */}
      <Box
        position="absolute"
        top="0"
        left="0"
        w="100%"
        h="100%"
        bgGradient="linear(to-b, blackAlpha.800, blackAlpha.700)"
        zIndex="1"
      />

      <Center h="100vh" px={4} position="relative" zIndex="2">
        <Box
          p={{ base: 6, md: 8 }}
          maxW="400px"
          w="full"
          bg="rgba(18, 18, 18, 0.9)"
          backdropFilter="blur(20px)"
          borderRadius="2xl"
          boxShadow="0 20px 40px -12px rgba(0, 0, 0, 0.8)"
          textAlign="center"
          border="1px solid"
          borderColor="rgba(255, 255, 255, 0.1)"
          animation={`${glow} 3s ease-in-out infinite`}
          transition="all 0.3s ease"
          _hover={{
            transform: 'translateY(-4px)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.9)',
          }}
        >
          <VStack spacing={6}>
            {/* Logo */}
            <Box
              w="80px"
              h="80px"
              animation={`${float} 4s ease-in-out infinite`}
            >
              <Image
                src={logo}
                alt="Aurafy Logo"
                w="100%"
                h="100%"
                objectFit="contain"
                filter="drop-shadow(0 0 20px rgba(29,185,84,0.3))"
              />
            </Box>

            {/* Heading */}
            <VStack spacing={1}>
              <Heading
                as="h1"
                size="xl"
                fontWeight="900"
                letterSpacing="-1px"
                bgGradient="linear(to-r, white, #1db954)"
                bgClip="text"
              >
                Aurafy
              </Heading>
              
              <Text
                fontSize="sm"
                color="gray.400"
                fontWeight="500"
              >
                Your Music's Digital Aura
              </Text>
            </VStack>

            {/* Content Section */}
            <VStack spacing={3}>
              <Text
                fontSize="md"
                color="white"
                fontWeight="600"
              >
                Discover the <Text as="span" color="#1ed760" fontWeight="800">Aura</Text> of your Spotify playlists
              </Text>
              <VStack spacing={2} align="center">
                <Text fontSize="sm" color="gray.300">
                  Connect your Spotify to:
                </Text>
                <VStack spacing={1} align="start">
                  <Text fontSize="xs" color="#1db954">• Analyze your music taste</Text>
                  <Text fontSize="xs" color="#1db954">• Discover hidden patterns</Text>
                  <Text fontSize="xs" color="#1db954">• Get personalized insights</Text>
                </VStack>
              </VStack>
            </VStack>

            {/* Login Button */}
            <Button
              as="a"
              href={LOGIN_URL}
              size="lg"
              w="full"
              bg="#1db954"
              color="black"
              leftIcon={<Icon as={FaSpotify} boxSize={5} />}
              borderRadius="full"
              fontWeight="800"
              letterSpacing="0.5px"
              textTransform="uppercase"
              fontSize="sm"
              py={6}
              boxShadow="0 4px 15px rgba(29, 185, 84, 0.3)"
              _hover={{
                bg: '#1ed760',
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 20px rgba(29, 185, 84, 0.5)',
              }}
              _active={{ 
                transform: 'translateY(0px)',
              }}
              transition="all 0.2s ease"
            >
              Connect Spotify
            </Button>

            {/* Features */}
            <VStack spacing={2} align="center" pt={1}>
              <Text fontSize="xs" color="gray.400" fontWeight="600" letterSpacing="1px">
                FEATURES INCLUDE
              </Text>
              <Box display="flex" alignItems="center" gap={2} justifyContent="center" flexWrap="wrap">
                <FeatureBadge text="Playlist Analysis" />
                <FeatureBadge text="Music Insights" />
                <FeatureBadge text="Vibe Detection" />
              </Box>
            </VStack>

            {/* Footer */}
            <Text fontSize="xs" color="gray.500" pt={2} borderTop="1px solid" borderColor="whiteAlpha.100">
              By continuing, you agree to our{' '}
              <Text as="span" color="#1db954" cursor="pointer" _hover={{ textDecoration: 'underline' }}>
                Terms of Service
              </Text>
              {' and '}
              <Text as="span" color="#1db954" cursor="pointer" _hover={{ textDecoration: 'underline' }}>
                Privacy Policy
              </Text>
            </Text>
          </VStack>
        </Box>
      </Center>
    </Box>
  );
};

// Helper component for feature badges
const FeatureBadge = ({ text }) => (
  <Box
    px={3}
    py={1}
    bg="rgba(29, 185, 84, 0.1)"
    borderRadius="full"
    border="1px solid"
    borderColor="rgba(29, 185, 84, 0.3)"
  >
    <Text fontSize="xs" color="#1db954" fontWeight="600">
      {text}
    </Text>
  </Box>
);

export default Login;