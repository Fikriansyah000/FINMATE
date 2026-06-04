import { prisma } from '../config/prisma';

// Rule-based keyword matching
const rules: Record<string, string[]> = {
  Makanan: ['nasi', 'ayam', 'mie', 'bakso', 'soto', 'kopi', 'teh', 'gorengan', 'makan', 'minum', 'warteg', 'kantin'],
  Transportasi: ['gojek', 'grab', 'bensin', 'parkir', 'bus', 'kereta', 'ojol', 'ojek', 'angkot', 'tol'],
  Belanja: ['beli baju', 'sepatu', 'tas', 'skincare', 'toko', 'online shop', 'shopee', 'tokopedia'],
  Tagihan: ['listrik', 'air', 'wifi', 'internet', 'pulsa', 'paket data', 'kos', 'kontrakan'],
  Hiburan: ['bioskop', 'game', 'netflix', 'spotify', 'konser', 'nongkrong'],
  Pendidikan: ['buku', 'kuliah', 'kampus', 'seminar', 'kursus', 'printer', 'fotocopy'],
  Kesehatan: ['obat', 'dokter', 'klinik', 'rumah sakit', 'vitamin', 'apotek'],
};

export class ExpenseClassifierService {
  public static async predictCategory(description: string) {
    const lowerDesc = description.toLowerCase();
    let predictedCategoryName = 'Lainnya';
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
      // Fallback to default if somehow missing
      return {
        categoryId: null,
        confidence: 0.1,
        source: 'rule_based_fallback',
      };
    }

    return {
      categoryId: category.id,
      confidence,
      source: 'rule_based',
    };
  }
}
