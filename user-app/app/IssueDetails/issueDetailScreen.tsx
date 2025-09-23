import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Modal,
  Dimensions,
  Linking,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useUser } from "@clerk/clerk-expo";
const { width: screenWidth } = Dimensions.get('window');



// Progress tracker component
const ProgressTracker = ({ status }: { status: 'pending' | 'in-progress' | 'resolved' }) => {
  const steps = [
    { key: 'pending', label: 'Pending', description: 'Issue reported' },
    { key: 'in-progress', label: 'In Progress', description: 'Under review' },
    { key: 'resolved', label: 'Resolved', description: 'Issue fixed' },
  ];

  const getStatusIndex = (status: string) => {
    switch (status) {
      case 'pending': return 0;
      case 'in-progress': return 1;
      case 'resolved': return 2;
      default: return 0;
    }
  };

  const currentIndex = getStatusIndex(status);

  return (
    <View style={styles.progressContainer}>
      {steps.map((step, index) => {
        const isCompleted = index <= currentIndex;
        const isCurrent = index === currentIndex;
        
        return (
          <View key={step.key} style={styles.progressStep}>
            {/* Connection line */}
            {index > 0 && (
              <View 
                style={[
                  styles.connectionLine,
                  isCompleted ? styles.connectionLineActive : styles.connectionLineInactive
                ]} 
              />
            )}
            
            {/* Step circle */}
            <View style={[
              styles.stepCircle,
              isCompleted ? styles.stepCircleCompleted : styles.stepCirclePending,
              isCurrent && styles.stepCircleCurrent
            ]}>
              {isCompleted ? (
                <Ionicons 
                  name="checkmark" 
                  size={16} 
                  color="#fff" 
                />
              ) : (
                <Text style={styles.stepNumber}>{index + 1}</Text>
              )}
            </View>
            
            {/* Step label */}
            <View style={styles.stepLabelContainer}>
              <Text style={[
                styles.stepLabel,
                isCompleted ? styles.stepLabelActive : styles.stepLabelInactive
              ]}>
                {step.label}
              </Text>
              <Text style={styles.stepDescription}>{step.description}</Text>
            </View>
          </View>
        );
      })}
    </View>
  );
};

