export enum QuestionType {
  GOOD = 1,
  BAD = 0,
  // MEDIUM = 'meh'
}

export interface SupplementUse {
  relatedBodyBuildingGymPostUrls: string[];
  relatedScholarlyArticlesPostUrls: string[];
  relevanceScore: number;
}