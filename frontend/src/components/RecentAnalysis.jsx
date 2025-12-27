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
  useBreakpointValue,
  AspectRatio,
  Container,
  SimpleGrid,
  useDisclosure,
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
  FaHeadphones,
  FaSpotify,
  FaVolumeUp,
  FaStar,
  FaTachometerAlt,
  FaHistory,
  FaClock,
  FaPlay,
  FaChartLine,
  FaTrendingUp,
  FaRegClock,
  FaUser,
  FaCalendarAlt,
  FaEllipsisH,
} from 'react-icons/fa';
import { useAuth } from '../App';
import { analyzeRecent, analyzeTrack } from '../api';
import logo from './aurafy.png';
import html2canvas from 'html2canvas';

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-8px); }
`;

// Mobile-optimized FeatureProgress component
const FeatureProgress = ({ label, value, icon }) => {
  const IconComponent = icon;
  const percentage = (value * 100).toFixed(0);
  const isMobile = useBreakpointValue({ base: true, md: false });
  
  return (
    <Box
      bg="rgba(18, 18, 18, 0.7)"
      borderRadius="xl"
      p={{ base: 4, md: 5 }}
      border="1px solid"
      borderColor="rgba(255, 255, 255, 0.1)"
      backdropFilter="blur(10px)"
      transition="all 0.3s"
      _hover={{
        transform: { base: 'none', md: 'translateY(-4px)' },
        borderColor: '#1DB954',
        boxShadow: '0 10px 30px rgba(29, 185, 84, 0.2)',
      }}
      w="full"
    >
      <HStack spacing={{ base: 3, md: 4 }} mb={4}>
        <Box
          p={{ base: 1.5, md: 2 }}
          bg="rgba(29, 185, 84, 0.1)"
          borderRadius="lg"
          border="1px solid rgba(29, 185, 84, 0.3)"
          flexShrink={0}
        >
          <Icon as={IconComponent} color="#1DB954" boxSize={{ base: 4, md: 5 }} />
        </Box>
        <VStack align="start" spacing={0} flex={1} minW={0}>
          <Text
            textTransform="uppercase"
            fontWeight="600"
            color="#FFFFFF"
            fontSize={{ base: 'xs', md: 'sm' }}
            letterSpacing="0.5px"
            noOfLines={1}
          >
            {label}
          </Text>
          <Badge
            bg="#1DB954"
            color="black"
            fontSize={{ base: '2xs', md: 'xs' }}
            px={{ base: 2, md: 3 }}
            py={1}
            borderRadius="full"
            fontWeight="bold"
            mt={1}
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

// Mobile-optimized ShareModal
const ShareModal = ({ isOpen, onClose, auraData, avgFeatures, userDetails }) => {
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const toast = useToast();
  const isMobile = useBreakpointValue({ base: true, md: false });
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareText = `🎵 My Recent Music Aura is "${auraData.name}"! Discover your musical vibe with Aurafy.`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast({
      title: "Link copied!",
      description: "Share link copied to clipboard",
      status: "success",
      duration: 2000,
      isClosable: true,
      position: isMobile ? "bottom" : "top",
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
      position: isMobile ? "bottom" : "top",
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
      const width = 1080;
      const height = 1920;
      
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
              RECENT TRACKS ANALYSIS
            </div>
          </div>

          <!-- User Info Section -->
          <div style="text-align: center; margin-bottom: 40px;">
            <div style="font-size: 36px; font-weight: 900; color: white; line-height: 1.1; margin-bottom: 15px; letter-spacing: -0.5px;">
              ${userDetails?.display_name || 'Music Lover'}
            </div>
            <div style="font-size: 18px; color: #666; line-height: 1.4; margin-bottom: 20px;">
              Recent Listening History
            </div>
            
            <div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
              <div style="background: rgba(29,185,84,0.1); border: 1px solid rgba(29,185,84,0.3); padding: 6px 16px; border-radius: 999px; font-size: 14px; font-weight: 600; color: #1DB954;">
                ${Object.keys(avgFeatures).length} Audio Features
              </div>
              <div style="background: rgba(29,185,84,0.1); border: 1px solid rgba(29,185,84,0.3); padding: 6px 16px; border-radius: 999px; font-size: 14px; font-weight: 600; color: #1DB954;">
                Based on Recent Tracks
              </div>
            </div>
          </div>

          <!-- Aura Display -->
          <div style="text-align: center; margin-bottom: 40px;">
            <div style="font-size: 18px; color: #1DB954; font-weight: 600; letter-spacing: 1.5px; margin-bottom: 15px;">
              RECENT MUSICAL AURA
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
        scale: 3,
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
        position: isMobile ? "bottom" : "top",
      });
    } catch (error) {
      console.error('Image generation error:', error);
      toast({
        title: "Failed to generate image",
        description: "Please try again or take a screenshot",
        status: "error",
        duration: 4000,
        position: isMobile ? "bottom" : "top",
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
      size={isMobile ? "full" : "lg"}
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
        borderRadius={{ base: "none", md: "2xl" }}
        mx={0}
        maxW={{ base: "100%", md: "600px" }}
        minH={{ base: "100vh", md: "auto" }}
      >
        <ModalHeader 
          color="white" 
          borderBottom="1px solid rgba(255, 255, 255, 0.1)" 
          fontSize={{ base: "xl", md: "2xl" }} 
          fontWeight="900"
          py={{ base: 4, md: 6 }}
        >
          Share Your Recent Aura
        </ModalHeader>
        <ModalCloseButton
          color="white"
          _hover={{ bg: 'rgba(255, 255, 255, 0.1)' }}
          size="lg"
          top={{ base: 3, md: 4 }}
          right={{ base: 3, md: 4 }}
        />
        <ModalBody py={{ base: 6, md: 8 }} px={{ base: 4, md: 8 }}>
          <VStack spacing={6}>
            {/* Preview Section */}
            <Card
              bg="rgba(18, 18, 18, 0.7)"
              borderRadius="2xl"
              border="1px solid rgba(255, 255, 255, 0.1)"
              backdropFilter="blur(20px)"
              w="full"
              overflow="hidden"
            >
              <CardBody p={{ base: 4, md: 6 }}>
                <VStack spacing={4} align="center">
                  <Text color="#1DB954" fontSize={{ base: "xs", md: "sm" }} fontWeight="600" letterSpacing="1px">
                    PREVIEW
                  </Text>
                  <Heading size={{ base: "md", md: "lg" }} color="white" textAlign="center">
                    Recent Tracks Aura
                  </Heading>
                  <Text color="gray.300" fontSize={{ base: "sm", md: "md" }} textAlign="center">
                    Aura: <Badge bg="#1DB954" color="black" fontSize={{ base: "sm", md: "md" }} px={3} py={1} borderRadius="full" fontWeight="bold">{auraData.name}</Badge>
                  </Text>
                </VStack>
              </CardBody>
            </Card>

            <Text color="gray.300" textAlign="center" fontSize={{ base: "sm", md: "md" }}>
              Share your recent music vibe with friends!
            </Text>

            {/* Social Sharing Grid - Mobile optimized */}
            <SimpleGrid 
              columns={3} 
              spacing={{ base: 4, md: 6 }} 
              w="full"
            >
              {[
                { icon: FaInstagram, color: '#E1306C', label: 'Instagram', onClick: shareToInstagram },
                { icon: FaDownload, color: '#FFC107', label: downloading ? 'Saving...' : 'Save Image', onClick: downloadAsImage, disabled: downloading },
                { icon: copied ? FaCheck : FaCopy, color: copied ? '#1DB954' : '#1DB954', label: copied ? 'Copied!' : 'Copy Link', onClick: handleCopyLink },
                { icon: FaWhatsapp, color: '#25D366', label: 'WhatsApp', onClick: shareToWhatsApp },
                { icon: FaTwitter, color: '#1DA1F2', label: 'Twitter', onClick: shareToTwitter },
                { icon: FaFacebook, color: '#1877F2', label: 'Facebook', onClick: shareToFacebook },
              ].map((item, index) => (
                <VStack spacing={2} key={index}>
                  <IconButton
                    aria-label={`Share to ${item.label}`}
                    icon={item.icon === FaDownload && downloading ? <Spinner size="sm" /> : <Icon as={item.icon} />}
                    size="lg"
                    w={{ base: "60px", md: "70px" }}
                    h={{ base: "60px", md: "70px" }}
                    bg={`${item.color}15`}
                    color={item.color}
                    border="2px solid"
                    borderColor={`${item.color}30`}
                    borderRadius="xl"
                    _hover={{ 
                      bg: item.color, 
                      color: item.color === '#FFC107' ? 'black' : 'white', 
                      transform: 'scale(1.05)',
                      boxShadow: `0 10px 30px ${item.color}40`
                    }}
                    onClick={item.onClick}
                    isLoading={item.label === 'Saving...'}
                    loadingText=""
                    disabled={item.disabled}
                  />
                  <Text fontSize="xs" color="gray.400" fontWeight="500" textAlign="center">
                    {item.label}
                  </Text>
                </VStack>
              ))}
            </SimpleGrid>

            {/* Image Info Box */}
            <Box
              bg="rgba(29, 185, 84, 0.05)"
              p={4}
              borderRadius="xl"
              border="1px solid rgba(29, 185, 84, 0.2)"
              w="full"
            >
              <VStack spacing={2} align="start">
                <Text color="#1DB954" fontSize={{ base: "xs", md: "sm" }} fontWeight="600">
                  Beautiful shareable image includes:
                </Text>
                <HStack spacing={2} flexWrap="wrap">
                  <Badge bg="rgba(29, 185, 84, 0.1)" color="#1DB954" fontSize="2xs" px={2} py={1} borderRadius="full">Recent Tracks</Badge>
                  <Badge bg="rgba(29, 185, 84, 0.1)" color="#1DB954" fontSize="2xs" px={2} py={1} borderRadius="full">Audio Features</Badge>
                  <Badge bg="rgba(29, 185, 84, 0.1)" color="#1DB954" fontSize="2xs" px={2} py={1} borderRadius="full">Music Aura</Badge>
                  <Badge bg="rgba(29, 185, 84, 0.1)" color="#1DB954" fontSize="2xs" px={2} py={1} borderRadius="full">Mobile Optimized</Badge>
                </HStack>
              </VStack>
            </Box>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

// Mobile-optimized TrackAnalysisModal
const TrackAnalysisModal = ({ isOpen, onClose, track, analysis }) => {
  const [downloading, setDownloading] = useState(false);
  const toast = useToast();
  const isMobile = useBreakpointValue({ base: true, md: false });

  const downloadAsImage = async () => {
    setDownloading(true);
    let offscreenDiv = null;
    try {
      offscreenDiv = document.createElement('div');
      offscreenDiv.style.position = 'fixed';
      offscreenDiv.style.left = '-9999px';
      offscreenDiv.style.top = '-9999px';
      offscreenDiv.style.width = '1080px';
      offscreenDiv.style.height = '1920px';
      offscreenDiv.style.padding = '80px 60px';
      offscreenDiv.style.background = 'linear-gradient(180deg, #121212 0%, #1a1a1a 100%)';
      offscreenDiv.style.color = 'white';
      offscreenDiv.style.fontFamily = '"Circular Std", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      offscreenDiv.style.display = 'flex';
      offscreenDiv.style.flexDirection = 'column';
      offscreenDiv.style.justifyContent = 'center';
      offscreenDiv.style.alignItems = 'center';
      offscreenDiv.style.textAlign = 'center';

      const content = `
        <div style="margin-bottom: 48px;">
          <img src="${track.track.album.images[0]?.url || logo}" style="width: 320px; height: 320px; border-radius: 24px; box-shadow: 0 20px 60px rgba(29,185,84,0.3);" alt="Track Cover" />
        </div>
        <div style="font-size: 28px; color: #1DB954; font-weight: 700; letter-spacing: 4px; margin-bottom: 24px; text-transform: uppercase;">
          Track Music Aura
        </div>
        <div style="font-size: 90px; font-weight: 900; line-height: 1; margin-bottom: 32px; color: white;">
          ${analysis.aura?.name || "Unknown Vibe"}
        </div>
        <div style="font-size: 32px; color: #b3b3b3; line-height: 1.4; margin-bottom: 64px; max-width: 900px;">
          ${analysis.aura?.description || "No description available"}
        </div>
        <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 28px; margin-bottom: 80px; max-width: 900px;">
          ${analysis.features.danceability !== undefined ? `<div style="background: rgba(29,185,84,0.18); border: 2px solid rgba(29,185,84,0.4); padding: 16px 36px; border-radius: 999px; font-size: 24px; font-weight: 600; color: #1DB954;">Danceability: ${(analysis.features.danceability * 100).toFixed(0)}%</div>` : ''}
          ${analysis.features.energy !== undefined ? `<div style="background: rgba(29,185,84,0.18); border: 2px solid rgba(29,185,84,0.4); padding: 16px 36px; border-radius: 999px; font-size: 24px; font-weight: 600; color: #1DB954;">Energy: ${(analysis.features.energy * 100).toFixed(0)}%</div>` : ''}
          ${analysis.features.valence !== undefined ? `<div style="background: rgba(29,185,84,0.18); border: 2px solid rgba(29,185,84,0.4); padding: 16px 36px; border-radius: 999px; font-size: 24px; font-weight: 600; color: #1DB954;">Positivity: ${(analysis.features.valence * 100).toFixed(0)}%</div>` : ''}
        </div>
        <div style="margin-top: auto; padding-top: 48px; border-top: 2px solid rgba(255,255,255,0.08);">
          <div style="font-size: 22px; color: #666; letter-spacing: 1px;">
            Generated by Aurafy • aurafy.app
          </div>
        </div>
      `;

      offscreenDiv.innerHTML = content;
      document.body.appendChild(offscreenDiv);

      await new Promise(resolve => setTimeout(resolve, 400));

      const canvas = await html2canvas(offscreenDiv, {
        scale: 3,
        useCORS: true,
        backgroundColor: null,
        logging: false,
        width: 1080,
        height: 1920,
      });

      const link = document.createElement('a');
      link.download = `aurafy-track-${track.track.name.toLowerCase().replace(/\s+/g, '-')}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();

      toast({
        title: "Track aura image saved!",
        status: "success",
        duration: 3000,
        position: isMobile ? "bottom" : "top",
      });
    } catch (error) {
      console.error('Image generation error:', error);
      toast({
        title: "Failed to generate image",
        status: "error",
        duration: 4000,
        position: isMobile ? "bottom" : "top",
      });
    } finally {
      setDownloading(false);
      if (offscreenDiv && document.body.contains(offscreenDiv)) {
        document.body.removeChild(offscreenDiv);
      }
    }
  };

  if (!analysis) return null;

  const { aura, features } = analysis;

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      size={isMobile ? "full" : "md"} 
      isCentered
      motionPreset="slideInBottom"
    >
      <ModalOverlay bg="blackAlpha.800" backdropFilter="blur(20px)" />
      <ModalContent 
        bg="rgba(18, 18, 18, 0.95)" 
        borderRadius={{ base: "none", md: "2xl" }} 
        mx={0}
        maxW={{ base: "100%", md: "md" }}
        minH={{ base: "100vh", md: "auto" }}
      >
        <ModalHeader 
          color="white" 
          fontSize={{ base: "lg", md: "xl" }}
          py={{ base: 4, md: 6 }}
        >
          Track Aura: {track.track.name}
        </ModalHeader>
        <ModalCloseButton 
          color="white" 
          _hover={{ bg: 'whiteAlpha.200' }} 
          size="lg"
          top={{ base: 3, md: 4 }}
          right={{ base: 3, md: 4 }}
        />
        <ModalBody py={{ base: 4, md: 6 }} px={{ base: 4, md: 6 }}>
          <VStack spacing={{ base: 4, md: 6 }}>
            <Image
              src={track.track.album.images[0]?.url}
              alt={track.track.name}
              borderRadius="xl"
              boxSize={{ base: "150px", md: "200px" }}
              objectFit="cover"
            />
            <Heading size={{ base: "lg", md: "xl" }} color="white" textAlign="center">
              {aura?.name || "Unknown Vibe"}
            </Heading>
            <Text color="gray.300" textAlign="center" fontSize={{ base: "sm", md: "md" }}>
              {aura?.description || "No description available"}
            </Text>
            <VStack spacing={3} w="full">
              {features.danceability !== undefined && (
                <FeatureProgress label="Danceability" value={features.danceability} icon={FaFire} />
              )}
              {features.energy !== undefined && (
                <FeatureProgress label="Energy" value={features.energy} icon={FaBolt} />
              )}
              {features.valence !== undefined && (
                <FeatureProgress label="Positivity" value={features.valence} icon={FaHeart} />
              )}
              {features.acousticness !== undefined && (
                <FeatureProgress label="Acousticness" value={features.acousticness} icon={FaMountain} />
              )}
              {features.instrumentalness !== undefined && (
                <FeatureProgress label="Instrumentalness" value={features.instrumentalness} icon={FaVolumeUp} />
              )}
            </VStack>
            <Button
              colorScheme="green"
              onClick={downloadAsImage}
              isLoading={downloading}
              w="full"
              size={{ base: "md", md: "lg" }}
              leftIcon={<FaDownload />}
            >
              Save Track Aura Image
            </Button>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

