import { ObjectId } from 'mongodb';
import { users } from '../config/mongoCollections.js';

// Get all nutrition records for a user
export const getUserNutritionData = async (userId, period = 'daily') => {
  if (!userId || !ObjectId.isValid(userId)) {
    throw new Error('Invalid user ID');
  }

  const usersCollection = await users();
  const user = await usersCollection.findOne({ _id: new ObjectId(userId) });
  
  if (!user) {
    throw new Error('User not found');
  }

  if (!user.nutritionData || !user.nutritionData[period]) return [];

  return user.nutritionData[period];
}

// Add a nutrition record
export const addNutritionRecord = async (userId, protein, carbs, fat, period='daily') => {
  if (!userId || !ObjectId.isValid(userId)) {
    throw new Error('Invalid user ID');
  }

  
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
    { $push: { [`nutritionData.${period}`]: newRecord } }

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
export const updateNutritionRecord = async (userId, recordId, period, updatedData) => {

  if (!userId || !ObjectId.isValid(userId)) {
    throw new Error('Invalid user ID');
  }
  
  if (!recordId || !ObjectId.isValid(recordId)) {
    throw new Error('Invalid record ID');
  }

  const user = await usersCollection.findOne({ _id: new ObjectId(userId) });
  const periodData = user.nutritionData?.[period];
  if (!periodData) throw new Error(`No data for period: ${period}`);


  const index = periodData.findIndex(entry => entry._id.toString() === recordId);
  if (index === -1) throw new Error('Record not found');


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
  
  const updatedRecord = {
    ...periodData[index],
    ...updatedData,
    protein: parseFloat(updatedData.protein),
    carbs: parseFloat(updatedData.carbs),
    fat: parseFloat(updatedData.fat),
    updatedAt: new Date()
  };

  const updateResult = await usersCollection.updateOne(
    {
      _id: new ObjectId(userId),
      [`nutritionData.${period}._id`]: new ObjectId(recordId)
    },
    {
      $set: {
        [`nutritionData.${period}.$`]: updatedRecord
      }
    }
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
export const deleteNutritionRecord = async (userId, recordId, period) => {
  if (!userId || !ObjectId.isValid(userId)) {
    throw new Error('Invalid user ID');
  }
  
  if (!recordId || !ObjectId.isValid(recordId)) {
    throw new Error('Invalid record ID');
  }

  const usersCollection = await users();
  const updateResult = await usersCollection.updateOne(
    { _id: new ObjectId(userId) },
    { $pull: { [`nutritionData.${period}`]: { _id: new ObjectId(recordId) } } }
  );

  if (!result.modifiedCount) throw new Error('Failed to delete record');
  return { deleted: true };

  return { message: 'Nutrition record deleted successfully' };
};

export const getUserMacroGoals = async (userId) => {
  if (!userId || !ObjectId.isValid(userId)) {
    throw new Error('Invalid user ID');
  }
  const usersCollection = await users();
  const user = await usersCollection.findOne({ _id: new ObjectId(userId) });
  if (!user) {
    throw new Error('User not found');
  }
  return user.goals || { protein: 0, carbs: 0, fat: 0 };
};

export const setUserMacroGoals = async (userId, protein, carbs, fat) => {
  if (!userId || !ObjectId.isValid(userId)) {
    throw new Error('Invalid user ID');
  }
  [protein, carbs, fat].forEach((v, i) => {
    if (v === undefined || isNaN(v) || v < 0) {
      throw new Error('Macro goal values must be non-negative numbers');
    }
  });

  const usersCollection = await users();
  const updateRes = await usersCollection.updateOne(
    { _id: new ObjectId(userId) },
    { $set: { goals: { protein: parseFloat(protein), carbs: parseFloat(carbs), fat: parseFloat(fat) } } }
  );
  if (!updateRes.modifiedCount) {
    throw new Error('Failed to update macro goals');
  }
  return { protein: parseFloat(protein), carbs: parseFloat(carbs), fat: parseFloat(fat) };
};