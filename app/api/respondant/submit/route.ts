import { NextRequest, NextResponse } from "next/server";
import {connect} from "../../../../lib/db";
import { Respondant } from "@/models/respondantModel";
import { nanoid } from 'nanoid'

connect()
export async function POST(request: NextRequest)  {
    try {
        const reqBody = await request.json();
        const {name, colour} = reqBody;
        
        const newRespondant = new Respondant({
            name,
            colour,
            id: nanoid(8)
        })

        const savedRespondant = await newRespondant.save();
        return NextResponse.json({message: "Respondant saved!", success: true, savedRespondant})


    } catch (err) {

    }
}