// Mobile-optimized RecentAnalysis component
const RecentAnalysis = () => {
  const { token, user } = useAuth();
  const [analysis, setAnalysis] = useState(null);
  const [recentTracks, setRecentTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [trackAnalysis, setTrackAnalysis] = useState(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isTrackModalOpen, setIsTrackModalOpen] = useState(false);
  const toast = useToast();
  const isMobile = useBreakpointValue({ base: true, md: false });
  const { isOpen: isTrackMenuOpen, onOpen: onTrackMenuOpen, onClose: onTrackMenuClose } = useDisclosure();

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

        if (res.data && res.data.analysis && res.data.details?.tracks) {
          setAnalysis(res.data);
          setRecentTracks(res.data.details.tracks.items || []);
        } else {
          setError("Unexpected data format received from server.");
        }
      } catch (err) {
        console.error('Analysis error:', err);
        setError(err.response?.data?.detail?.error?.message || "Failed to analyze recent tracks.");
      } finally {
        setLoading(false);
      }
    };

    performAnalysis();
  }, [token]);

  const handleTrackClick = async (track) => {
    setSelectedTrack(track);
    setIsTrackModalOpen(true);

    try {
      const res = await analyzeTrack(token, track.track.id);
      setTrackAnalysis(res.data);
    } catch (err) {
      toast({
        title: "Failed to analyze track",
        description: "Please try again",
        status: "error",
        duration: 3000,
        position: isMobile ? "bottom" : "top",
      });
    }
  };

  if (loading) {
    return (
      <Center minH="100vh" bg="#000">
        <VStack spacing={8}>
          <Box
            w={{ base: "60px", md: "80px" }}
            h={{ base: "60px", md: "80px" }}
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
            <Spinner size={{ base: "lg", md: "xl" }} color="#1DB954" thickness="4px" />
            <Heading
              size={{ base: "md", md: "lg" }}
              fontWeight="900"
              letterSpacing="-1px"
              bgGradient="linear(to-r, white, #1db954)"
              bgClip="text"
              textAlign="center"
              px={4}
            >
              Analyzing Recent Tracks
            </Heading>
            <Text color="gray.400" fontSize={{ base: "sm", md: "md" }} textAlign="center" px={4}>
              Scanning your recent listening history...
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
          <Icon as={FaHeadphones} color="#1DB954" boxSize={{ base: 10, md: 12 }} />
          <Heading size={{ base: "lg", md: "xl" }} fontWeight="900" color="white">
            Unable to Load Analysis
          </Heading>
          <Text color="gray.300" fontSize={{ base: "md", md: "lg" }} textAlign="center">
            {error}
          </Text>
          <Button
            as={RouterLink}
            to="/"
            leftIcon={<Icon as={FaArrowLeft} />}
            size={{ base: "md", md: "lg" }}
            bg="#1DB954"
            color="black"
            borderRadius="full"
            fontWeight="bold"
            px={8}
            _hover={{ bg: '#1ed760', transform: 'scale(1.05)' }}
            transition="all 0.3s"
            w={{ base: "full", md: "auto" }}
          >
            Back to Dashboard
          </Button>
        </VStack>
      </Center>
    );
  }

  const { aura, avg_features } = analysis.analysis;
  const auraName = aura?.name || "Unknown Vibe";
  const auraDescription = aura?.description || "Your recent musical aura is still forming...";
  const auraColor = aura?.color || "#1DB954";

  // Mobile-optimized track item component
  const TrackItem = ({ item, index }) => {
    const [isHovered, setIsHovered] = useState(false);
    
    return (
      <Flex
        key={item.played_at}
        p={{ base: 3, md: 4 }}
        bg="rgba(40, 40, 40, 0.5)"
        borderRadius="xl"
        align="center"
        cursor="pointer"
        onClick={() => handleTrackClick(item)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        _hover={{ bg: 'rgba(29, 185, 84, 0.15)', transform: { base: 'none', md: 'translateX(4px)' } }}
        transition="all 0.2s"
        w="full"
        position="relative"
        overflow="hidden"
      >
        <Text 
          fontSize={{ base: "xs", md: "sm" }} 
          color="gray.500" 
          fontWeight="bold" 
          minW={{ base: "25px", md: "30px" }}
          mr={{ base: 3, md: 4 }}
        >
          {index + 1}
        </Text>
        <Image
          src={item.track.album.images[0]?.url}
          alt={item.track.name}
          boxSize={{ base: "50px", md: "60px" }}
          borderRadius="lg"
          mr={{ base: 3, md: 4 }}
          flexShrink={0}
        />
        <Box flex={1} minW={0}>
          <Text 
            fontWeight="700" 
            color="white" 
            noOfLines={1}
            fontSize={{ base: "sm", md: "md" }}
            lineHeight="tight"
          >
            {item.track.name}
          </Text>
          <Text 
            fontSize={{ base: "xs", md: "sm" }} 
            color="gray.400" 
            noOfLines={1}
            mt={{ base: 0.5, md: 1 }}
          >
            {item.track.artists.map(a => a.name).join(', ')}
          </Text>
          {isMobile && (
            <HStack spacing={2} mt={1}>
              <Badge 
                colorScheme="green" 
                variant="subtle" 
                fontSize="2xs"
                px={2}
                py={0.5}
              >
                {item.track.popularity}% popular
              </Badge>
              <Text fontSize="2xs" color="gray.500">
                {new Date(item.played_at).toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </Text>
            </HStack>
          )}
        </Box>
        {!isMobile && (
          <VStack spacing={0} align="end" ml={4} flexShrink={0}>
            <HStack spacing={2} color="gray.500">
              <Icon as={FaRegClock} boxSize={3} />
              <Text fontSize="xs" whiteSpace="nowrap">
                {new Date(item.played_at).toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </Text>
            </HStack>
            <Badge 
              colorScheme="green" 
              variant="subtle" 
              fontSize="xs"
              mt={1}
            >
              {item.track.popularity}% popular
            </Badge>
          </VStack>
        )}
        <Icon as={FaPlay} color="#1DB954" ml={{ base: 2, md: 4 }} />
      </Flex>
    );
  };

  return (
    <Box
      bg="#000"
      minH="100vh"
      p={{ base: 3, md: 8 }}
      color="#FFFFFF"
      fontFamily="'Circular Std', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
      overflowX="hidden"
    >
      {/* Mobile-optimized Navigation */}
      <Flex 
        justify="space-between" 
        align="center" 
        mb={{ base: 6, md: 12 }}
        gap={2}
        flexWrap="wrap"
      >
        <Button
          as={RouterLink}
          to="/"
          leftIcon={<Icon as={FaArrowLeft} />}
          variant="ghost"
          color="#B3B3B3"
          size={{ base: "md", md: "lg" }}
          _hover={{ color: '#1DB954', bg: 'rgba(29, 185, 84, 0.1)' }}
          px={{ base: 3, md: 4 }}
          py={{ base: 2, md: 3 }}
        >
          {isMobile ? "" : "Back to Dashboard"}
        </Button>
        
        <Button
          leftIcon={<Icon as={FaShareAlt} />}
          bg="rgba(29, 185, 84, 0.1)"
          color="#1DB954"
          border="1px solid rgba(29, 185, 84, 0.3)"
          _hover={{ bg: '#1DB954', color: 'black', transform: { base: 'none', md: 'scale(1.05)' } }}
          size={{ base: "md", md: "lg" }}
          onClick={() => setIsShareModalOpen(true)}
          px={{ base: 4, md: 6 }}
          py={{ base: 2, md: 3 }}
          flexShrink={0}
        >
          {isMobile ? "Share" : "Share Aura"}
        </Button>
      </Flex>

      {/* Main Content - Mobile optimized */}
      <Container maxW="1400px" px={{ base: 0, md: 8 }} w="full">
        <VStack spacing={{ base: 6, md: 12 }} w="full" align="stretch">
          {/* Header Section - Mobile optimized */}
          <VStack spacing={{ base: 4, md: 6 }} textAlign="center" px={{ base: 3, md: 0 }}>
            <Box
              w={{ base: "50px", md: "60px" }}
              h={{ base: "50px", md: "60px" }}
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
            
            <VStack spacing={{ base: 2, md: 3 }} w="full">
              <Heading
                size={{ base: 'xl', sm: '2xl', md: '3xl' }}
                fontWeight="900"
                letterSpacing={{ base: '-0.5px', md: '-1px' }}
                color="white"
                textAlign="center"
                lineHeight="1.1"
                px={{ base: 2, md: 0 }}
              >
                Your Recent Music Aura
              </Heading>
              
              <Text 
                color="#B3B3B3" 
                fontSize={{ base: 'sm', md: 'lg' }} 
                textAlign="center"
                px={{ base: 2, md: 0 }}
              >
                Based on your last {recentTracks.length} tracks • Generated just now
              </Text>
              
              <HStack 
                spacing={2} 
                flexWrap="wrap" 
                justify="center"
                px={{ base: 2, md: 0 }}
              >
                <Badge
                  bg="rgba(29, 185, 84, 0.1)"
                  color="#1DB954"
                  fontSize={{ base: 'xs', md: 'md' }}
                  px={{ base: 3, md: 6 }}
                  py={{ base: 1, md: 2 }}
                  borderRadius="full"
                  border="1px solid rgba(29, 185, 84, 0.3)"
                  fontWeight="bold"
                >
                  <Icon as={FaHistory} mr={2} /> Recent Listening
                </Badge>
                
                {user && !isMobile && (
                  <Badge
                    bg="rgba(255, 255, 255, 0.1)"
                    color="gray.300"
                    fontSize="md"
                    px={6}
                    py={2}
                    borderRadius="full"
                    border="1px solid rgba(255, 255, 255, 0.1)"
                  >
                    <Icon as={FaUser} mr={2} /> {user.display_name}
                  </Badge>
                )}
              </HStack>
            </VStack>
          </VStack>

          {/* Mobile: Vertical stack, Desktop: Grid */}
          <VStack 
            spacing={{ base: 6, md: 12 }} 
            w="full" 
            align="stretch"
            display={{ base: 'flex', lg: 'none' }}
          >
            {/* Aura Analysis Card - Mobile */}
            <Card
              bg="rgba(18, 18, 18, 0.9)"
              borderRadius="2xl"
              border="1px solid rgba(255, 255, 255, 0.1)"
              backdropFilter="blur(20px)"
              boxShadow="0 20px 40px -12px rgba(0, 0, 0, 0.8)"
              transition="all 0.3s"
              _hover={{ transform: { base: 'none', md: 'translateY(-8px)' }, boxShadow: '0 30px 60px rgba(29, 185, 84, 0.15)' }}
              w="full"
            >
              <CardBody p={{ base: 4, md: 8 }}>
                <VStack spacing={{ base: 4, md: 6 }} align="start" w="full">
                  <VStack spacing={3} align="start" w="full">
                    <HStack spacing={3}>
                      <Icon as={FaHistory} color="#1DB954" boxSize={{ base: 5, md: 6 }} />
                      <Text
                        fontSize={{ base: 'xs', md: 'sm' }}
                        color="gray.400"
                        fontWeight="600"
                        letterSpacing="1px"
                        textTransform="uppercase"
                      >
                        Recent Music Aura
                      </Text>
                    </HStack>
                    
                    <Divider borderColor="rgba(255, 255, 255, 0.1)" />
                    
                    <Heading
                      size={{ base: 'lg', md: '2xl' }}
                      fontWeight="900"
                      color="white"
                      lineHeight="1.2"
                      bgGradient="linear(to-r, white, #1db954)"
                      bgClip="text"
                    >
                      {auraName}
                    </Heading>
                    
                    <Text
                      fontSize={{ base: 'md', md: 'lg' }}
                      color="gray.300"
                      lineHeight="1.6"
                    >
                      {auraDescription}
                    </Text>
                    
                    <HStack spacing={3} mt={3} w="full" flexWrap="wrap">
                      <Box
                        width={{ base: "50px", md: "60px" }}
                        height={{ base: "50px", md: "60px" }}
                        borderRadius="xl"
                        bg={auraColor}
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        boxShadow={`0 10px 30px ${auraColor}80`}
                        flexShrink={0}
                      >
                        <Icon as={FaChartLine} color="white" boxSize={{ base: 6, md: 8 }} />
                      </Box>
                      
                      <VStack align="start" spacing={1} flex={1} minW={0}>
                        <Text color="#1DB954" fontSize={{ base: 'xs', md: 'sm' }} fontWeight="600">
                          Dominant Features
                        </Text>
                        <HStack spacing={2} flexWrap="wrap">
                          {avg_features.danceability > 0.7 && (
                            <Badge bg="rgba(29,185,84,0.1)" color="#1DB954" fontSize="2xs" px={2} py={1} borderRadius="full">Danceable</Badge>
                          )}
                          {avg_features.energy > 0.7 && (
                            <Badge bg="rgba(29,185,84,0.1)" color="#1DB954" fontSize="2xs" px={2} py={1} borderRadius="full">Energetic</Badge>
                          )}
                          {avg_features.valence > 0.7 && (
                            <Badge bg="rgba(29,185,84,0.1)" color="#1DB954" fontSize="2xs" px={2} py={1} borderRadius="full">Positive</Badge>
                          )}
                          {avg_features.acousticness > 0.7 && (
                            <Badge bg="rgba(29,185,84,0.1)" color="#1DB954" fontSize="2xs" px={2} py={1} borderRadius="full">Acoustic</Badge>
                          )}
                        </HStack>
                      </VStack>
                    </HStack>
                  </VStack>

                  {/* Audio Features - Mobile optimized */}
                  <SimpleGrid 
                    columns={{ base: 1, sm: 2 }} 
                    spacing={4} 
                    w="full"
                  >
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
                        p={{ base: 4, md: 5 }}
                        border="1px solid"
                        borderColor="rgba(255, 255, 255, 0.1)"
                        backdropFilter="blur(10px)"
                        transition="all 0.3s"
                        _hover={{
                          transform: { base: 'none', md: 'translateY(-4px)' },
                          borderColor: '#1DB954',
                          boxShadow: '0 10px 30px rgba(29, 185, 84, 0.2)',
                        }}
                        w="full"
                      >
                        <HStack spacing={{ base: 3, md: 4 }} mb={4}>
                          <Box
                            p={{ base: 1.5, md: 2 }}
                            bg="rgba(29, 185, 84, 0.1)"
                            borderRadius="lg"
                            border="1px solid rgba(29, 185, 84, 0.3)"
                            flexShrink={0}
                          >
                            <Icon as={FaTachometerAlt} color="#1DB954" boxSize={{ base: 4, md: 5 }} />
                          </Box>
                          <VStack align="start" spacing={0} flex={1} minW={0}>
                            <Text
                              textTransform="uppercase"
                              fontWeight="600"
                              color="#FFFFFF"
                              fontSize={{ base: 'xs', md: 'sm' }}
                              letterSpacing="0.5px"
                              noOfLines={1}
                            >
                              Tempo
                            </Text>
                            <Badge
                              bg="#1DB954"
                              color="black"
                              fontSize={{ base: '2xs', md: 'xs' }}
                              px={{ base: 2, md: 3 }}
                              py={1}
                              borderRadius="full"
                              fontWeight="bold"
                              mt={1}
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
                  </SimpleGrid>
                </VStack>
              </CardBody>
            </Card>

            {/* Recent Tracks Card - Mobile */}
            <Card
              bg="rgba(18, 18, 18, 0.9)"
              borderRadius="2xl"
              border="1px solid rgba(255, 255, 255, 0.1)"
              backdropFilter="blur(20px)"
              boxShadow="0 20px 40px -12px rgba(0, 0, 0, 0.8)"
              transition="all 0.3s"
              _hover={{ transform: { base: 'none', md: 'translateY(-8px)' }, boxShadow: '0 30px 60px rgba(29, 185, 84, 0.15)' }}
              w="full"
            >
              <CardBody p={{ base: 4, md: 8 }}>
                <VStack spacing={{ base: 4, md: 6 }} align="start" w="full">
                  <VStack spacing={3} align="start" w="full">
                    <HStack spacing={3}>
                      <Icon as={FaHeadphones} color="#1DB954" boxSize={{ base: 5, md: 6 }} />
                      <Text
                        fontSize={{ base: 'xs', md: 'sm' }}
                        color="gray.400"
                        fontWeight="600"
                        letterSpacing="1px"
                        textTransform="uppercase"
                      >
                        Recent Tracks
                      </Text>
                    </HStack>
                    
                    <Divider borderColor="rgba(255, 255, 255, 0.1)" />
                    
                    <Text color="gray.300" fontSize={{ base: 'sm', md: 'md' }}>
                      Tap any track to see its individual aura analysis
                    </Text>
                  </VStack>

                  <VStack 
                    spacing={2} 
                    w="full" 
                    maxH={{ base: "400px", md: "600px" }} 
                    overflowY="auto" 
                    pr={2}
                    sx={{
                      '&::-webkit-scrollbar': {
                        width: '4px',
                      },
                      '&::-webkit-scrollbar-track': {
                        background: 'rgba(255,255,255,0.05)',
                        borderRadius: '2px',
                      },
                      '&::-webkit-scrollbar-thumb': {
                        background: '#1DB954',
                        borderRadius: '2px',
                      },
                    }}
                  >
                    {recentTracks.map((item, index) => (
                      <TrackItem key={item.played_at} item={item} index={index} />
                    ))}
                  </VStack>

                  {/* Stats Footer - Mobile optimized */}
                  <Box
                    bg="rgba(29, 185, 84, 0.05)"
                    p={3}
                    borderRadius="xl"
                    border="1px solid rgba(29, 185, 84, 0.2)"
                    w="full"
                  >
                    <HStack justify="space-between" spacing={2} w="full">
                      <VStack align="start" spacing={0} flex={1}>
                        <Text color="#1DB954" fontSize="2xs" fontWeight="600">
                          Total Duration
                        </Text>
                        <Text color="white" fontSize="sm" fontWeight="bold">
                          {Math.round(recentTracks.reduce((acc, track) => acc + (track.track.duration_ms || 0), 0) / 60000)} min
                        </Text>
                      </VStack>
                      <VStack align="center" spacing={0} flex={1}>
                        <Text color="#1DB954" fontSize="2xs" fontWeight="600">
                          Artists
                        </Text>
                        <Text color="white" fontSize="sm" fontWeight="bold">
                          {new Set(recentTracks.flatMap(t => t.track.artists.map(a => a.id))).size}
                        </Text>
                      </VStack>
                      <VStack align="end" spacing={0} flex={1}>
                        <Text color="#1DB954" fontSize="2xs" fontWeight="600">
                          Time Range
                        </Text>
                        <Text color="white" fontSize="sm" fontWeight="bold">
                          {recentTracks.length > 0 ? 
                            `${new Date(recentTracks[recentTracks.length-1].played_at).toLocaleDateString([], { month: 'short', day: 'numeric' })}` 
                            : 'N/A'}
                        </Text>
                      </VStack>
                    </HStack>
                  </Box>
                </VStack>
              </CardBody>
            </Card>
          </VStack>

          {/* Desktop Grid Layout (hidden on mobile) */}
          <Grid 
            templateColumns="1fr 1fr" 
            gap={{ base: 6, md: 12 }} 
            w="full" 
            alignItems="stretch"
            display={{ base: 'none', lg: 'grid' }}
          >
            {/* Left Column: Aura Analysis */}
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
                  {/* Desktop content remains the same */}
                  <VStack spacing={6} align="start" flex="1">
                    <VStack spacing={4} align="start" w="full">
                      <HStack spacing={3}>
                        <Icon as={FaHistory} color="#1DB954" boxSize={6} />
                        <Text
                          fontSize="sm"
                          color="gray.400"
                          fontWeight="600"
                          letterSpacing="1px"
                          textTransform="uppercase"
                        >
                          Recent Music Aura
                        </Text>
                      </HStack>
                      
                      <Divider borderColor="rgba(255, 255, 255, 0.1)" />
                      
                      <Heading
                        size={{ base: 'xl', md: '2xl' }}
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
                          <Icon as={FaChartLine} color="white" boxSize={8} />
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
                    </VStack>

                    {/* Audio Features */}
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
                  </VStack>
                </CardBody>
              </Card>
            </GridItem>

            {/* Right Column: Recent Tracks */}
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
                  {/* Desktop content remains the same */}
                  <VStack spacing={6} align="start" flex="1">
                    <VStack spacing={4} align="start" w="full">
                      <HStack spacing={3}>
                        <Icon as={FaHeadphones} color="#1DB954" boxSize={6} />
                        <Text
                          fontSize="sm"
                          color="gray.400"
                          fontWeight="600"
                          letterSpacing="1px"
                          textTransform="uppercase"
                        >
                          Recent Tracks
                        </Text>
                      </HStack>
                      
                      <Divider borderColor="rgba(255, 255, 255, 0.1)" />
                      
                      <Text color="gray.300" fontSize="md">
                        Click any track to see its individual aura analysis
                      </Text>
                    </VStack>

                    <VStack spacing={3} w="full" flex="1" overflowY="auto" pr={2}
                      sx={{
                        '&::-webkit-scrollbar': {
                          width: '6px',
                        },
                        '&::-webkit-scrollbar-track': {
                          background: 'rgba(255,255,255,0.05)',
                          borderRadius: '3px',
                        },
                        '&::-webkit-scrollbar-thumb': {
                          background: '#1DB954',
                          borderRadius: '3px',
                        },
                      }}
                    >
                      {recentTracks.map((item, index) => (
                        <Flex
                          key={item.played_at}
                          p={4}
                          bg="rgba(40, 40, 40, 0.5)"
                          borderRadius="xl"
                          align="center"
                          cursor="pointer"
                          _hover={{ bg: 'rgba(29, 185, 84, 0.15)', transform: 'translateX(4px)' }}
                          transition="all 0.2s"
                          onClick={() => handleTrackClick(item)}
                          w="full"
                        >
                          <Text 
                            fontSize="sm" 
                            color="gray.500" 
                            fontWeight="bold" 
                            minW="30px"
                            mr={4}
                          >
                            {index + 1}
                          </Text>
                          <Image
                            src={item.track.album.images[0]?.url}
                            alt={item.track.name}
                            boxSize="60px"
                            borderRadius="lg"
                            mr={4}
                            flexShrink={0}
                          />
                          <Box flex={1} minW={0}>
                            <Text 
                              fontWeight="700" 
                              color="white" 
                              noOfLines={1}
                              fontSize="md"
                            >
                              {item.track.name}
                            </Text>
                            <Text 
                              fontSize="sm" 
                              color="gray.400" 
                              noOfLines={1}
                              mt={1}
                            >
                              {item.track.artists.map(a => a.name).join(', ')}
                            </Text>
                          </Box>
                          <VStack spacing={0} align="end" ml={4}>
                            <HStack spacing={2} color="gray.500">
                              <Icon as={FaRegClock} boxSize={3} />
                              <Text fontSize="xs" whiteSpace="nowrap">
                                {new Date(item.played_at).toLocaleTimeString([], { 
                                  hour: '2-digit', 
                                  minute: '2-digit' 
                                })}
                              </Text>
                            </HStack>
                            <Badge 
                              colorScheme="green" 
                              variant="subtle" 
                              fontSize="xs"
                              mt={1}
                            >
                              {item.track.popularity}% popular
                            </Badge>
                          </VStack>
                          <Icon as={FaPlay} color="#1DB954" ml={4} />
                        </Flex>
                      ))}
                    </VStack>

                    {/* Stats Footer */}
                    <Box
                      bg="rgba(29, 185, 84, 0.05)"
                      p={4}
                      borderRadius="xl"
                      border="1px solid rgba(29, 185, 84, 0.2)"
                      w="full"
                    >
                      <HStack justify="space-between" spacing={4}>
                        <VStack align="start" spacing={0}>
                          <Text color="#1DB954" fontSize="sm" fontWeight="600">
                            Total Duration
                          </Text>
                          <Text color="white" fontSize="md" fontWeight="bold">
                            {Math.round(recentTracks.reduce((acc, track) => acc + (track.track.duration_ms || 0), 0) / 60000)} min
                          </Text>
                        </VStack>
                        <VStack align="center" spacing={0}>
                          <Text color="#1DB954" fontSize="sm" fontWeight="600">
                            Artists
                          </Text>
                          <Text color="white" fontSize="md" fontWeight="bold">
                            {new Set(recentTracks.flatMap(t => t.track.artists.map(a => a.id))).size}
                          </Text>
                        </VStack>
                        <VStack align="end" spacing={0}>
                          <Text color="#1DB954" fontSize="sm" fontWeight="600">
                            Time Range
                          </Text>
                          <Text color="white" fontSize="md" fontWeight="bold">
                            {recentTracks.length > 0 ? 
                              `${new Date(recentTracks[recentTracks.length-1].played_at).toLocaleDateString([], { month: 'short', day: 'numeric' })}` 
                              : 'N/A'}
                          </Text>
                        </VStack>
                      </HStack>
                    </Box>
                  </VStack>
                </CardBody>
              </Card>
            </GridItem>
          </Grid>
        </VStack>
      </Container>

      {/* Modals */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        auraData={{ name: auraName, description: auraDescription, color: auraColor }}
        avgFeatures={avg_features || {}}
        userDetails={user}
      />

      <TrackAnalysisModal
        isOpen={isTrackModalOpen}
        onClose={() => setIsTrackModalOpen(false)}
        track={selectedTrack}
        analysis={trackAnalysis}
      />
    </Box>
  );
};

export default RecentAnalysis;