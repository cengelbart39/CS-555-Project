import { meals } from '../config/mongoCollections.js';

export const getDailyMealTotals = async () => {
  const mealsCollection = await meals();

  const aggregation = await mealsCollection.aggregate([
    {
      $group: {
        _id: "$date", // expects "YYYY-MM-DD" format
        totalCalories: { $sum: "$calories" }
      }
    },
    {
      $project: {
        _id: 0,
        date: "$_id",
        totalCalories: 1
      }
    }
  ]).toArray();

  return aggregation;
};