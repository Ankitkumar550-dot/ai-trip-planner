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

        let photoUrl = null;
        if (result?.data?.places?.[0]?.photos?.[0]?.name) {
            photoUrl = `https://places.googleapis.com/v1/${result.data.places[0].photos[0].name}/media?maxHeightPx=1000&maxWidthPx=1000&key=${process.env.GOOGLE_PLACE_API_KEY}`;
        }

        return NextResponse.json({ ...result?.data, photoUrl });
    } catch (e: any) {
        console.error("Google Place API Error:", e.response?.data || e.message);
        return NextResponse.json({ error: e.response?.data || e.message }, { status: 500 });
    }

}