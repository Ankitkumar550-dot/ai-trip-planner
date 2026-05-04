import axios from "axios";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const { placeName } = await req.json();
    const BASE_URL = 'https://places.googleapis.com/v1/places:searchText'
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': process?.env?.GOOGLE_PLACE_API_KEY,
            'X-Goog-FieldMask': 'places.photos,places.displayName'
        }
    };
    try {
        const result = await axios.post(BASE_URL, {
            textQuery: placeName
        }, config);
        return NextResponse.json(result?.data);
    } catch (e: any) {
        console.error("Google Place API Error:", e.response?.data || e.message);
        return NextResponse.json({ error: e.response?.data || e.message }, { status: 500 });
    }

}