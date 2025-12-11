import type { FlowerStage } from '@/lib/types';
import { PlaceHolderImages, type ImagePlaceholder } from '@/lib/placeholder-images';

const getImage = (id: string): ImagePlaceholder => {
  const img = PlaceHolderImages.find(p => p.id === id);
  if (!img) {
    throw new Error(`Placeholder image with id "${id}" not found.`);
  }
  return img;
};

export const flowerStages: FlowerStage[] = [
  {
    level: 0,
    name: 'Seedling',
    image: getImage('flower-seedling'),
    message: "A new journey begins. Let's grow!",
  },
  {
    level: 1,
    name: 'Sprout',
    image: getImage('flower-sprout'),
    message: "You're making progress! Keep it up.",
  },
  {
    level: 2,
    name: 'Budding',
    image: getImage('flower-bud'),
    message: "So close to blooming! Don't stop now.",
  },
  {
    level: 3,
    name: 'In Full Bloom',
    image: getImage('flower-bloom'),
    message: 'Beautiful! You did it!',
  },
];

export const getFlowerStage = (completionPercentage: number): FlowerStage => {
  if (completionPercentage >= 1) return flowerStages[3];
  if (completionPercentage >= 0.66) return flowerStages[2];
  if (completionPercentage >= 0.33) return flowerStages[1];
  return flowerStages[0];
};
