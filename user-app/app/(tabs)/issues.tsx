import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Issue {
  id: string;
  title: string;
  description: string;
  location: string;
  status: 'open' | 'in-progress' | 'resolved';
  createdAt: string;
  supportCount: number;
  category: string;
}

const sampleIssues: Issue[] = [
  {
    id: '1',
    title: 'Broken Street Light',
    description: 'Street light on Main Street is not working, making the area unsafe at night.',
    location: 'Main Street, Block A',
    status: 'open',
    createdAt: '2 days ago',
    supportCount: 12,
    category: 'Infrastructure',
  },
  {
    id: '2',
    title: 'Pothole on Oak Avenue',
    description: 'Large pothole causing damage to vehicles and creating traffic hazards.',
    location: 'Oak Avenue, near City Hall',
    status: 'in-progress',
    createdAt: '1 week ago',
    supportCount: 8,
    category: 'Road Maintenance',
  },
  {
    id: '3',
    title: 'Garbage Collection Issue',
    description: 'Garbage bins not being emptied on scheduled days in residential area.',
    location: 'Residential Block B',
    status: 'open',
    createdAt: '3 days ago',
    supportCount: 15,
    category: 'Sanitation',
  },
];

export default function IssuesScreen() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedIssue, setSelectedIssue] = useState<string | null>(null);

  const categories = ['All', 'Infrastructure', 'Road Maintenance', 'Sanitation', 'Public Safety'];

  const filteredIssues = selectedCategory === 'All' 
    ? sampleIssues 
    : sampleIssues.filter(issue => issue.category === selectedCategory);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return '#FF4444';
      case 'in-progress': return '#FFA500';
      case 'resolved': return '#00AA00';
      default: return '#666666';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open': return 'alert-circle';
      case 'in-progress': return 'time';
      case 'resolved': return 'checkmark-circle';
      default: return 'help-circle';
    }
  };

  const handleSupportIssue = (issueId: string) => {
    Alert.alert(
      'Support Issue',
      'Thank you for supporting this issue! Your voice matters.',
      [{ text: 'OK' }]
    );
  };

  const handleCreateIssue = () => {
    Alert.alert(
      'Create New Issue',
      'This will open the issue creation form.',
      [{ text: 'OK' }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Community Issues</Text>
          <TouchableOpacity style={styles.createButton} onPress={handleCreateIssue}>
            <Ionicons name="add" size={20} color="#ffffff" />
            <Text style={styles.createButtonText}>Report Issue</Text>
          </TouchableOpacity>
        </View>

        {/* Category Filter */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.categoryContainer}
          contentContainerStyle={styles.categoryContent}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryButton,
                selectedCategory === category && styles.categoryButtonActive
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text style={[
                styles.categoryButtonText,
                selectedCategory === category && styles.categoryButtonTextActive
              ]}>
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Issues List */}
        <View style={styles.issuesContainer}>
          {filteredIssues.map((issue) => (
            <TouchableOpacity
              key={issue.id}
              style={[
                styles.issueCard,
                selectedIssue === issue.id && styles.issueCardSelected
              ]}
              onPress={() => setSelectedIssue(issue.id)}
            >
              <View style={styles.issueHeader}>
                <View style={styles.issueTitleContainer}>
                  <Text style={styles.issueTitle}>{issue.title}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(issue.status) }]}>
                    <Ionicons 
                      name={getStatusIcon(issue.status)} 
                      size={12} 
                      color="#ffffff" 
                    />
                    <Text style={styles.statusText}>{issue.status.toUpperCase()}</Text>
                  </View>
                </View>
                <Text style={styles.issueCategory}>{issue.category}</Text>
              </View>

              <Text style={styles.issueDescription} numberOfLines={2}>
                {issue.description}
              </Text>

              <View style={styles.issueFooter}>
                <View style={styles.issueMeta}>
                  <Ionicons name="location" size={14} color="#666666" />
                  <Text style={styles.issueLocation}>{issue.location}</Text>
                </View>
                <Text style={styles.issueDate}>{issue.createdAt}</Text>
              </View>

              <View style={styles.issueActions}>
                <TouchableOpacity 
                  style={styles.supportButton}
                  onPress={() => handleSupportIssue(issue.id)}
                >
                  <Ionicons name="thumbs-up" size={16} color="#007AFF" />
                  <Text style={styles.supportButtonText}>Support ({issue.supportCount})</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  createButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  categoryContainer: {
    marginBottom: 20,
  },
  categoryContent: {
    paddingHorizontal: 20,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    marginRight: 12,
  },
  categoryButtonActive: {
    backgroundColor: '#007AFF',
  },
  categoryButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666666',
  },
  categoryButtonTextActive: {
    color: '#ffffff',
  },
  issuesContainer: {
    paddingHorizontal: 20,
  },
  issueCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  issueCardSelected: {
    borderColor: '#007AFF',
    borderWidth: 2,
  },
  issueHeader: {
    marginBottom: 8,
  },
  issueTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  issueTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    flex: 1,
    marginRight: 8,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '600',
    marginLeft: 4,
  },
  issueCategory: {
    fontSize: 12,
    color: '#666666',
    fontWeight: '500',
  },
  issueDescription: {
    fontSize: 14,
    color: '#333333',
    lineHeight: 20,
    marginBottom: 12,
  },
  issueFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  issueMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  issueLocation: {
    fontSize: 12,
    color: '#666666',
    marginLeft: 4,
  },
  issueDate: {
    fontSize: 12,
    color: '#666666',
  },
  issueActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  supportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#f0f8ff',
    borderRadius: 16,
  },
  supportButtonText: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '500',
    marginLeft: 4,
  },
});