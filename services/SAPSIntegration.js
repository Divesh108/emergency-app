import { 
  getFirestore, 
  doc, 
  setDoc, 
  collection, 
  query, 
  where, 
  getDocs, 
  onSnapshot,
  getDoc
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import * as Location from 'expo-location';
import { encryptData } from './EncryptionService';
import { sendPushNotification } from './PushNotificationService';

const db = getFirestore();
const auth = getAuth();

/**
 * Sends an emergency alert and notifies nearby officers
 * @param {Object} emergencyData - Emergency details including type and location
 * @returns {Promise<string>} - The emergency ID
 */
export const sendEmergencyAlert = async (emergencyData) => {
  try {
    // Validate emergency data
    if (!emergencyData.type || !emergencyData.location) {
      throw new Error('Invalid emergency data');
    }

    // Encrypt sensitive data
    const encrypted = {
      ...emergencyData,
      location: encryptData(emergencyData.location),
      userId: encryptData(auth.currentUser?.uid || 'anonymous')
    };

    // Create emergency document
    const emergencyRef = doc(collection(db, 'emergencies'));
    await setDoc(emergencyRef, {
      ...encrypted,
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
      isEncrypted: true
    });

    // Notify nearby officers
    const officersNotified = await broadcastEmergencyToNearbyOfficers(
      emergencyRef.id, 
      emergencyData
    );

    console.log(`Notified ${officersNotified} officers`);
    return emergencyRef.id;

  } catch (error) {
    console.error('Failed to send emergency alert:', error);
    throw error;
  }
};

/**
 * Broadcasts emergency to officers within radius
 * @param {string} emergencyId 
 * @param {Object} emergencyData 
 * @returns {Promise<number>} Number of officers notified
 */
export const broadcastEmergencyToNearbyOfficers = async (emergencyId, emergencyData) => {
  try {
    const { latitude, longitude } = emergencyData.location.coords;
    const officers = await getNearbyOfficers(latitude, longitude, 10); // 10km radius
    
    // Send notifications in parallel
    const notificationPromises = officers.map(officer => 
      sendPushNotificationToOfficer(officer.id, emergencyId, emergencyData)
    );

    await Promise.all(notificationPromises);
    return officers.length;

  } catch (error) {
    console.error('Broadcast failed:', error);
    return 0;
  }
};

/**
 * Gets officers within specified radius of location
 * @param {number} lat - Latitude
 * @param {number} long - Longitude
 * @param {number} radiusKm - Radius in kilometers
 * @returns {Promise<Array>} Array of officer objects
 */
const getNearbyOfficers = async (lat, long, radiusKm) => {
  try {
    const radius = radiusKm / 111.32; // Convert km to degrees
    
    const q = query(
      collection(db, 'users'),
      where('isLawEnforcement', '==', true),
      where('isActive', '==', true),
      where('lastKnownLocation.lat', '>=', lat - radius),
      where('lastKnownLocation.lat', '<=', lat + radius),
      where('lastKnownLocation.long', '>=', long - radius),
      where('lastKnownLocation.long', '<=', long + radius)
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data(),
      distance: calculateDistance(
        lat, 
        long, 
        doc.data().lastKnownLocation.lat, 
        doc.data().lastKnownLocation.long
      )
    })).sort((a, b) => a.distance - b.distance); // Sort by distance

  } catch (error) {
    console.error('Error getting nearby officers:', error);
    return [];
  }
};

/**
 * Sends push notification and creates emergency record for officer
 * @param {string} officerId 
 * @param {string} emergencyId 
 * @param {Object} emergencyData 
 */
const sendPushNotificationToOfficer = async (officerId, emergencyId, emergencyData) => {
  try {
    const officerRef = doc(db, 'users', officerId);
    const officerDoc = await getDoc(officerRef);
    
    if (!officerDoc.exists()) return;

    const officerData = officerDoc.data();
    
    // Send push notification if officer has token
    if (officerData.pushToken) {
      await sendPushNotification(
        officerData.pushToken,
        'EMERGENCY ALERT',
        `${emergencyData.type.toUpperCase()} - ${Math.round(officerData.distance)}km away`
      );
    }
    
    // Create emergency record for officer
    await setDoc(doc(db, `users/${officerId}/emergencies`, emergencyId), {
      emergencyId,
      type: emergencyData.type,
      location: emergencyData.location,
      status: 'PENDING_RESPONSE',
      notifiedAt: new Date().toISOString(),
      priority: determinePriority(emergencyData.type)
    });

  } catch (error) {
    console.error(`Failed to notify officer ${officerId}:`, error);
  }
};

/**
 * Subscribes to active emergencies
 * @param {Function} callback - Called when new emergency is added
 * @returns {Function} Unsubscribe function
 */
export const subscribeToEmergencies = (callback) => {
  const user = auth.currentUser;
  if (!user) return () => {};
  
  const q = query(
    collection(db, 'emergencies'),
    where('status', '==', 'ACTIVE')
  );
  
  const unsubscribe = onSnapshot(q, (snapshot) => {
    snapshot.docChanges().forEach((change) => {
      if (change.type === 'added') {
        const emergency = {
          id: change.doc.id,
          ...change.doc.data()
        };
        callback(emergency);
      }
    });
  });
  
  return unsubscribe;
};

// Helper functions
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in km
  const dLat = deg2rad(lat2-lat1);
  const dLon = deg2rad(lon2-lon1);
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  return R * c;
};

const deg2rad = (deg) => deg * (Math.PI/180);

const determinePriority = (emergencyType) => {
  switch(emergencyType) {
    case 'robbery': return 'HIGH';
    case 'fire': return 'HIGH';
    case 'ambulance': return 'MEDIUM';
    case 'breakdown': return 'LOW';
    default: return 'MEDIUM';
  }
};