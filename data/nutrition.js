import { ObjectId } from 'mongodb';
import { users } from '../config/mongoCollections.js';

// Get all nutrition records for a user
export const getUserNutritionData = async (userId) => {
  if (!userId || !ObjectId.isValid(userId)) {
    throw new Error('Invalid user ID');
  }

  const usersCollection = await users();
  const user = await usersCollection.findOne({ _id: new ObjectId(userId) });
  
  if (!user) {
    throw new Error('User not found');
  }

  return user.nutritionData || [];
};

// Add a nutrition record
export const addNutritionRecord = async (userId, nutritionData) => {
  if (!userId || !ObjectId.isValid(userId)) {
    throw new Error('Invalid user ID');
  }

  const { protein, carbs, fat, date } = nutritionData;
  
  // Validation
  if (protein === undefined || carbs === undefined || fat === undefined) {
    throw new Error('Protein, carbs and fat values are required');
  }
  
  if (isNaN(protein) || isNaN(carbs) || isNaN(fat)) {
    throw new Error('Nutrition values must be numbers');
  }
  
  if (protein < 0 || carbs < 0 || fat < 0) {
    throw new Error('Nutrition values cannot be negative');
  }

  const newRecord = {
    _id: new ObjectId(),
    protein: parseFloat(protein),
    carbs: parseFloat(carbs),
    fat: parseFloat(fat),
    date: date || new Date().toISOString().split('T')[0], // Use provided date or today's date
    createdAt: new Date()
  };

  const usersCollection = await users();
  const updateResult = await usersCollection.updateOne(
    { _id: new ObjectId(userId) },
    { $push: { nutritionData: newRecord } }
  );

  if (!updateResult.matchedCount) {
    throw new Error('User not found');
  }
  
  if (!updateResult.modifiedCount) {
    throw new Error('Failed to add nutrition record');
  }

  return newRecord;
};

// Update a nutrition record
export const updateNutritionRecord = async (userId, recordId, updatedData) => {
  if (!userId || !ObjectId.isValid(userId)) {
    throw new Error('Invalid user ID');
  }
  
  if (!recordId || !ObjectId.isValid(recordId)) {
    throw new Error('Invalid record ID');
  }

  const { protein, carbs, fat } = updatedData;
  
  // Validation
  if (protein !== undefined && (isNaN(protein) || protein < 0)) {
    throw new Error('Protein value must be a non-negative number');
  }
  
  if (carbs !== undefined && (isNaN(carbs) || carbs < 0)) {
    throw new Error('Carbs value must be a non-negative number');
  }
  
  if (fat !== undefined && (isNaN(fat) || fat < 0)) {
    throw new Error('Fat value must be a non-negative number');
  }

  const usersCollection = await users();
  
  // Build the update object
  const updateFields = {};
  
  if (protein !== undefined) updateFields['nutritionData.$.protein'] = parseFloat(protein);
  if (carbs !== undefined) updateFields['nutritionData.$.carbs'] = parseFloat(carbs);
  if (fat !== undefined) updateFields['nutritionData.$.fat'] = parseFloat(fat);
  
  const updateResult = await usersCollection.updateOne(
    { 
      _id: new ObjectId(userId),
      'nutritionData._id': new ObjectId(recordId) 
    },
    { $set: updateFields }
  );

  if (!updateResult.matchedCount) {
    throw new Error('Record not found');
  }
  
  if (!updateResult.modifiedCount) {
    throw new Error('No changes made to the record');
  }

  return { message: 'Nutrition record updated successfully' };
};

// Delete a nutrition record
export const deleteNutritionRecord = async (userId, recordId) => {
  if (!userId || !ObjectId.isValid(userId)) {
    throw new Error('Invalid user ID');
  }
  
  if (!recordId || !ObjectId.isValid(recordId)) {
    throw new Error('Invalid record ID');
  }

  const usersCollection = await users();
  const updateResult = await usersCollection.updateOne(
    { _id: new ObjectId(userId) },
    { $pull: { nutritionData: { _id: new ObjectId(recordId) } } }
  );

  if (!updateResult.matchedCount) {
    throw new Error('User not found');
  }
  
  if (!updateResult.modifiedCount) {
    throw new Error('Record not found');
  }

  return { message: 'Nutrition record deleted successfully' };
};