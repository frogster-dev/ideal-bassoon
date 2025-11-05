/**
 * Mapping of exercise image identifiers to local assets
 * This allows us to store simple strings in the database
 * and resolve them to actual image requires at runtime
 *
 * ⚙️  AUTO-GENERATED FILE - DO NOT EDIT MANUALLY
 * Run 'npm run generate:exercise-images' to regenerate this file
 */

export const EXERCISE_IMAGES: Record<string, any> = {
  "crossed-leg-forward-fold": require("@/assets/images/exercices/crossed-leg-forward-fold-min.webp"),
  "butterfly-stretch": require("@/assets/images/exercices/butterfly-stretch-min.webp"),
  "harmstring-stretch-right": require("@/assets/images/exercices/harmstring-stretch-right-min.webp"),
  "harmstring-stretch-left": require("@/assets/images/exercices/harmstring-stretch-left-min.webp"),
  "yogi-squat": require("@/assets/images/exercices/yogi-squat-min.webp"),
  "extended-puppy-pose": require("@/assets/images/exercices/extended-puppy-pose.webp"),
  "lunge-plus-upper-body-opener-right-leg": require("@/assets/images/exercices/lunge-plus-upper-body-oppener-right-leg.webp"),
  "lunge-plus-upper-body-opener-left-leg": require("@/assets/images/exercices/lunge-plus-upper-body-oppener-left-leg.webp"),
  "camel-stretch": require("@/assets/images/exercices/camel-stretch.webp"),
  "child-s-pose": require("@/assets/images/exercices/child-s-pose.webp"),
  "seated-forward-fold": require("@/assets/images/exercices/seated-forward-fold.webp"),
  "harmstring-stretch-right-leg": require("@/assets/images/exercices/harmstring-stretch-right-leg-min.webp"),
  "harmstring-stretch-left-leg": require("@/assets/images/exercices/harmstring-stretch-left-leg-min.webp"),
  "gate-pose-bends-right-leg": require("@/assets/images/exercices/gate-pose-bends-right-leg-min.webp"),
  "gate-pose-bends-left-leg": require("@/assets/images/exercices/gate-pose-bends-left-leg-min.webp"),
  "pigeon-pose-left-leg": require("@/assets/images/exercices/pigeon-pose-left-leg.webp"),
  "pigeon-pose-right-leg": require("@/assets/images/exercices/pigeon-pose-right-leg.webp"),
  cobra: require("@/assets/images/exercices/cobra-min.webp"),
  "downward-dog": require("@/assets/images/exercices/downward-dog-min.webp"),
  "seated-quad-stretch-left-leg": require("@/assets/images/exercices/seated-quad-stretch-left-leg-min.webp"),
  "seated-quad-stretch-right-leg": require("@/assets/images/exercices/seated-quad-stretch-right-leg-min.webp"),
  "wide-leg-side-stretch-left-leg": require("@/assets/images/exercices/wide-leg-side-stretch-left-leg-min.webp"),
  "wide-leg-side-stretch-right-leg": require("@/assets/images/exercices/wide-leg-side-stretch-right-leg-min.webp"),
  "forward-fold-harmstring-stretch": require("@/assets/images/exercices/forward-fold-harmstring-stretch-min.webp"),
  "double-legged-quad-stretch": require("@/assets/images/exercices/double-legged-quad-stretch-min.webp"),
  "frog-stretch": require("@/assets/images/exercices/frog-stretch-min.webp"),
  "baby-pose": require("@/assets/images/exercices/baby-pose-min.webp"),
  "left-side-baby-pose": require("@/assets/images/exercices/left-side-baby-pose-min.webp"),
  "right-side-baby-pose": require("@/assets/images/exercices/right-side-baby-pose-min.webp"),
  "thread-the-needle-right": require("@/assets/images/exercices/thread-the-needle-right-min.webp"),
  "thread-the-needle-left": require("@/assets/images/exercices/thread-the-needle-left-min.webp"),
  "runners-stretch-right-leg": require("@/assets/images/exercices/runners-stretch-right-leg-min.webp"),
  "runners-stretch-left-leg": require("@/assets/images/exercices/runners-stretch-left-leg-min.webp"),
  "kneeling-harmstring-stretch-left-leg": require("@/assets/images/exercices/kneeling-harmstring-stretch-left-leg-min.webp"),
  "kneeling-harmstring-stretch-right-leg": require("@/assets/images/exercices/kneeling-harmstring-stretch-right-leg-min.webp"),
  "adductor-stretch-left-leg": require("@/assets/images/exercices/adductor-stretch-left-leg-min.webp"),
  "adductor-stretch-right-leg": require("@/assets/images/exercices/adductor-stretch-right-leg-min.webp"),
  "tricep-stretch-left": require("@/assets/images/exercices/tricep-stretch-left.webp"),
  "tricep-stretch-right": require("@/assets/images/exercices/tricep-stretch-right.webp"),
  "shoulder-stretch-left": require("@/assets/images/exercices/shoulder-stretch-left.webp"),
  "shoulder-stretch-right": require("@/assets/images/exercices/shoulder-stretch-right.webp"),
  "hanging-harmstring-stretch": require("@/assets/images/exercices/hanging-harmstring-stretch.webp"),
  "side-neck-stretch-left": require("@/assets/images/exercices/side-neck-stretch-left.webp"),
  "side-neck-stretch-right": require("@/assets/images/exercices/side-neck-stretch-right.webp"),
  default: require("@/assets/images/exercices/downward-dog-min.webp"),
};

/**
 * Gets the image source for an exercise
 * @param imageId - The image identifier stored in the database
 * @returns The image source that can be used with Image component
 */
export const getExerciseImage = (imageId: string): any => {
  return EXERCISE_IMAGES[imageId] || EXERCISE_IMAGES["default"];
};
