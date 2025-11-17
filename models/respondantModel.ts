import mongoose, {ObjectId} from "mongoose";

export interface RespondantSchema {
    id: string,
    name: string,
    colour: string
}

const respondantSchema = new mongoose.Schema<RespondantSchema>({
    id: String,
    name: String,
    colour: String
})

export const Respondant = mongoose.models.respondants as mongoose.Model<RespondantSchema> || mongoose.model("respondants", respondantSchema)