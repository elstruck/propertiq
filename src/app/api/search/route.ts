import { NextRequest, NextResponse } from 'next/server';
import { collection, doc, addDoc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { generateMockSearchResult, generateMockSearchResultWithCriteria } from '@/lib/mockData';

// POST /api/search - Run a property search
export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { buyBoxId } = body;

    if (!buyBoxId) {
      return NextResponse.json({ error: 'Buy box ID is required' }, { status: 400 });
    }

    // In MVP mode, generate mock results
    if (process.env.MVP_MODE === 'true' || !db) {
      const searchResult = generateMockSearchResult(buyBoxId, userId);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return NextResponse.json({ result: searchResult });
    }

    // Production: Get buy box from Firestore and run real search
    const buyBoxRef = doc(db, 'buyBoxes', buyBoxId);
    const buyBoxDoc = await getDoc(buyBoxRef);
    
    if (!buyBoxDoc.exists()) {
      return NextResponse.json({ error: 'Buy box not found' }, { status: 404 });
    }

    // Get the buy box data and use it for the search
    const buyBoxData = buyBoxDoc.data();
    const buyBox = {
      id: buyBoxDoc.id,
      userId: buyBoxData.userId,
      name: buyBoxData.name,
      criteria: buyBoxData.criteria,
      createdAt: buyBoxData.createdAt,
      updatedAt: buyBoxData.updatedAt,
      isActive: buyBoxData.isActive,
    };
    
    // Here you would integrate with Zillow API or other data sources
    // For now, we'll use mock data with the actual buy box criteria
    const searchResult = generateMockSearchResultWithCriteria(buyBox, userId);
    
    // Save search result to Firestore
    const searchesRef = collection(db, 'searches');
    await addDoc(searchesRef, {
      ...searchResult,
      createdAt: new Date(),
    });

    return NextResponse.json({ result: searchResult });
  } catch (error) {
    console.error('Error running search:', error);
    return NextResponse.json({ error: 'Failed to run search' }, { status: 500 });
  }
} 