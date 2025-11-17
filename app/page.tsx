'use client'
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Survey from "@/components/ui/survey";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from 'framer-motion'
import TypewriterText from "@/components/ui/typewrite";
import { Button } from "@/components/ui/button";
import { Sketch } from "@uiw/react-color";
import Rating from "@/components/ui/rating";
import { Axis3DIcon } from "lucide-react";
import axios from "axios";

const data = [{ name: "Ewan Fox", id: "0" }, { name: "Henry Ng", id: "1" }]
type Response = {
  id: string;
  rating: number | null;
  colour: string | null;
};

type Respondant = {
  id: string,
  colour: string,
  name: string
}


export default function Home() {
  let [state, setState] = useState<number>(0);
  let [personal_results, setPersonal] = useState({ name: '' })
  let [isFieldFilled, setIsFilled] = useState<boolean>(false);
  let [hex, setHex] = useState('#fff')
  let [index, setIndex] = useState<number>(0);
  let [responses, setResponses] = useState<Response[]>([]);
  let [data, setData] = useState<Respondant[]>([]);
  const callbackRef = useRef(false);
  const fillRef = useRef(false);


  useEffect(() => {
    const fetchData = async () => {
      try {
        let result = await axios.get("/api/respondant/get")
        console.log(result.data)
        setData(result.data.respondants)
        if (fillRef.current == false) {
          result.data.respondants.forEach((respondant: Respondant) => {
            setResponses(responses => [
              ...responses,
              { id: respondant.id, rating: null, colour: null }
            ])

          })
          fillRef.current = false;
        }
      } catch (err) {

      }
    }
    fetchData()
  }, [])

  const createParticipant = async () => {
    try {
      const response = await axios.post("/api/respondant/submit", { name: personal_results.name, colour: hex });
      console.log(response)

    } catch (err) {
      console.log("Failed to submit!")
    }
  }


  const createResponses = async () => {
    try {
      responses.forEach(async response => {
        console.log(response)
        const sresponse = await axios.post("/api/response/submit", { respondant_name: personal_results.name, colour: response.colour, subject_id: response.id, familiarity: response.rating });
        console.log(sresponse)
      })

    } catch (err) {
      console.log("Failed to submit!")
    }
  }


  useEffect(() => {
    if (callbackRef.current) {
      callbackRef.current = false;
      createResponses();
    }
  }, [responses]);

  return <AnimatePresence mode="wait">
    {state === 0 && <div className="flex w-full flex-col items-center font-sans dark:bg-black">
      <h1 className="bold pt-4 text-3xl font-semibold pb-4">Colour Psychology</h1>
      <div className="flex w-full flex-col items-center font-sans dark:bg-black">
        <TypewriterText text={`
Hello, and welcome to my experiment!
           
This is an experiment designed to test association between colours and people / personality.
 
Depending on when you participate, this will take ~2-10 minutes to complete.
 
I will be very thankful if you participate :)
 
Additionally, when the results come out, you might learn something about how others percieve you.

By participating, you give me permission to use your responses in the report.

            `} speed={0.01} rkey="1" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 24 }}
          className=""
        >
          <Button onClick={() => { setState(1) }}>Begin</Button>
        </motion.div>
      </div>
    </div>}

    {state === 1 && <div className="flex w-full flex-col items-center font-sans dark:bg-black">
      <h1 className="bold pt-4 text-3xl font-semibold pb-4">Colour Psychology</h1>
      <div className="flex w-full flex-col items-center font-sans dark:bg-black">
        <TypewriterText text={`First, I need to know a little bit about you.`} speed={0.06} rkey="2" />
        <div className="pb-2"></div>
        <motion.div
          key={"q1-1"}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 1, delay: 3 }}
          className="flex flex-col items-center font-sans dark:bg-black"
        >
          <Label className="text-xl pb-4">What is your name?</Label>
          <Input onBlur={(event) => {
            setPersonal({ ...personal_results, name: event.target.value })
            setIsFilled(true)
            console.log(isFieldFilled)
          }} placeholder="John Smith" required />
        </motion.div>
        {isFieldFilled && (
          <motion.div
            key="q1"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3 }}
            className="mt-4 text-white px-4 py-2 rounded"
          >
            <Button onClick={() => {


              setState(2)
            }}>Next</Button>
          </motion.div>
        )}
      </div>
    </div>}
    {state === 2 && <div className="flex w-full flex-col items-center font-sans dark:bg-black">
      <h1 className="bold pt-4 text-3xl font-semibold pb-4">Colour Psychology: An Experiment</h1>
      <div className="flex w-full flex-col items-center font-sans dark:bg-black">
        {(state == 2) && <motion.div
          key="q2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 4 }}
          className="flex flex-col items-center font-sans dark:bg-black"
        >
          <Label className="text-xl pb-4">What colour best represents you as a person?</Label>
          <Sketch style={{}} color={hex} onChange={(color) => {
            setHex(color.hex)
          }} />


          <motion.div
            key="next"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 1.5, delay: 2 }}
            className="mt-4 text-white px-4 py-2 rounded"
          >
            <Button onClick={() => {
              createParticipant();
              if (data) {
                if (data.length > 0) {
                  setState(2.5)
                } else {
                  setState(5)
                }
              } else {
                setState(5)
              }
            }}>Next</Button>
          </motion.div>


        </motion.div>}

      </div>
    </div>}
    {state === 2.5 && <div className="flex w-full flex-col items-center font-sans dark:bg-black">
      <h1 className="bold pt-4 text-3xl font-semibold pb-4">Colour Psychology</h1>
      <div className="flex w-full flex-col items-center font-sans dark:bg-black">
        <TypewriterText text={`
        Next, you will answer some questions about other people who have completed this survey before you.

        For each person, you will be asked how well you think you know them.

        Depending on your response, you may then be asked to choose a colour that represents that person.
          `} speed={0.04} rkey="2.5" />
        <div className="pb-2"></div>


        <motion.div
          key="q2.5"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.3, delay: 8 }}
          className="mt-4 text-white px-4 py-2 rounded"
        >
          <Button onClick={() => {


            setState(3)
          }}>Next</Button>
        </motion.div>

      </div>
    </div>}
    {state === 3 && <div className="flex w-full flex-col items-center font-sans dark:bg-black">
      <h1 className="bold pt-4 text-3xl font-semibold pb-4">Colour Psychology: An Experiment</h1>
      <div className="flex w-full flex-col items-center font-sans dark:bg-black">
        {(state == 3) && <motion.div
          key={`question-${index}`}
          initial={{ x: "100%", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: "-100%", opacity: 0 }}
          transition={{
            type: "spring",
            stiffness: 60,
            damping: 15,
            duration: 0.8,
          }}
          className="flex flex-col items-center font-sans dark:bg-black"
        >
          <Label className="text-xl pb-4">How well do you know<i>{data[index].name}</i>?</Label>
          <Rating handler={(selection) => {
            setResponses(prevItems => prevItems.map((item, i) => (i === index ? { ...prevItems[index], rating: selection } : item)))
          }} />


          <motion.div
            key={`question-${index}`}

            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 2, delay: 2 }}
            className="mt-4 text-white px-4 py-2 rounded"
          >
            <Button disabled={(responses[index].rating == null)} onClick={() => {
              if (responses[index].rating != null) {
                if (responses[index].rating > 3) {
                  setState(4)

                } else {
                  console.log(data, data.length, index)
                  if (data.length > index + 1) {
                    setIndex(cur => cur + 1)
                    setState(3)
                  } else {
                    setState(5)
                  }
                }
              }
            }}>Next</Button>
          </motion.div>


        </motion.div>}

      </div>
    </div>}
    {state == 4 && <div className="flex w-full flex-col items-center font-sans dark:bg-black">
      <h1 className="bold pt-4 text-3xl font-semibold pb-4">Colour Psychology: An Experiment</h1>
      <div className="flex w-full flex-col items-center font-sans dark:bg-black">
        {(state == 4) && <motion.div
          key={`question-${index}-4`}

          initial={{ x: "100%", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: "-100%", opacity: 0 }}
          transition={{
            type: "spring",
            stiffness: 60,
            damping: 15,
            duration: 0.8,
          }}
          className="flex flex-col items-center font-sans dark:bg-black"
        >
          <Label className="text-xl pb-4">What colour do you think best represents<i>{data[index].name}?</i></Label>
          <Sketch style={{}} color={hex} onChange={(color) => {
            setHex(color.hex)
          }} />


          <motion.div
            key={`question-${index}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 1.5, delay: 2 }}
            className="mt-4 text-white px-4 py-2 rounded flex flex-col items-center font-sans dark:bg-black"
          >

            <TypewriterText text={`
            ...The longer you think about this, the better the results will be`} speed={0.06} rkey="hm"></TypewriterText>

            <Button onClick={() => {
              console.log(index)
              if (data.length > index + 1) {
                setResponses(prevItems => prevItems.map((item, i) => (i === index ? { ...item, colour: hex } : item)))
                setIndex(cur => cur + 1)
                setState(3)
                setHex('#fff')
              } else {
                callbackRef.current = true;
                setResponses(prevItems => prevItems.map((item, i) => (i === index ? { ...item, colour: hex } : item)))
                setState(5)
              }
            }}>Next</Button>
          </motion.div>


        </motion.div>}

      </div>
    </div>}
    {state === 5 && <div className="flex w-full flex-col items-center font-sans dark:bg-black">
      <h1 className="bold pt-4 text-3xl font-semibold pb-4">Colour Psychology: An Experiment</h1>
      <TypewriterText text={`
          Saving your responses....
          Thank you so much for taking the time to participate!
          I'll be sure to let you know when the results are available.
            `} speed={0.06} rkey="t" />
    </div>}
  </AnimatePresence>
}
