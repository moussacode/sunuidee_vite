import { getCategorieFromAI } from "../api/openrouter";

// services/aiService.js
export const detectCategorie = async (titre, description) => {
    
  return await getCategorieFromAI(titre, description);
};