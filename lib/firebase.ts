import firebase from 'firebase/compat/app';
import 'firebase/compat/database';
import 'firebase/compat/auth';
import 'firebase/compat/storage';

// Firebase Project Configuration: noskahhmzah
export const firebaseConfig = {
    apiKey: "AIzaSyDsnnj7mc8qKNKjawIb7mXB_hWSDBnjjts",
    authDomain: "noskahhmzah.firebaseapp.com",
    databaseURL: "https://noskahhmzah-default-rtdb.firebaseio.com",
    projectId: "noskahhmzah",
    storageBucket: "noskahhmzah.firebasestorage.app",
    messagingSenderId: "893175642468",
    appId: "1:893175642468:web:abd6d10a264c5f7ec52271",
    measurementId: "G-JTK9MGH3NJ"
};

// Initialize Firebase App
const app = !firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app();
export const db = firebase.database(app);
export const auth = firebase.auth(app);
export const storage = firebase.storage(app);
export { firebase };

// Initial School Configuration & Seed Data
const INITIAL_PRINCIPAL = {
    id: 'principal_al_hamza',
    role: 'principal',
    name: 'تحسين هارون مهدي حمد',
    schoolName: 'متوسطة الحمزة للبنين',
    schoolLevel: 'متوسطة',
    code: 'Qp!@#8070',
    studentCodeLimit: 1000
};

const INITIAL_SETTINGS = {
    schoolName: 'متوسطة الحمزة للبنين',
    principalName: 'تحسين هارون مهدي حمد',
    academicYear: '2025-2026',
    directorate: 'الكرخ الثانية',
    supplementarySubjectsCount: 3,
    decisionPoints: 5,
    principalPhone: '',
    schoolType: 'نهاري',
    schoolGender: 'بنين',
    schoolLevel: 'متوسطة',
    governorateCode: '',
    schoolCode: '',
    governorateName: 'بغداد',
    district: '',
    subdistrict: '',
    lockS1Submissions: false,
    lockS2Submissions: false,
    lockAllSubmissions: false,
    monthlyResultsNotice: false,
    telegramEnabled: false,
    telegramBotToken: '',
    telegramDefaultChatId: ''
};

// Auto-seed initial principal and settings if missing, and migrate local data if available
async function initializeAndSyncDatabase() {
    try {
        const principalRef = db.ref('users/principal_al_hamza');
        const principalSnap = await principalRef.get();
        if (!principalSnap.exists()) {
            await principalRef.set(INITIAL_PRINCIPAL);
        }

        const settingsRef = db.ref('settings/principal_al_hamza');
        const settingsSnap = await settingsRef.get();
        if (!settingsSnap.exists()) {
            await settingsRef.set(INITIAL_SETTINGS);
        }

        // Check if there is data from previous offline storage to seamlessly migrate
        if (typeof window !== 'undefined') {
            const localRaw = window.localStorage.getItem('school_offline_database_v1');
            if (localRaw) {
                try {
                    const localData = JSON.parse(localRaw);
                    if (localData && typeof localData === 'object') {
                        // Migrate classes if remote has none
                        const classesSnap = await db.ref('classes').get();
                        if (!classesSnap.exists() && localData.classes && Object.keys(localData.classes).length > 0) {
                            await db.ref('classes').set(localData.classes);
                        }

                        // Migrate student access codes if remote has none
                        const codesSnap = await db.ref('student_access_codes_individual').get();
                        if (!codesSnap.exists() && localData.student_access_codes_individual && Object.keys(localData.student_access_codes_individual).length > 0) {
                            await db.ref('student_access_codes_individual').set(localData.student_access_codes_individual);
                        }

                        // Migrate evaluations if remote has none
                        const evalSnap = await db.ref('evaluations').get();
                        if (!evalSnap.exists() && localData.evaluations && Object.keys(localData.evaluations).length > 0) {
                            await db.ref('evaluations').set(localData.evaluations);
                        }
                    }
                } catch (e) {
                    console.warn('Migration check completed without error', e);
                }
            }
        }
    } catch (err) {
        console.warn('Database initialization/check notice:', err);
    }
}

// Run initial seed / check asynchronously
if (typeof window !== 'undefined') {
    initializeAndSyncDatabase();
}

export default app;
