import { prisma } from '../config/prisma';

// Fallback rule-based keyword matching with English categories
const rules: Record<string, string[]> = {
  'Food & Dining': ['nasi', 'ayam', 'mie', 'bakso', 'soto', 'kopi', 'teh', 'gorengan', 'makan', 'minum', 'warteg', 'kantin', 'food', 'lunch', 'dinner', 'breakfast', 'restaurant'],
  'Transportation': ['gojek', 'grab', 'bensin', 'parkir', 'bus', 'kereta', 'ojol', 'ojek', 'angkot', 'tol', 'transport', 'taxi', 'fuel', 'parking'],
  'Shopping & Retail': ['beli baju', 'sepatu', 'tas', 'skincare', 'toko', 'online shop', 'shopee', 'tokopedia', 'shopping', 'clothes', 'shoes', 'bag'],
  'Utilities & Services': ['listrik', 'air', 'wifi', 'internet', 'pulsa', 'paket data', 'kos', 'kontrakan', 'electricity', 'water', 'phone', 'bill'],
  'Entertainment & Recreation': ['bioskop', 'game', 'netflix', 'spotify', 'konser', 'nongkrong', 'movie', 'cinema', 'games'],
  'Education': ['buku', 'kuliah', 'kampus', 'seminar', 'kursus', 'printer', 'fotocopy', 'book', 'course', 'college'],
  'Healthcare & Medical': ['obat', 'dokter', 'klinik', 'rumah sakit', 'vitamin', 'apotek', 'medicine', 'doctor', 'hospital', 'clinic'],
};

export class ExpenseClassifierService {
  public static async predictCategory(description: string) {
    const aiServiceUrl = process.env.AI_SERVICE_URL || 'http://localhost:8000';
    
    try {
      // Try to get prediction from AI service
      const response = await fetch(`${aiServiceUrl}/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ description }),
      });
      
      if (response.ok) {
        const data = await response.json();
        
        // Find category in DB by exact English name
        const category = await prisma.category.findUnique({
          where: { name: data.category },
        });

        if (category) {
          return {
            categoryId: category.id,
            confidence: data.confidence,
            source: 'tensorflow_fastapi',
          };
        } else {
          console.warn(`AI predicted category ${data.category} not found in database.`);
        }
      } else {
        console.warn(`AI Service returned status ${response.status}`);
      }
    } catch (error) {
      console.warn(`Failed to connect to AI Service at ${aiServiceUrl}:`, error);
    }

    // Fallback to rule-based logic
    console.log('Using rule_based_fallback for category prediction');
    const lowerDesc = description.toLowerCase();
    let predictedCategoryName = 'Others';
    let confidence = 0.5;

    for (const [category, keywords] of Object.entries(rules)) {
      if (keywords.some((keyword) => lowerDesc.includes(keyword))) {
        predictedCategoryName = category;
        confidence = 0.9;
        break;
      }
    }

    const category = await prisma.category.findUnique({
      where: { name: predictedCategoryName },
    });

    if (!category) {
      return {
        categoryId: null,
        confidence: 0.1,
        source: 'rule_based_fallback',
      };
    }

    return {
      categoryId: category.id,
      confidence,
      source: 'rule_based_fallback',
    };
  }
}
