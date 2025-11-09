'use client'
import { useState } from "react";
import { Button } from "./button";

type RatingHandler = (selection: number) => void
type RatingProps = {handler: RatingHandler}

export default function Rating(props: RatingProps) {
    let [selection, setSelection] = useState<number>(0)


    let _setSelection = (s: number) => {
        setSelection(s)
        props.handler(s)
    }
     
    return (<div><div className="flex flex-row gap-2">
        <Button onClick={() => _setSelection(1)} variant={selection == 1 ? 'default' : 'secondary'}>1</Button>
        <Button onClick={() => _setSelection(2)} variant={selection == 2 ? 'default' : 'secondary'}>2</Button>
        <Button onClick={() => _setSelection(3)} variant={selection == 3 ? 'default' : 'secondary'}>3</Button>
        <Button onClick={() => _setSelection(4)} variant={selection == 4 ? 'default' : 'secondary'}>4</Button>
        <Button onClick={() => _setSelection(5)} variant={selection == 5 ? 'default' : 'secondary'}>5</Button>
        <Button onClick={() => _setSelection(6)} variant={selection == 6 ? 'default' : 'secondary'}>6</Button>
        <Button onClick={() => _setSelection(7)} variant={selection == 7 ? 'default' : 'secondary'}>7</Button>
        <Button onClick={() => _setSelection(8)} variant={selection == 8 ? 'default' : 'secondary'}>8</Button>
        <Button onClick={() => _setSelection(9)} variant={selection == 9 ? 'default' : 'secondary'}>9</Button>
        <Button onClick={() => _setSelection(10)} variant={selection == 10 ? 'default' : 'secondary'}>10</Button>

    </div>
    <p className="text-sm float-left">Never seen</p>
    <p className="text-sm float-right">Know very well</p>
    </div>)
}