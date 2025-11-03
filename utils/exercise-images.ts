/**
 * Mapping of exercise image identifiers to local assets
 * This allows us to store simple strings in the database
 * and resolve them to actual image requires at runtime
 */

export const EXERCISE_IMAGES: Record<string, any> = {
  "downward-dog": require("@/assets/images/exercices/downward-dog.webp"),
  "child-pose": require("@/assets/images/exercices/child-pose.webp"),
  "cat-cow": require("@/assets/images/exercices/cat-cow.webp"),
  warrior: require("@/assets/images/exercices/warrior.webp"),
  default: require("@/assets/images/exercices/downward-dog.webp"),
};

/**
 * Gets the image source for an exercise
 * @param imageId - The image identifier stored in the database
 * @returns The image source that can be used with Image component
 */
export const getExerciseImage = (imageId: string): any => {
  return EXERCISE_IMAGES[imageId] || EXERCISE_IMAGES["default"];
};
