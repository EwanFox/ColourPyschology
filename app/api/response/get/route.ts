import { NextRequest, NextResponse } from "next/server";
import {connect} from "../../../../lib/db";
import { Response } from "@/models/responseModel";
import { nanoid } from 'nanoid'

connect()
export async function GET(request: NextRequest)  {
    try {
        const responses = await Response.find().maxTimeMS(10000000).lean().exec();
        return NextResponse.json({message: "Responses found", success: true, data: JSON.stringify(responses)})


    } catch (err) {
        console.log(err)
        return NextResponse.json({error: err}, {status: 500})
    }
}