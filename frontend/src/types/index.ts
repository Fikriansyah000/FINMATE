export interface Category {
  id: string;
  name: string;
  description?: string;
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  transactionDate: string;
  aiConfidence?: number;
  predictionSource?: string;
  category: Category;
}
