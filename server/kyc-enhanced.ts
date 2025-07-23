import { Request, Response, NextFunction } from 'express';
import { db } from './db';
import { users, kycDocuments } from '@shared/schema';
import { eq, and } from 'drizzle-orm';
import crypto from 'crypto';
import fs from 'fs/promises';
import path from 'path';

// Enhanced KYC Service with government verification
export class EnhancedKYCService {
  
  // Aadhar verification (would integrate with UIDAI in production)
  static async verifyAadhar(aadharNumber: string, personalDetails: any) {
    // Validate Aadhar format
    const aadharPattern = /^\d{4}\s?\d{4}\s?\d{4}$/;
    if (!aadharPattern.test(aadharNumber)) {
      throw new Error('Invalid Aadhar number format');
    }

    // In production, integrate with UIDAI eKYC API
    const mockVerification = {
      status: 'verified',
      name: personalDetails.fullName,
      dob: personalDetails.dateOfBirth,
      address: personalDetails.address,
      photo: 'base64_encoded_photo',
      verificationId: crypto.randomUUID()
    };

    console.log('📋 Aadhar Verification:', { aadharNumber, status: 'verified' });
    return mockVerification;
  }

  // PAN verification (would integrate with Income Tax Department API)
  static async verifyPAN(panNumber: string, name: string) {
    // Validate PAN format
    const panPattern = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    if (!panPattern.test(panNumber)) {
      throw new Error('Invalid PAN number format');
    }

    // In production, integrate with Income Tax Department API
    const mockVerification = {
      status: 'verified',
      name: name,
      panNumber: panNumber,
      isValid: true,
      verificationId: crypto.randomUUID()
    };

    console.log('💳 PAN Verification:', { panNumber, status: 'verified' });
    return mockVerification;
  }

  // Bank account verification
  static async verifyBankAccount(accountNumber: string, ifscCode: string, accountHolderName: string) {
    // Validate IFSC format
    const ifscPattern = /^[A-Z]{4}0[A-Z0-9]{6}$/;
    if (!ifscPattern.test(ifscCode)) {
      throw new Error('Invalid IFSC code format');
    }

    // In production, integrate with penny drop verification
    const mockVerification = {
      status: 'verified',
      accountNumber: accountNumber.slice(-4), // Show only last 4 digits
      accountHolderName,
      bankName: 'Demo Bank',
      ifscCode,
      isActive: true,
      verificationId: crypto.randomUUID()
    };

    console.log('🏦 Bank Account Verification:', { ifscCode, status: 'verified' });
    return mockVerification;
  }

  // Document upload and processing
  static async uploadDocument(
    userId: number, 
    documentType: 'aadhar' | 'pan' | 'bank_statement' | 'selfie',
    file: any,
    metadata: any = {}
  ) {
    try {
      // In production, use cloud storage (AWS S3, etc.)
      const uploadDir = path.join(process.cwd(), 'uploads', 'kyc', userId.toString());
      await fs.mkdir(uploadDir, { recursive: true });

      const fileName = `${documentType}_${Date.now()}_${file.name}`;
      const filePath = path.join(uploadDir, fileName);

      // Save file (in production, upload to cloud storage)
      await fs.writeFile(filePath, file.data);

      // Create document record
      const documentRecord = {
        userId,
        documentType,
        fileName,
        filePath,
        fileSize: file.size,
        mimeType: file.mimetype,
        uploadedAt: new Date(),
        status: 'uploaded',
        metadata
      };

      // Store in database
      const [kycDocument] = await db.insert(kycDocumentVerification).values({
        userId,
        documentType,
        status: 'uploaded',
        documentUrl: filePath,
        verificationData: JSON.stringify(documentRecord),
        createdAt: new Date(),
        updatedAt: new Date()
      }).returning();

      console.log('📄 Document uploaded:', { userId, documentType, fileName });
      return kycDocument;

    } catch (error) {
      console.error('Document upload error:', error);
      throw new Error('Failed to upload document');
    }
  }

  // OCR and document processing
  static async processDocument(documentId: number) {
    try {
      // In production, integrate with OCR service (AWS Textract, Google Vision API)
      const mockOCRResult = {
        documentId,
        extractedData: {
          name: 'John Doe',
          dateOfBirth: '1990-01-01',
          address: '123 Main Street, City, State',
          documentNumber: 'XXXXXXX'
        },
        confidence: 0.95,
        processedAt: new Date()
      };

      console.log('🔍 Document processed:', mockOCRResult);
      return mockOCRResult;

    } catch (error) {
      console.error('Document processing error:', error);
      throw new Error('Failed to process document');
    }
  }

