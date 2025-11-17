import { NextRequest, NextResponse } from "next/server";
import {connect} from "../../../../lib/db";
import { Response } from "@/models/responseModel";
import { nanoid } from 'nanoid'

connect()
export async function POST(request: NextRequest)  {
    try {
        const reqBody = await request.json();
        const {familiarity, colour, respondant_name, subject_id} = reqBody;
        
        const newResponse = new Response({
            respondant_name,
            colour,
            subject_id,
            familiarity
        })

        const savedResponse = await newResponse.save();
        return NextResponse.json({message: "Response saved!", success: true, savedResponse})


    } catch (err) {

    }
}