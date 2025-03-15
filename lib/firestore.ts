import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

// Default financial data structure
export const defaultFinancialData = {
  income: {
    salary: 0,
    investments: 0,
    sideHustle: 0,
    other: 0,
  },
  expenses: {
    housing: 0,
    transportation: 0,
    food: 0,
    utilities: 0,
    healthcare: 0,
    entertainment: 0,
    other: 0,
  },
  assets: {
    cash: 0,
    investments: 0,
    retirement: 0,
    realEstate: 0,
    other: 0,
  },
  liabilities: {
    mortgage: 0,
    carLoan: 0,
    studentLoans: 0,
    creditCards: 0,
    other: 0,
  },
  goals: {
    targetNetWorth: 0,
    targetAnnualExpenses: 0,
    targetWithdrawalRate: 4,
    targetRetirementAge: 55,
    currentAge: 30,
  },
  profile: {
    name: "",
    firstName: "",
    lastName: "",
    email: "",
    createdAt: new Date().toISOString(),
    isFirstLogin: true,
  },
};

// Get user financial data
export async function getUserFinancialData(userId: string) {
  try {
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data().financialData;
    } else {
      // Create a new document with default data if it doesn't exist
      await setDoc(docRef, { financialData: defaultFinancialData });
      return defaultFinancialData;
    }
  } catch (error) {
    console.error("Error getting user data:", error);
    return defaultFinancialData;
  }
}

// Update user financial data
export async function updateUserFinancialData(
  userId: string,
  financialData: any
) {
  try {
    const docRef = doc(db, "users", userId);
    await updateDoc(docRef, { financialData });
    return true;
  } catch (error) {
    console.error("Error updating user data:", error);

    // If document doesn't exist yet, create it
    try {
      const docRef = doc(db, "users", userId);
      await setDoc(docRef, { financialData });
      return true;
    } catch (innerError) {
      console.error("Error creating user data:", innerError);
      return false;
    }
  }
}

// Create a new user profile
export async function createUserProfile(
  userId: string,
  email: string,
  firstName = "",
  lastName = ""
) {
  try {
    const docRef = doc(db, "users", userId);
    const userData = {
      financialData: {
        ...defaultFinancialData,
        profile: {
          ...defaultFinancialData.profile,
          email,
          firstName,
          lastName,
          name: `${firstName} ${lastName}`.trim(),
          createdAt: new Date().toISOString(),
          isFirstLogin: true,
        },
      },
    };

    await setDoc(docRef, userData);
    return true;
  } catch (error) {
    console.error("Error creating user profile:", error);
    return false;
  }
}

// Check if this is the user's first login
export async function isFirstLogin(userId: string) {
  try {
    const userData = await getUserFinancialData(userId);
    return userData.profile?.isFirstLogin === true;
  } catch (error) {
    console.error("Error checking first login status:", error);
    return true; // Default to true if there's an error
  }
}

// Update first login status
export async function updateFirstLoginStatus(
  userId: string,
  isFirstLogin: boolean
) {
  try {
    const userData = await getUserFinancialData(userId);
    const updatedData = {
      ...userData,
      profile: {
        ...userData.profile,
        isFirstLogin,
      },
    };

    await updateUserFinancialData(userId, updatedData);
    return true;
  } catch (error) {
    console.error("Error updating first login status:", error);
    return false;
  }
}