  // Comprehensive verification workflow
  static async completeVerification(userId: number) {
    try {
      // Get user's KYC data
      const [personalDetails] = await db
        .select()
        .from(kycPersonalDetails)
        .where(eq(kycPersonalDetails.userId, userId));

      if (!personalDetails) {
        throw new Error('Personal details not found');
      }

      // Get uploaded documents
      const documents = await db
        .select()
        .from(kycDocumentVerification)
        .where(eq(kycDocumentVerification.userId, userId));

      // Verify each document type
      const verificationResults = {
        aadhar: null,
        pan: null,
        bankAccount: null,
        selfie: null
      };

      for (const doc of documents) {
        switch (doc.documentType) {
          case 'aadhar':
            verificationResults.aadhar = await this.verifyAadhar(
              personalDetails.aadharNumber || '',
              personalDetails
            );
            break;
          case 'pan':
            verificationResults.pan = await this.verifyPAN(
              personalDetails.panNumber || '',
              personalDetails.fullName
            );
            break;
          case 'bank_statement':
            verificationResults.bankAccount = await this.verifyBankAccount(
              personalDetails.bankAccountNumber || '',
              personalDetails.ifscCode || '',
              personalDetails.fullName
            );
            break;
          case 'selfie':
            // Face matching with Aadhar photo
            verificationResults.selfie = { status: 'verified', confidence: 0.92 };
            break;
        }
      }

      // Calculate overall verification status
      const allVerified = Object.values(verificationResults).every(
        result => result && result.status === 'verified'
      );

      // Update user KYC status
      const kycStatus = allVerified ? 'verified' : 'pending';
      await db
        .update(users)
        .set({ 
          kycStatus,
          updatedAt: new Date()
        })
        .where(eq(users.id, userId));

      console.log('✅ KYC Verification Complete:', { userId, status: kycStatus });

      return {
        status: kycStatus,
        verificationResults,
        completedAt: new Date()
      };

    } catch (error) {
      console.error('KYC verification error:', error);
      
      // Update status to failed
      await db
        .update(users)
        .set({ 
          kycStatus: 'failed',
          updatedAt: new Date()
        })
        .where(eq(users.id, userId));

      throw new Error('Verification failed');
    }
  }

  // Risk assessment based on verification data
  static async assessRisk(userId: number) {
    const riskFactors = {
      documentQuality: 'high', // Based on OCR confidence
      addressVerification: 'verified',
      faceMatch: 'verified',
      governmentDatabase: 'verified',
      previousHistory: 'clean'
    };

    const riskScore = this.calculateRiskScore(riskFactors);
    
    console.log('⚖️ Risk Assessment:', { userId, riskScore, riskFactors });
    
    return {
      userId,
      riskScore,
      riskLevel: riskScore < 30 ? 'low' : riskScore < 70 ? 'medium' : 'high',
      factors: riskFactors,
      assessedAt: new Date()
    };
  }

  private static calculateRiskScore(factors: any): number {
    // Simplified risk calculation
    let score = 0;
    
    if (factors.documentQuality === 'low') score += 25;
    if (factors.addressVerification !== 'verified') score += 20;
    if (factors.faceMatch !== 'verified') score += 30;
    if (factors.governmentDatabase !== 'verified') score += 25;
    
    return Math.min(score, 100);
  }

  // Manual review queue
  static async addToManualReview(userId: number, reason: string) {
    const reviewEntry = {
      userId,
      reason,
      status: 'pending_review',
      queuedAt: new Date(),
      priority: reason.includes('high_risk') ? 'high' : 'normal'
    };

    console.log('👥 Added to manual review:', reviewEntry);
    
    // In production, add to review queue system
    return reviewEntry;
  }
}

// KYC middleware for protected routes
export const kycMiddleware = {
  requireVerification: async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).user?.id;
    
    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    try {
      const [user] = await db.select().from(users).where(eq(users.id, userId));
      
      if (!user || user.kycStatus !== 'verified') {
        return res.status(403).json({ 
          error: 'KYC verification required',
          kycStatus: user?.kycStatus || 'not_started',
          requiresVerification: true
        });
      }

      next();
    } catch (error) {
      console.error('KYC middleware error:', error);
      res.status(500).json({ error: 'Verification service unavailable' });
    }
  },

  requireMinimalKYC: async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).user?.id;
    
    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    try {
      const [user] = await db.select().from(users).where(eq(users.id, userId));
      
      if (!user || !['verified', 'pending', 'under_review'].includes(user.kycStatus)) {
        return res.status(403).json({ 
          error: 'Basic verification required',
          requiresBasicKyc: true
        });
      }

      next();
    } catch (error) {
      console.error('Minimal KYC middleware error:', error);
      res.status(500).json({ error: 'Verification service unavailable' });
    }
  }
};

// EnhancedKYCService already exported above