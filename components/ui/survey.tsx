import { useState } from "react"
import Rating from "./rating"
import { Input } from "./input"

type SurveyInputData = {
    name: string,
    id: number
}

type Desc = string | null

export default function Survey(data: SurveyInputData) {

    let [rating, setRating] = useState<number>(0)
    let [description, setDescription] = useState<Desc>(null)
    let ratingHandler  = (selection : number) => {
        setRating(selection)
    }

    return (<div className="flex flex-col gap-3">
        <h1 className="text-lg font-semibold">{data.name}</h1>
        <p>How well do you know this person?</p>
        <Rating handler={ratingHandler}></Rating>
        {(rating >= 3) && <div>
            <p>Please provide one word to describe this person</p>
            <Input onBlur={(event) => {setDescription(event.target.value)}} placeholder="Enter your word here" required id={data.id.toString()+"-adjective"}></Input>
        </div>}
    </div>)
}