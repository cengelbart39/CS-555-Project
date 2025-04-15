import bcrypt from 'bcrypt';
import { ObjectId } from 'mongodb';
import { users } from '../config/mongoCollections.js';

export const createUser = async (username, password, firstName, lastName) => {
  // Validation
  if (!username || !password || !firstName || !lastName) {
    throw new Error('All fields are required');
  }
  
  if (typeof username !== 'string' || username.trim().length < 3) {
    throw new Error('Username must be at least 3 characters');
  }
  
  if (typeof password !== 'string' || password.trim().length < 6) {
    throw new Error('Password must be at least 6 characters');
  }

  // Check if username already exists
  const usersCollection = await users();
  const existingUser = await usersCollection.findOne({ username: username.toLowerCase() });
  
  if (existingUser) {
    throw new Error('Username already exists');
  }

  // Hash password and create user
  const hashedPassword = await bcrypt.hash(password, 10);
  
  const newUser = {
    username: username.toLowerCase(),
    password: hashedPassword,
    firstName: firstName.trim(),
    lastName: lastName.trim(),
    createdAt: new Date(),
    nutritionData: [] // Initially empty array to store nutrition records
  };

  const insertInfo = await usersCollection.insertOne(newUser);
  
  if (!insertInfo.acknowledged) {
    throw new Error('Could not add user');
  }

  return { 
    _id: insertInfo.insertedId, 
    username: newUser.username,
    firstName: newUser.firstName,
    lastName: newUser.lastName
  };
};

export const checkUser = async (username, password) => {
  // Validation
  if (!username || !password) {
    throw new Error('Username and password are required');
  }

  // Get user from database
  const usersCollection = await users();
  const user = await usersCollection.findOne({ username: username.toLowerCase() });
  
  if (!user) {
    throw new Error('Either the username or password is invalid');
  }

  // Compare passwords
  const passwordMatch = await bcrypt.compare(password, user.password);
  
  if (!passwordMatch) {
    throw new Error('Either the username or password is invalid');
  }

  return {
    _id: user._id,
    username: user.username,
    firstName: user.firstName,
    lastName: user.lastName
  };
};

export const getUserById = async (id) => {
  if (!id || !ObjectId.isValid(id)) {
    throw new Error('Invalid user ID');
  }

  const usersCollection = await users();
  const user = await usersCollection.findOne({ _id: new ObjectId(id) });
  
  if (!user) {
    throw new Error('User not found');
  }

  return {
    _id: user._id,
    username: user.username,
    firstName: user.firstName,
    lastName: user.lastName,
    createdAt: user.createdAt
  };
};