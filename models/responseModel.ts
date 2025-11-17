import mongoose, {ObjectId} from "mongoose";

export interface ResponseSchema {
    subject_id: String,
    respondant_name: String,
    colour: String,
    familiarity: Number
}

const responseSchema = new mongoose.Schema<ResponseSchema>({
    subject_id: String,
    respondant_name: String,
    colour: String,
    familiarity: String
})

export const Response = mongoose.models.responses as mongoose.Model<ResponseSchema> || mongoose.model("responses", responseSchema)