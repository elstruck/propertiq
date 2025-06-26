import { NextRequest, NextResponse } from 'next/server';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { BuyBox } from '@/types';
import { mockBuyBoxes } from '@/lib/mockData';

// GET /api/buybox - Get all buy boxes for authenticated user
export async function GET(request: NextRequest) {
  try {
    // Get user ID from headers or auth token
    const userId = request.headers.get('x-user-id');
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // In MVP mode, return mock data
    if (process.env.MVP_MODE === 'true' || !db) {
      const userBuyBoxes = mockBuyBoxes.filter(bb => bb.userId === userId);
      return NextResponse.json({ buyBoxes: userBuyBoxes });
    }

    // Production: Get from Firestore
    const buyBoxesRef = collection(db, 'buyBoxes');
    const q = query(buyBoxesRef, where('userId', '==', userId));
    const snapshot = await getDocs(q);
    
    const buyBoxes: BuyBox[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      buyBoxes.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as BuyBox);
    });

    return NextResponse.json({ buyBoxes });
  } catch (error) {
    console.error('Error fetching buy boxes:', error);
    return NextResponse.json({ error: 'Failed to fetch buy boxes' }, { status: 500 });
  }
}

// POST /api/buybox - Create a new buy box
export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    
    console.log('API Route Debug - User ID:', userId);
    console.log('API Route Debug - MVP_MODE:', process.env.MVP_MODE);
    console.log('API Route Debug - DB available:', !!db);
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, criteria } = body;

    if (!name || !criteria) {
      return NextResponse.json({ error: 'Name and criteria are required' }, { status: 400 });
    }

    const buyBoxData = {
      userId,
      name,
      criteria,
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true,
    };

    // In MVP mode, just return success with mock ID
    if (process.env.MVP_MODE === 'true' || !db) {
      console.log('API Route Debug - Using MVP mode or no DB');
      const mockBuyBox: BuyBox = {
        id: `buybox-${Date.now()}`,
        ...buyBoxData,
      };
      return NextResponse.json({ buyBox: mockBuyBox }, { status: 201 });
    }

    // Production: Save to Firestore
    console.log('API Route Debug - Attempting to save to Firestore');
    const buyBoxesRef = collection(db, 'buyBoxes');
    const docRef = await addDoc(buyBoxesRef, buyBoxData);
    
    const buyBox: BuyBox = {
      id: docRef.id,
      ...buyBoxData,
    };

    console.log('API Route Debug - Successfully saved to Firestore with ID:', docRef.id);
    return NextResponse.json({ buyBox }, { status: 201 });
  } catch (error) {
    console.error('Error creating buy box:', error);
    return NextResponse.json({ error: 'Failed to create buy box' }, { status: 500 });
  }
} 