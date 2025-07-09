import { account, databases, DATABASE_ID, COLLECTION_IDS } from "./appwrite";
import { ID, Query } from "appwrite";

class AppwriteAuth {
  // Create account and user document
  async createAccount({
    email,
    password,
    name,
    phone,
    houseNo,
    street,
    landmark,
    city,
    state,
    pincode,
  }) {
    try {
      // Create Appwrite auth account
      const authAccount = await account.create(
        ID.unique(),
        email,
        password,
        name
      );

      if (authAccount) {
        // Create user document in database
        const userDoc = await databases.createDocument(
          DATABASE_ID,
          COLLECTION_IDS.USERS,
          ID.unique(),
          {
            userId: authAccount.$id,
            name: name,
            email: email,
            phone: phone,
            houseNo: houseNo,
            street: street,
            landmark: landmark,
            city: city,
            state: state,
            pincode: parseInt(pincode),
            isAdmin: false,
            createdAt: new Date().toISOString(),
          }
        );

        // Auto login after signup
        await this.login({ email, password });

        return { success: true, user: userDoc };
      }
    } catch (error) {
      console.error("Appwrite signup error:", error);
      throw error;
    }
  }

  // Login user
  async login({ email, password }) {
    try {
      const session = await account.createEmailPasswordSession(email, password);
      return { success: true, session };
    } catch (error) {
      console.error("Appwrite login error:", error);
      throw error;
    }
  }

  // Get current user
  async getCurrentUser() {
    try {
      const authUser = await account.get();
      if (authUser) {
        // Get user document from database
        const userDocs = await databases.listDocuments(
          DATABASE_ID,
          COLLECTION_IDS.USERS,
          [Query.equal("userId", authUser.$id)]
        );

        if (userDocs.documents.length > 0) {
          const userDoc = userDocs.documents[0];
          return {
            ...authUser,
            ...userDoc,
            CustomerID: userDoc.$id, // For compatibility with existing code
            isAdmin: userDoc.isAdmin,
          };
        }
      }
      return null;
    } catch (error) {
      console.error("Get current user error:", error);
      return null;
    }
  }

  // Logout user
  async logout() {
    try {
      await account.deleteSession("current");
      return { success: true };
    } catch (error) {
      console.error("Appwrite logout error:", error);
      throw error;
    }
  }

  // Update user profile
  async updateProfile(userId, updateData) {
    try {
      const updatedUser = await databases.updateDocument(
        DATABASE_ID,
        COLLECTION_IDS.USERS,
        userId,
        updateData
      );
      return { success: true, user: updatedUser };
    } catch (error) {
      console.error("Update profile error:", error);
      throw error;
    }
  }

  // Check if user is logged in
  async isLoggedIn() {
    try {
      const user = await this.getCurrentUser();
      return !!user;
    } catch (error) {
      return false;
    }
  }

  // Create password recovery
  async createPasswordRecovery(email, resetUrl) {
    try {
      const result = await account.createRecovery(email, resetUrl);
      return { success: true, token: result };
    } catch (error) {
      console.error("Create password recovery error:", error);
      throw error;
    }
  }

  // Update password recovery (complete reset)
  async updatePasswordRecovery(userId, secret, newPassword) {
    try {
      const result = await account.updateRecovery(userId, secret, newPassword);
      return { success: true, token: result };
    } catch (error) {
      console.error("Update password recovery error:", error);
      throw error;
    }
  }
}

const appwriteAuth = new AppwriteAuth();
export default appwriteAuth;
