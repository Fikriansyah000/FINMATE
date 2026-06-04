"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpenseClassifierService = void 0;
const prisma_1 = require("../config/prisma");
// Rule-based keyword matching
const rules = {
    Makanan: ['nasi', 'ayam', 'mie', 'bakso', 'soto', 'kopi', 'teh', 'gorengan', 'makan', 'minum', 'warteg', 'kantin'],
    Transportasi: ['gojek', 'grab', 'bensin', 'parkir', 'bus', 'kereta', 'ojol', 'ojek', 'angkot', 'tol'],
    Belanja: ['beli baju', 'sepatu', 'tas', 'skincare', 'toko', 'online shop', 'shopee', 'tokopedia'],
    Tagihan: ['listrik', 'air', 'wifi', 'internet', 'pulsa', 'paket data', 'kos', 'kontrakan'],
    Hiburan: ['bioskop', 'game', 'netflix', 'spotify', 'konser', 'nongkrong'],
    Pendidikan: ['buku', 'kuliah', 'kampus', 'seminar', 'kursus', 'printer', 'fotocopy'],
    Kesehatan: ['obat', 'dokter', 'klinik', 'rumah sakit', 'vitamin', 'apotek'],
};
class ExpenseClassifierService {
    static async predictCategory(description) {
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
        const category = await prisma_1.prisma.category.findUnique({
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
exports.ExpenseClassifierService = ExpenseClassifierService;