export default function IssueDetailScreen() {
  const { issueId } = useLocalSearchParams<{ issueId: string }>();
  const router = useRouter();
  const { user } = useUser();
  const [issue, setIssue] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [currentImage, setCurrentImage] = useState('');

  React.useEffect(() => {
    const fetchIssueDetails = async () => {
      setLoading(true);
      setError(null);
      let userId = undefined;
      const email = user?.primaryEmailAddress?.emailAddress || user?.emailAddresses?.[0]?.emailAddress;
      if (email) {
        try {
          const response = await fetch(
            'https://vapourific-emmalyn-fugaciously.ngrok-free.app/api/authUsers/get-user',
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email }),
            }
          );
          if (response.ok) {
            const json = await response.json();
            if (json?.success && json?.data) {
              userId = json.data.id;
              console.log('Fetched user ID:', userId);
            }
          }
        } catch (err) {
          setError('Failed to fetch user ID');
          setLoading(false);
          return;
        }
      }
      if (!userId) {
        setError('No user ID found');
        setLoading(false);
        return;
      }
      try {
        const issuesResponse = await fetch('https://vapourific-emmalyn-fugaciously.ngrok-free.app/api/issues/get-user-issues', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId }),
        });
        if (!issuesResponse.ok) {
          throw new Error(`HTTP error! status: ${issuesResponse.status}`);
        }
        const issuesJson = await issuesResponse.json();
        if (issuesJson.success && issuesJson.data && issuesJson.data[issueId]) {
          setIssue(issuesJson.data[issueId]);
        } else {
          setError('Issue not found');
        }
      } catch (err) {
        // setError('Failed to fetch issue details');
      }
      setLoading(false);
    };
    fetchIssueDetails();
  }, [issueId, user]);

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Loading issue details...</Text>
        </View>
      </SafeAreaView>
    );
  }
  if (error || !issue) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error || 'Issue not found'}</Text>
        </View>
      </SafeAreaView>
    );
  }

  const handleImagePress = (imageUrl: string) => {
    setCurrentImage(imageUrl);
    setImageModalVisible(true);
  };

  const handleShare = async () => {
    const shareUrl = `myapp://issue/${issue.id}`;
    const message = `Check out this community issue: ${issue.title}`;
    
    try {
      await Linking.openURL(`whatsapp://send?text=${encodeURIComponent(message + ' ' + shareUrl)}`);
    } catch (error) {
      alert('Sharing not available');
    }
  };

  const getStatusColor = () => {
    switch (issue.status) {
      case 'pending': return '#FF6B35';
      case 'in-progress': return '#FFA500';
      case 'resolved': return '#00AA00';
      default: return '#666666';
    }
  };

  const getStatusText = () => {
    switch (issue.status) {
      case 'pending': return 'Pending';
      case 'in-progress': return 'In Progress';
      case 'resolved': return 'Resolved';
      default: return 'Unknown';
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      {/* Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.replace('/issues')}
        >
          <Ionicons name="arrow-back" size={24} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Issue Details</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Title and Status Section */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>{issue.title}</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}>
            <Text style={styles.statusText}>{getStatusText()}</Text>
          </View>
        </View>

        {/* Progress Tracker */}
        <View style={styles.progressSection}>
          <Text style={styles.sectionTitle}>Issue Status</Text>
          <ProgressTracker status={issue.status === 'in_progress' ? 'in-progress' : issue.status as 'pending' | 'in-progress' | 'resolved'} />
        </View>

        {/* Date Information */}
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Ionicons name="calendar" size={18} color="#666" />
            <Text style={styles.infoText}>Reported on: {issue.reportedDate}</Text>
          </View>
          {issue.resolvedDate && (
            <View style={styles.infoRow}>
              <Ionicons name="checkmark-circle" size={18} color="#666" />
              <Text style={styles.infoText}>Resolved on: {issue.resolvedDate}</Text>
            </View>
          )}
          <View style={styles.infoRow}>
            <Ionicons name="grid" size={18} color="#666" />
            <Text style={styles.infoText}>Department: {issue.department}</Text>
          </View>
        </View>

        {/* Issue Images Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Issue Photos</Text>
          <View style={styles.imagesContainer}>
            {issue.issueImage ? (
              <TouchableOpacity 
                style={styles.imageContainer}
                onPress={() => handleImagePress(issue.issueImage!)}
              >
                <Image 
                  source={{ uri: issue.issueImage }} 
                  style={styles.image}
                  resizeMode="cover"
                />
                <Text style={styles.imageLabel}>Reported Issue</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.noImageContainer}>
                <Ionicons name="image-outline" size={40} color="#ccc" />
                <Text style={styles.noImageText}>No image available</Text>
              </View>
            )}

            {issue.resolutionImage && (
              <TouchableOpacity 
                style={styles.imageContainer}
                onPress={() => handleImagePress(issue.resolutionImage!)}
              >
                <Image 
                  source={{ uri: issue.resolutionImage }} 
                  style={styles.image}
                  resizeMode="cover"
                />
                <Text style={styles.imageLabel}>Resolution</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Description Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Issue Description</Text>
          <Text style={styles.descriptionText}>{issue.description}</Text>
        </View>

        {/* Status Message */}
        <View style={styles.statusMessageCard}>
          <Ionicons 
            name={issue.status === 'resolved' ? 'checkmark-done-circle' : 'information-circle'} 
            size={24} 
            color={issue.status === 'resolved' ? '#00AA00' : '#007AFF'} 
          />
          <Text style={styles.statusMessage}>
            {issue.status === 'pending' 
              ? 'Your issue is pending review. We will update you soon.' 
              : issue.status === 'in-progress'
              ? 'We have received your issue. Technician has been assigned.'
              : 'Your issue has been successfully resolved. Thank you for your contribution!'}
          </Text>
        </View>
        
        {/* Technician Information */}
        {(issue.status === 'in-progress' || issue.status === 'resolved') && issue.technician && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Technician Details</Text>
            <View style={styles.technicianCard}>
              <View style={styles.technicianInfo}>
                <Ionicons name="person" size={20} color="#007AFF" />
                <Text style={styles.technicianText}>{issue.technician.name}</Text>
              </View>
              <View style={styles.technicianInfo}>
                <Ionicons name="id-card" size={20} color="#007AFF" />
                <Text style={styles.technicianText}>ID: {issue.technician.id}</Text>
              </View>
              <View style={styles.technicianInfo}>
                <Ionicons name="call" size={20} color="#007AFF" />
                <Text style={styles.technicianText}>{issue.technician.contact}</Text>
              </View>
            </View>
          </View>
        )}

      </ScrollView>

      {/* Share Button - Only show for pending and in-progress issues */}
      {issue.status !== 'resolved' && (
        <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
          <Ionicons name="share-social" size={20} color="#ffffff" />
          <Text style={styles.shareButtonText}>Share Issue</Text>
        </TouchableOpacity>
      )}

      {/* Image Modal */}
      <Modal
        visible={imageModalVisible}
        transparent={true}
        onRequestClose={() => setImageModalVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalContainer}
          onPress={() => setImageModalVisible(false)}
        >
          <Image 
            source={{ uri: currentImage }} 
            style={styles.modalImage}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },
  headerRight: {
    width: 32,
  },
  scrollView: {
    flex: 1,
  },
  titleSection: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000000',
    flex: 1,
    marginRight: 12,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginTop: 2,
  },
  statusText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  progressSection: {
    padding: 20,
    backgroundColor: '#f8f9fa',
    marginHorizontal: 20,
    borderRadius: 12,
    marginBottom: 16,
  },
  progressContainer: {
    marginTop: 8,
  },
  progressStep: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
    position: 'relative',
  },
  connectionLine: {
    position: 'absolute',
    left: 11,
    top: -20,
    width: 2,
    height: 20,
  },
  connectionLineActive: {
    backgroundColor: '#007AFF',
  },
  connectionLineInactive: {
    backgroundColor: '#e0e0e0',
  },
  stepCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  stepCircleCompleted: {
    backgroundColor: '#007AFF',
  },
  stepCirclePending: {
    backgroundColor: '#e0e0e0',
    borderWidth: 2,
    borderColor: '#ccc',
  },
  stepCircleCurrent: {
    backgroundColor: '#007AFF',
    transform: [{ scale: 1.1 }],
  },
  stepNumber: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  stepLabelContainer: {
    marginLeft: 12,
    flex: 1,
    marginTop: 2,
  },
  stepLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  stepLabelActive: {
    color: '#000000',
  },
  stepLabelInactive: {
    color: '#666666',
  },
  stepDescription: {
    fontSize: 12,
    color: '#666666',
  },
  infoCard: {
    backgroundColor: '#f8f9fa',
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#333333',
    marginLeft: 8,
  },
  section: {
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 12,
  },
  imagesContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  imageContainer: {
    flex: 1,
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 120,
    borderRadius: 8,
  },
  imageLabel: {
    fontSize: 12,
    color: '#666666',
    marginTop: 6,
  },
  noImageContainer: {
    flex: 1,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderStyle: 'dashed',
  },
  noImageText: {
    fontSize: 12,
    color: '#999',
    marginTop: 8,
  },
  descriptionText: {
    fontSize: 15,
    color: '#333333',
    lineHeight: 22,
  },
  technicianCard: {
    backgroundColor: '#f0f8ff',
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  technicianInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  technicianText: {
    fontSize: 14,
    color: '#333333',
    marginLeft: 8,
  },
  statusMessageCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#f8f9fa',
    margin: 20,
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  statusMessage: {
    flex: 1,
    fontSize: 14,
    color: '#333333',
    marginLeft: 12,
    lineHeight: 20,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007AFF',
    margin: 20,
    paddingVertical: 14,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  shareButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalImage: {
    width: screenWidth * 0.9,
    height: screenWidth * 0.9,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: '#666666',
  },
});