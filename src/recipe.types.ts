import brownies from '../test/fixtures/brownies';

export type RecipeJson = typeof brownies

export type InstructionSchema = {
  '@type': string;
  text: string;
  position: number;
  name?: string;
  url?: string;
}
export type RecipeSchema = {
  recipeInstructions: InstructionSchema[];
}