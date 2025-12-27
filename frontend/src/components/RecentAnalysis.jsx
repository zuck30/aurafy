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
  Divider,
  Image,
  keyframes,
  Grid,
  GridItem,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useToast,
} from '@chakra-ui/react';
import {
  FaArrowLeft,
  FaMusic,
  FaShareAlt,
  FaWhatsapp,
  FaInstagram,
  FaTwitter,
  FaCopy,
  FaCheck,
  FaFacebook,
  FaFire,
  FaHeart,
  FaMountain,
  FaBolt,
  FaDownload,
  FaSpotify,
  FaVolumeUp,
  FaStar,
  FaTachometerAlt,
  FaHistory,
} from 'react-icons/fa';
import { useAuth } from '../App';
import { analyzeRecent } from '../api';
import logo from './aurafy.png';
import html2canvas from 'html2canvas';

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-8px); }
`;

const FeatureProgress = ({ label, value, icon }) => {
  const IconComponent = icon;
  const percentage = (value * 100).toFixed(0);
  
  return (
    <Box
      bg="rgba(18, 18, 18, 0.7)"
      borderRadius="xl"
      p={5}
      border="1px solid"
      borderColor="rgba(255, 255, 255, 0.1)"
      backdropFilter="blur(10px)"
      transition="all 0.3s"
      _hover={{
        transform: 'translateY(-4px)',
        borderColor: '#1DB954',
        boxShadow: '0 10px 30px rgba(29, 185, 84, 0.2)',
      }}
    >
      <HStack spacing={4} mb={4}>
        <Box
          p={2}
          bg="rgba(29, 185, 84, 0.1)"
          borderRadius="lg"
          border="1px solid rgba(29, 185, 84, 0.3)"
        >
          <Icon as={IconComponent} color="#1DB954" boxSize={5} />
        </Box>
        <VStack align="start" spacing={0} flex={1}>
          <Text
            textTransform="uppercase"
            fontWeight="600"
            color="#FFFFFF"
            fontSize="sm"
            letterSpacing="0.5px"
          >
            {label}
          </Text>
          <Badge
            bg="#1DB954"
            color="black"
            fontSize="xs"
            px={3}
            py={1}
            borderRadius="full"
            fontWeight="bold"
          >
            {percentage}%
          </Badge>
        </VStack>
      </HStack>
      <Progress
        value={value * 100}
        colorScheme="green"
        size="sm"
        borderRadius="full"
        bg="rgba(255, 255, 255, 0.1)"
        sx={{
          '& > div': {
            bg: 'linear-gradient(90deg, #1DB954, #1ed760)',
            transition: 'width 1s ease',
            boxShadow: '0 0 10px rgba(29,185,84,0.4)',
          },
        }}
      />
    </Box>
  );
};

const ShareModal = ({ isOpen, onClose, auraData, avgFeatures }) => {
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const toast = useToast();
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareText = `🎵 My Spotify Music Aura is "${auraData.name}"! Check out your musical vibe with Aurafy.`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast({
      title: "Link copied!",
      description: "Share link copied to clipboard",
      status: "success",
      duration: 2000,
      isClosable: true,
      position: "top",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const shareToWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`, '_blank');
  };

  const shareToInstagram = () => {
    navigator.clipboard.writeText(shareText + ' ' + shareUrl);
    toast({
      title: "Link copied!",
      description: "Paste it in your Instagram story or post",
      status: "info",
      duration: 3000,
      isClosable: true,
      position: "top",
    });
  };

  const shareToTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, '_blank');
  };

  const shareToFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`, '_blank');
  };

  const downloadAsImage = async () => {
    setDownloading(true);
    let offscreenDiv = null;

    try {
      // Mobile-optimized dimensions (9:16 aspect ratio for stories)
      const width = 1080; // Standard mobile width
      const height = 1920; // Standard mobile height
      
      offscreenDiv = document.createElement('div');
      offscreenDiv.style.position = 'fixed';
      offscreenDiv.style.left = '-9999px';
      offscreenDiv.style.top = '-9999px';
      offscreenDiv.style.width = `${width}px`;
      offscreenDiv.style.height = `${height}px`;
      offscreenDiv.style.background = 'linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 50%, #0f0f0f 100%)';
      offscreenDiv.style.borderRadius = '32px';
      offscreenDiv.style.color = 'white';
      offscreenDiv.style.fontFamily = '"Circular Std", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      offscreenDiv.style.boxShadow = '0 40px 100px rgba(0,0,0,0.8)';
      offscreenDiv.style.overflow = 'hidden';
      offscreenDiv.style.display = 'flex';
      offscreenDiv.style.flexDirection = 'column';

      const content = `
        <div style="flex: 1; display: flex; flex-direction: column; justify-content: space-between; padding: 60px 40px; height: 100%;">
          <!-- Top Section: Logo and Title -->
          <div style="text-align: center; margin-bottom: 40px;">
            <div style="display: flex; align-items: center; justify-content: center; gap: 15px; margin-bottom: 30px;">
              <div style="width: 50px; height: 50px; border-radius: 14px; background: linear-gradient(135deg, #1DB954, #1ed760); display: flex; align-items: center; justify-content: center; box-shadow: 0 8px 25px rgba(29,185,84,0.4);">
                <svg width="25" height="25" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="white"/>
                </svg>
              </div>
              <div style="font-size: 28px; font-weight: 700; color: #1DB954; letter-spacing: 2px;">
                AURAFY
              </div>
            </div>
            <div style="font-size: 18px; color: #b3b3b3; letter-spacing: 1px; margin-bottom: 20px;">
              RECENT LISTENING ANALYSIS
            </div>
          </div>

          <!-- Recent Listening Highlight -->
          <div style="display: flex; flex-direction: column; align-items: center; gap: 25px; margin-bottom: 40px;">
            <div style="width: 200px; height: 200px; border-radius: 24px; overflow: hidden; background: linear-gradient(135deg, #1DB954, #1ed760); display: flex; align-items: center; justify-content: center; box-shadow: 0 20px 50px rgba(29,185,84,0.4);">
              <svg width="80" height="80" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
              </svg>
            </div>
            
            <div style="text-align: center;">
              <div style="font-size: 22px; color: #1DB954; font-weight: 600; letter-spacing: 1px; margin-bottom: 15px;">
                YOUR RECENT MUSIC VIBE
              </div>
              <div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; margin-bottom: 20px;">
                <div style="background: rgba(29,185,84,0.1); border: 1px solid rgba(29,185,84,0.3); padding: 6px 16px; border-radius: 999px; font-size: 14px; font-weight: 600; color: #1DB954;">
                  Recent Tracks
                </div>
                <div style="background: rgba(29,185,84,0.1); border: 1px solid rgba(29,185,84,0.3); padding: 6px 16px; border-radius: 999px; font-size: 14px; font-weight: 600; color: #1DB954;">
                  Spotify Analysis
                </div>
              </div>
            </div>
          </div>

          <!-- Aura Display -->
          <div style="text-align: center; margin-bottom: 40px;">
            <div style="font-size: 18px; color: #1DB954; font-weight: 600; letter-spacing: 1.5px; margin-bottom: 15px;">
              YOUR MUSICAL AURA
            </div>
            <div style="font-size: 56px; font-weight: 900; line-height: 1; margin-bottom: 20px; color: white; letter-spacing: -1.5px; background: linear-gradient(90deg, #FFFFFF, #1DB954); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">
              ${auraData.name}
            </div>
            <div style="font-size: 20px; color: #b3b3b3; line-height: 1.5; max-width: 800px; margin: 0 auto;">
              ${auraData.description}
            </div>
          </div>

          <!-- Audio Features Grid -->
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-bottom: 40px;">
            ${avgFeatures.danceability !== undefined ? `
              <div style="background: rgba(18, 18, 18, 0.8); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 16px; padding: 20px; text-align: center; backdrop-filter: blur(8px);">
                <div style="width: 40px; height: 40px; background: rgba(29,185,84,0.1); border-radius: 10px; display: flex; align-items: center; justify-content: center; margin: 0 auto 15px; border: 1px solid rgba(29,185,84,0.3);">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="#1DB954" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 6h16v3H4zM4 15h16v3H4z"/>
                    <circle cx="7" cy="10" r="1"/>
                    <circle cx="17" cy="10" r="1"/>
                    <circle cx="7" cy="19" r="1"/>
                    <circle cx="17" cy="19" r="1"/>
                  </svg>
                </div>
                <div style="font-size: 16px; font-weight: 600; color: white; margin-bottom: 6px;">
                  Danceability
                </div>
                <div style="font-size: 28px; font-weight: 900; color: #1DB954;">
                  ${(avgFeatures.danceability * 100).toFixed(0)}%
                </div>
              </div>
            ` : ''}
            
            ${avgFeatures.energy !== undefined ? `
              <div style="background: rgba(18, 18, 18, 0.8); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 16px; padding: 20px; text-align: center; backdrop-filter: blur(8px);">
                <div style="width: 40px; height: 40px; background: rgba(29,185,84,0.1); border-radius: 10px; display: flex; align-items: center; justify-content: center; margin: 0 auto 15px; border: 1px solid rgba(29,185,84,0.3);">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="#1DB954" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11 21h-1l1-7H7.5c-.58 0-.57-.32-.38-.66.19-.34.05-.08.07-.12C8.48 10.94 10.42 7.54 13 3h1l-1 7h3.5c.49 0 .56.33.47.51l-.07.15C12.96 17.55 11 21 11 21z"/>
                  </svg>
                </div>
                <div style="font-size: 16px; font-weight: 600; color: white; margin-bottom: 6px;">
                  Energy
                </div>
                <div style="font-size: 28px; font-weight: 900; color: #1DB954;">
                  ${(avgFeatures.energy * 100).toFixed(0)}%
                </div>
              </div>
            ` : ''}
            
            ${avgFeatures.valence !== undefined ? `
              <div style="background: rgba(18, 18, 18, 0.8); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 16px; padding: 20px; text-align: center; backdrop-filter: blur(8px);">
                <div style="width: 40px; height: 40px; background: rgba(29,185,84,0.1); border-radius: 10px; display: flex; align-items: center; justify-content: center; margin: 0 auto 15px; border: 1px solid rgba(29,185,84,0.3);">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="#1DB954" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                  </svg>
                </div>
                <div style="font-size: 16px; font-weight: 600; color: white; margin-bottom: 6px;">
                  Positivity
                </div>
                <div style="font-size: 28px; font-weight: 900; color: #1DB954;">
                  ${(avgFeatures.valence * 100).toFixed(0)}%
                </div>
              </div>
            ` : ''}
            
            ${avgFeatures.acousticness !== undefined ? `
              <div style="background: rgba(18, 18, 18, 0.8); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 16px; padding: 20px; text-align: center; backdrop-filter: blur(8px);">
                <div style="width: 40px; height: 40px; background: rgba(29,185,84,0.1); border-radius: 10px; display: flex; align-items: center; justify-content: center; margin: 0 auto 15px; border: 1px solid rgba(29,185,84,0.3);">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="#1DB954" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
                  </svg>
                </div>
                <div style="font-size: 16px; font-weight: 600; color: white; margin-bottom: 6px;">
                  Acousticness
                </div>
                <div style="font-size: 28px; font-weight: 900; color: #1DB954;">
                  ${(avgFeatures.acousticness * 100).toFixed(0)}%
                </div>
              </div>
            ` : ''}
            
            ${avgFeatures.instrumentalness !== undefined ? `
              <div style="background: rgba(18, 18, 18, 0.8); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 16px; padding: 20px; text-align: center; backdrop-filter: blur(8px);">
                <div style="width: 40px; height: 40px; background: rgba(29,185,84,0.1); border-radius: 10px; display: flex; align-items: center; justify-content: center; margin: 0 auto 15px; border: 1px solid rgba(29,185,84,0.3);">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="#1DB954" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm2 14h-3v3h-2v-3H8v-2h3v-3h2v3h3v2zm-3-7V3.5L18.5 9H13z"/>
                  </svg>
                </div>
                <div style="font-size: 16px; font-weight: 600; color: white; margin-bottom: 6px;">
                  Instrumentalness
                </div>
                <div style="font-size: 28px; font-weight: 900; color: #1DB954;">
                  ${(avgFeatures.instrumentalness * 100).toFixed(0)}%
                </div>
              </div>
            ` : ''}
            
            ${avgFeatures.tempo !== undefined ? `
              <div style="background: rgba(18, 18, 18, 0.8); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 16px; padding: 20px; text-align: center; backdrop-filter: blur(8px);">
                <div style="width: 40px; height: 40px; background: rgba(29,185,84,0.1); border-radius: 10px; display: flex; align-items: center; justify-content: center; margin: 0 auto 15px; border: 1px solid rgba(29,185,84,0.3);">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="#1DB954" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 8v8l5-4-5-4zm11-5v18h-18v-18h18zm-2 16v-14h-14v14h14z"/>
                  </svg>
                </div>
                <div style="font-size: 16px; font-weight: 600; color: white; margin-bottom: 6px;">
                  Tempo
                </div>
                <div style="font-size: 28px; font-weight: 900; color: #1DB954;">
                  ${avgFeatures.tempo.toFixed(0)} BPM
                </div>
              </div>
            ` : ''}
          </div>

          <!-- Footer -->
          <div style="text-align: center; padding-top: 30px; border-top: 1px solid rgba(255,255,255,0.1);">
            <div style="font-size: 18px; font-weight: 700; color: #1DB954; letter-spacing: 0.5px; margin-bottom: 10px;">
              aurafy.app
            </div>
            <div style="font-size: 14px; color: #666; letter-spacing: 0.5px;">
              Powered by Spotify • Discover Your Music Aura
            </div>
          </div>
        </div>
      `;

      offscreenDiv.innerHTML = content;
      document.body.appendChild(offscreenDiv);

      await new Promise(resolve => setTimeout(resolve, 500));

      const canvas = await html2canvas(offscreenDiv, {
        scale: 3, // High resolution for mobile
        useCORS: true,
        backgroundColor: null,
        logging: false,
        width: width,
        height: height,
        onclone: (clonedDoc) => {
          const div = clonedDoc.querySelector('div');
          if (div) {
            div.style.visibility = 'visible';
          }
        },
        imageTimeout: 15000,
      });

      const link = document.createElement('a');
      const fileName = `aura-recent-${auraData.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}.png`;
      link.download = fileName;
      link.href = canvas.toDataURL('image/png', 1.0);
      link.click();

      toast({
        title: "Image saved!",
        description: "Perfect for sharing",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Image generation error:', error);
      toast({
        title: "Failed to generate image",
        description: "Please try again or take a screenshot",
        status: "error",
        duration: 4000,
      });
    } finally {
      setDownloading(false);
      if (offscreenDiv && document.body.contains(offscreenDiv)) {
        document.body.removeChild(offscreenDiv);
      }
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      isCentered
      closeOnOverlayClick={true}
      closeOnEsc={true}
      motionPreset="slideInBottom"
    >
      <ModalOverlay bg="blackAlpha.800" backdropFilter="blur(20px)" />
      <ModalContent
        bg="rgba(18, 18, 18, 0.95)"
        border="1px solid rgba(255, 255, 255, 0.1)"
        backdropFilter="blur(30px)"
        borderRadius="2xl"
        mx={4}
        maxW="600px"
      >
        <ModalHeader color="white" borderBottom="1px solid rgba(255, 255, 255, 0.1)" fontSize="2xl" fontWeight="900">
          Share Your Music Aura
        </ModalHeader>
        <ModalCloseButton
          color="white"
          _hover={{ bg: 'rgba(255, 255, 255, 0.1)' }}
          size="lg"
        />
        <ModalBody py={8}>
          <VStack spacing={8}>
            {/* Preview Section */}
            <Card
              bg="rgba(18, 18, 18, 0.7)"
              borderRadius="2xl"
              border="1px solid rgba(255, 255, 255, 0.1)"
              backdropFilter="blur(20px)"
              w="full"
              overflow="hidden"
            >
              <CardBody p={6}>
                <VStack spacing={4} align="center">
                  <Box
                    w="80px"
                    h="80px"
                    borderRadius="xl"
                    bgGradient="linear(to-br, #1DB954, #1ed760)"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Icon as={FaHistory} color="white" boxSize={8} />
                  </Box>
                  <Text color="#1DB954" fontSize="sm" fontWeight="600" letterSpacing="1px">
                    PREVIEW
                  </Text>
                  <Heading size="lg" color="white" textAlign="center">
                    Recent Listening
                  </Heading>
                  <Text color="gray.300" fontSize="md" textAlign="center">
                    Aura: <Badge bg="#1DB954" color="black" fontSize="md" px={3} py={1} borderRadius="full" fontWeight="bold">{auraData.name}</Badge>
                  </Text>
                </VStack>
              </CardBody>
            </Card>

            <Text color="gray.300" textAlign="center" fontSize="md">
              Share your unique music vibe with friends!
            </Text>

            {/* Social Sharing Grid */}
            <Grid templateColumns="repeat(3, 1fr)" gap={6} w="full">
              <VStack spacing={2}>
                <IconButton
                  aria-label="Share to Instagram"
                  icon={<FaInstagram />}
                  size="lg"
                  w="70px"
                  h="70px"
                  bg="rgba(225, 48, 108, 0.15)"
                  color="#E1306C"
                  border="2px solid rgba(225, 48, 108, 0.3)"
                  borderRadius="xl"
                  _hover={{ 
                    bg: '#E1306C', 
                    color: 'white', 
                    transform: 'scale(1.1)',
                    boxShadow: '0 10px 30px rgba(225, 48, 108, 0.4)'
                  }}
                  onClick={shareToInstagram}
                />
                <Text fontSize="xs" color="gray.400" fontWeight="500">Instagram</Text>
              </VStack>

              <VStack spacing={2}>
                <IconButton
                  aria-label="Download Image"
                  icon={downloading ? <Spinner size="sm" /> : <FaDownload />}
                  size="lg"
                  w="70px"
                  h="70px"
                  bg="rgba(255, 193, 7, 0.15)"
                  color="#FFC107"
                  border="2px solid rgba(255, 193, 7, 0.3)"
                  borderRadius="xl"
                  _hover={{ 
                    bg: '#FFC107', 
                    color: 'black', 
                    transform: 'scale(1.1)',
                    boxShadow: '0 10px 30px rgba(255, 193, 7, 0.4)'
                  }}
                  onClick={downloadAsImage}
                  isLoading={downloading}
                  loadingText="Creating..."
                  disabled={downloading}
                />
                <Text fontSize="xs" color="gray.400" fontWeight="500">Share Image</Text>
              </VStack>

              <VStack spacing={2}>
                <IconButton
                  aria-label="Copy Link"
                  icon={copied ? <FaCheck /> : <FaCopy />}
                  size="lg"
                  w="70px"
                  h="70px"
                  bg="rgba(29, 185, 84, 0.15)"
                  color="#1DB954"
                  border="2px solid rgba(29, 185, 84, 0.3)"
                  borderRadius="xl"
                  _hover={{ 
                    bg: '#1DB954', 
                    color: 'white', 
                    transform: 'scale(1.1)',
                    boxShadow: '0 10px 30px rgba(29, 185, 84, 0.4)'
                  }}
                  onClick={handleCopyLink}
                />
                <Text fontSize="xs" color="gray.400" fontWeight="500">Copy Link</Text>
              </VStack>

              <VStack spacing={2}>
                <IconButton
                  aria-label="Share to WhatsApp"
                  icon={<FaWhatsapp />}
                  size="lg"
                  w="70px"
                  h="70px"
                  bg="rgba(37, 211, 102, 0.15)"
                  color="#25D366"
                  border="2px solid rgba(37, 211, 102, 0.3)"
                  borderRadius="xl"
                  _hover={{ 
                    bg: '#25D366', 
                    color: 'white', 
                    transform: 'scale(1.1)',
                    boxShadow: '0 10px 30px rgba(37, 211, 102, 0.4)'
                  }}
                  onClick={shareToWhatsApp}
                />
                <Text fontSize="xs" color="gray.400" fontWeight="500">WhatsApp</Text>
              </VStack>

              <VStack spacing={2}>
                <IconButton
                  aria-label="Share to Twitter"
                  icon={<FaTwitter />}
                  size="lg"
                  w="70px"
                  h="70px"
                  bg="rgba(29, 161, 242, 0.15)"
                  color="#1DA1F2"
                  border="2px solid rgba(29, 161, 242, 0.3)"
                  borderRadius="xl"
                  _hover={{ 
                    bg: '#1DA1F2', 
                    color: 'white', 
                    transform: 'scale(1.1)',
                    boxShadow: '0 10px 30px rgba(29, 161, 242, 0.4)'
                  }}
                  onClick={shareToTwitter}
                />
                <Text fontSize="xs" color="gray.400" fontWeight="500">Twitter</Text>
              </VStack>

              <VStack spacing={2}>
                <IconButton
                  aria-label="Share to Facebook"
                  icon={<FaFacebook />}
                  size="lg"
                  w="70px"
                  h="70px"
                  bg="rgba(24, 119, 242, 0.15)"
                  color="#1877F2"
                  border="2px solid rgba(24, 119, 242, 0.3)"
                  borderRadius="xl"
                  _hover={{ 
                    bg: '#1877F2', 
                    color: 'white', 
                    transform: 'scale(1.1)',
                    boxShadow: '0 10px 30px rgba(24, 119, 242, 0.4)'
                  }}
                  onClick={shareToFacebook}
                />
                <Text fontSize="xs" color="gray.400" fontWeight="500">Facebook</Text>
              </VStack>
            </Grid>

            {/* Image Info Box */}
            <Box
              bg="rgba(29, 185, 84, 0.05)"
              p={4}
              borderRadius="xl"
              border="1px solid rgba(29, 185, 84, 0.2)"
              w="full"
            >
              <VStack spacing={2} align="start">
                <Text color="#1DB954" fontSize="sm" fontWeight="600">
                  Beautiful shareable image includes:
                </Text>
                <HStack spacing={2} flexWrap="wrap">
                  <Badge bg="rgba(29, 185, 84, 0.1)" color="#1DB954" fontSize="xs" px={2} py={1} borderRadius="full">Music Aura</Badge>
                  <Badge bg="rgba(29, 185, 84, 0.1)" color="#1DB954" fontSize="xs" px={2} py={1} borderRadius="full">Audio Features</Badge>
                  <Badge bg="rgba(29, 185, 84, 0.1)" color="#1DB954" fontSize="xs" px={2} py={1} borderRadius="full">Recent Tracks</Badge>
                  <Badge bg="rgba(29, 185, 84, 0.1)" color="#1DB954" fontSize="xs" px={2} py={1} borderRadius="full">Mobile Optimized</Badge>
                </HStack>
              </VStack>
            </Box>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

const RecentAnalysis = () => {
  const { token } = useAuth();
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  useEffect(() => {
    const performAnalysis = async () => {
      if (!token) {
        setError("Please log in to view your music aura.");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setError(null);
        const res = await analyzeRecent(token);
        console.log('Analysis Data:', res.data);
        if (res.data && res.data.analysis) {
          setAnalysis(res.data);
        } else {
          setError("Unexpected data format received from server.");
        }
      } catch (err) {
        console.error('Analysis error:', err);
        setError(err.response?.data?.detail?.error?.message || "Failed to analyze recent tracks. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    performAnalysis();
  }, [token]);

  if (loading) {
    return (
      <Center minH="100vh" bg="#000">
        <VStack spacing={8}>
          <Box
            w="80px"
            h="80px"
            animation={`${float} 3s ease-in-out infinite`}
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
          <VStack spacing={4}>
            <Spinner size="xl" color="#1DB954" thickness="4px" />
            <Heading
              size="lg"
              fontWeight="900"
              letterSpacing="-1px"
              bgGradient="linear(to-r, white, #1db954)"
              bgClip="text"
            >
              Analyzing Your Music Aura
            </Heading>
            <Text color="gray.400" fontSize="md">
              Scanning your recent listening patterns...
            </Text>
          </VStack>
        </VStack>
      </Center>
    );
  }

  if (error || !analysis?.analysis) {
    return (
      <Center minH="100vh" bg="#000" p={6}>
        <VStack spacing={8} maxW="500px" textAlign="center">
          <Icon as={FaMusic} color="#1DB954" boxSize={12} />
          <Heading size="xl" fontWeight="900" color="white">
            Unable to Load Analysis
          </Heading>
          <Text color="gray.300" fontSize="lg">
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
            _hover={{ bg: '#1ed760', transform: 'scale(1.05)' }}
            transition="all 0.3s"
          >
            Back to Dashboard
          </Button>
        </VStack>
      </Center>
    );
  }

  const { aura, avg_features } = analysis.analysis;
  const auraName = aura?.name || "Unknown Vibe";
  const auraDescription = aura?.description || "Your musical aura is still forming...";
  const auraColor = aura?.color || "#1DB954";

  return (
    <Box
      bg="#000"
      minH="100vh"
      p={{ base: 4, md: 8 }}
      color="#FFFFFF"
      fontFamily="'Circular Std', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    >
      {/* Navigation */}
      <Flex justify="space-between" align="center" mb={{ base: 8, md: 12 }}>
        <Button
          as={RouterLink}
          to="/"
          leftIcon={<Icon as={FaArrowLeft} />}
          variant="ghost"
          color="#B3B3B3"
          _hover={{ color: '#1DB954', bg: 'rgba(29, 185, 84, 0.1)' }}
          size="lg"
        >
          Back
        </Button>
        
        <Button
          leftIcon={<Icon as={FaShareAlt} />}
          bg="rgba(29, 185, 84, 0.1)"
          color="#1DB954"
          border="1px solid rgba(29, 185, 84, 0.3)"
          _hover={{ bg: '#1DB954', color: 'black', transform: 'scale(1.05)' }}
          size="lg"
          onClick={() => setIsShareModalOpen(true)}
        >
          Share Aura
        </Button>
      </Flex>

      {/* Main Content */}
      <VStack spacing={{ base: 10, md: 12 }} maxW="1200px" mx="auto">
        <VStack spacing={4} textAlign="center">
          <Box
            w="60px"
            h="60px"
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
          <Heading
            size={{ base: '2xl', md: '3xl' }}
            fontWeight="900"
            letterSpacing="-1px"
            bgGradient="linear(to-r, white, #1db954)"
            bgClip="text"
          >
            Your Music Aura
          </Heading>
          <Text color="#B3B3B3" fontSize="lg">
            Based on your recent Spotify listening
          </Text>
        </VStack>

        <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={{ base: 8, md: 12 }} w="full" alignItems="stretch">
          <GridItem display="flex">
            <Card
              bg="rgba(18, 18, 18, 0.9)"
              borderRadius="2xl"
              border="1px solid rgba(255, 255, 255, 0.1)"
              backdropFilter="blur(20px)"
              boxShadow="0 20px 40px -12px rgba(0, 0, 0, 0.8)"
              transition="all 0.3s"
              _hover={{ transform: 'translateY(-8px)', boxShadow: '0 30px 60px rgba(29, 185, 84, 0.15)' }}
              flex="1"
              display="flex"
              flexDirection="column"
            >
              <CardBody p={{ base: 6, md: 8 }} display="flex" flexDirection="column" flex="1">
                <VStack spacing={6} align="start" flex="1">
                  <VStack spacing={4} align="start" w="full">
                    <HStack spacing={3}>
                      <Icon as={FaMusic} color="#1DB954" boxSize={6} />
                      <Text
                        fontSize="sm"
                        color="gray.400"
                        fontWeight="600"
                        letterSpacing="1px"
                        textTransform="uppercase"
                      >
                        Your Current Vibe
                      </Text>
                    </HStack>
                    
                    <Divider borderColor="rgba(255, 255, 255, 0.1)" />
                    
                    <Heading
                      size="2xl"
                      fontWeight="900"
                      color="white"
                      lineHeight="1.2"
                      bgGradient="linear(to-r, white, #1db954)"
                      bgClip="text"
                    >
                      {auraName}
                    </Heading>
                    <Text
                      fontSize="lg"
                      color="gray.300"
                      lineHeight="1.8"
                      flex="1"
                    >
                      {auraDescription}
                    </Text>
                    
                    <HStack spacing={3} mt={4}>
                      <Box
                        width="60px"
                        height="60px"
                        borderRadius="xl"
                        bg={auraColor}
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        boxShadow={`0 10px 30px ${auraColor}80`}
                      >
                        <Icon as={FaStar} color="white" boxSize={8} />
                      </Box>
                      
                      <VStack align="start" spacing={1}>
                        <Text color="#1DB954" fontSize="sm" fontWeight="600">
                          Dominant Features
                        </Text>
                        <HStack spacing={2}>
                          {avg_features.danceability > 0.7 && (
                            <Badge bg="rgba(29,185,84,0.1)" color="#1DB954" fontSize="xs" px={2} py={1} borderRadius="full">Danceable</Badge>
                          )}
                          {avg_features.energy > 0.7 && (
                            <Badge bg="rgba(29,185,84,0.1)" color="#1DB954" fontSize="xs" px={2} py={1} borderRadius="full">Energetic</Badge>
                          )}
                          {avg_features.valence > 0.7 && (
                            <Badge bg="rgba(29,185,84,0.1)" color="#1DB954" fontSize="xs" px={2} py={1} borderRadius="full">Positive</Badge>
                          )}
                          {avg_features.acousticness > 0.7 && (
                            <Badge bg="rgba(29,185,84,0.1)" color="#1DB954" fontSize="xs" px={2} py={1} borderRadius="full">Acoustic</Badge>
                          )}
                        </HStack>
                      </VStack>
                    </HStack>
                    
                    <HStack spacing={3}>
                      <Badge
                        bg="rgba(29, 185, 84, 0.1)"
                        color="#1DB954"
                        fontSize="sm"
                        px={4}
                        py={2}
                        borderRadius="full"
                        border="1px solid rgba(29, 185, 84, 0.3)"
                      >
                        Spotify Powered
                      </Badge>
                      <Badge
                        bg="rgba(29, 185, 84, 0.1)"
                        color="#1DB954"
                        fontSize="sm"
                        px={4}
                        py={2}
                        borderRadius="full"
                        border="1px solid rgba(29, 185, 84, 0.3)"
                      >
                        Recent Activity
                      </Badge>
                    </HStack>
                  </VStack>
                </VStack>
              </CardBody>
            </Card>
          </GridItem>

          <GridItem display="flex">
            <Card
              bg="rgba(18, 18, 18, 0.9)"
              borderRadius="2xl"
              border="1px solid rgba(255, 255, 255, 0.1)"
              backdropFilter="blur(20px)"
              boxShadow="0 20px 40px -12px rgba(0, 0, 0, 0.8)"
              transition="all 0.3s"
              _hover={{ transform: 'translateY(-8px)', boxShadow: '0 30px 60px rgba(29, 185, 84, 0.15)' }}
              flex="1"
              display="flex"
              flexDirection="column"
            >
              <CardBody p={{ base: 6, md: 8 }} display="flex" flexDirection="column" flex="1">
                <VStack spacing={6} align="start" flex="1">
                  <VStack spacing={4} align="start" w="full">
                    <HStack spacing={3}>
                      <Icon as={FaBolt} color="#1DB954" boxSize={6} />
                      <Text
                        fontSize="sm"
                        color="gray.400"
                        fontWeight="600"
                        letterSpacing="1px"
                        textTransform="uppercase"
                      >
                        Audio Features
                      </Text>
                    </HStack>
                    
                    <Divider borderColor="rgba(255, 255, 255, 0.1)" />
                    
                    <Text color="gray.300" fontSize="md">
                      Average characteristics of your recent tracks
                    </Text>
                  </VStack>

                  {Object.keys(avg_features).length > 0 ? (
                    <VStack spacing={4} w="full" flex="1">
                      {avg_features.danceability !== undefined && (
                        <FeatureProgress
                          label="Danceability"
                          value={avg_features.danceability}
                          icon={FaFire}
                        />
                      )}
                      {avg_features.energy !== undefined && (
                        <FeatureProgress
                          label="Energy"
                          value={avg_features.energy}
                          icon={FaBolt}
                        />
                      )}
                      {avg_features.valence !== undefined && (
                        <FeatureProgress
                          label="Positivity"
                          value={avg_features.valence}
                          icon={FaHeart}
                        />
                      )}
                      {avg_features.acousticness !== undefined && (
                        <FeatureProgress
                          label="Acousticness"
                          value={avg_features.acousticness}
                          icon={FaMountain}
                        />
                      )}
                      {avg_features.instrumentalness !== undefined && (
                        <FeatureProgress
                          label="Instrumentalness"
                          value={avg_features.instrumentalness}
                          icon={FaVolumeUp}
                        />
                      )}
                      {avg_features.tempo !== undefined && (
                        <Box
                          bg="rgba(18, 18, 18, 0.7)"
                          borderRadius="xl"
                          p={5}
                          border="1px solid"
                          borderColor="rgba(255, 255, 255, 0.1)"
                          backdropFilter="blur(10px)"
                          transition="all 0.3s"
                          _hover={{
                            transform: 'translateY(-4px)',
                            borderColor: '#1DB954',
                            boxShadow: '0 10px 30px rgba(29, 185, 84, 0.2)',
                          }}
                          w="full"
                        >
                          <HStack spacing={4} mb={4}>
                            <Box
                              p={2}
                              bg="rgba(29, 185, 84, 0.1)"
                              borderRadius="lg"
                              border="1px solid rgba(29, 185, 84, 0.3)"
                            >
                              <Icon as={FaTachometerAlt} color="#1DB954" boxSize={5} />
                            </Box>
                            <VStack align="start" spacing={0} flex={1}>
                              <Text
                                textTransform="uppercase"
                                fontWeight="600"
                                color="#FFFFFF"
                                fontSize="sm"
                                letterSpacing="0.5px"
                              >
                                Tempo
                              </Text>
                              <Badge
                                bg="#1DB954"
                                color="black"
                                fontSize="xs"
                                px={3}
                                py={1}
                                borderRadius="full"
                                fontWeight="bold"
                              >
                                {avg_features.tempo.toFixed(0)} BPM
                              </Badge>
                            </VStack>
                          </HStack>
                          <Progress
                            value={Math.min(avg_features.tempo, 200) / 2}
                            colorScheme="green"
                            size="sm"
                            borderRadius="full"
                            bg="rgba(255, 255, 255, 0.1)"
                            sx={{
                              '& > div': {
                                bg: 'linear-gradient(90deg, #1DB954, #1ed760)',
                                transition: 'width 1s ease',
                                boxShadow: '0 0 10px rgba(29,185,84,0.4)',
                              },
                            }}
                          />
                        </Box>
                      )}
                    </VStack>
                  ) : (
                    <Center w="full" py={8} flex="1">
                      <VStack spacing={4}>
                        <Icon as={FaMusic} color="gray.500" boxSize={12} />
                        <Text color="gray.400" fontSize="lg" textAlign="center">
                          No audio features available yet
                        </Text>
                      </VStack>
                    </Center>
                  )}
                </VStack>
              </CardBody>
            </Card>
          </GridItem>
        </Grid>
      </VStack>

      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        auraData={{ name: auraName, description: auraDescription, color: auraColor }}
        avgFeatures={avg_features || {}}
      />
    </Box>
  );
};

export default RecentAnalysis;