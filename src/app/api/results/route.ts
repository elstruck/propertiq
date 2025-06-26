import { NextRequest, NextResponse } from 'next/server';
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { SearchResult } from '@/types';
import { generateMockSearchResult } from '@/lib/mockData';

// GET /api/results - Get search results for authenticated user
export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // In MVP mode, return mock search results
    if (process.env.MVP_MODE === 'true' || !db) {
      const mockResults: SearchResult[] = [
        generateMockSearchResult('buybox-1', userId),
        generateMockSearchResult('buybox-2', userId),
      ];
      
      // Sort by created date descending
      mockResults.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      
      return NextResponse.json({ results: mockResults });
    }

    // Production: Get from Firestore
    const searchesRef = collection(db, 'searches');
    const q = query(
      searchesRef, 
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(20)
    );
    const snapshot = await getDocs(q);
    
    const results: SearchResult[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      results.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
      } as SearchResult);
    });

    return NextResponse.json({ results });
  } catch (error) {
    console.error('Error fetching search results:', error);
    return NextResponse.json({ error: 'Failed to fetch search results' }, { status: 500 });
  }
} 