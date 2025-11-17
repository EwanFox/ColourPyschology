import { NextRequest, NextResponse } from "next/server";
import {connect} from "../../../../lib/db";
import { Respondant } from "@/models/respondantModel";
import { nanoid } from 'nanoid'

connect()
export async function GET(request: NextRequest)  {
    try {
        const respondants = await Respondant.find();
        return NextResponse.json({message: "Respondants found", success: true, respondants})


    } catch (err) {

    }
}