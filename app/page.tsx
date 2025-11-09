'use client'
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Survey from "@/components/ui/survey";
import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion } from 'framer-motion'
import TypewriterText from "@/components/ui/typewrite";
import { Button } from "@/components/ui/button";
import { Sketch } from "@uiw/react-color";

const data = [{ name: "Ewan Fox", id: 0 }]


export default function Home() {
  let [state, setState] = useState<number>(0);
  let [personal_results, setPersonal] = useState({})
  let [isFieldFilled, setIsFilled] = useState<boolean>(false);
  let [hex, setHex] = useState('#fff')

  if (state == 0) {
    return (
      <div className="flex w-full flex-col min-h-screen items-center font-sans dark:bg-black">
        <h1 className="bold pt-4 text-3xl font-semibold pb-4">Colour Psychology: An Experiment</h1>
        <div className="flex w-full flex-col min-h-screen items-center font-sans dark:bg-black">
          <TypewriterText text={`
          Hello, and welcome to my experiment!
          This is an experiment designed to test association between colours and people / personality.
          Depending on when you participate, this will take ~2-10 minutes to complete.
          Not only will I be very thankful if you participate,
          but additionally when the results come out, you will learn about what colour your friends associate you with.
            `} speed={0.06} />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 15 }}
            className=""
          >
            <Button onClick={() => { setState(1) }}>Begin</Button>
          </motion.div>
        </div>
      </div>
    )
  } else if (state == 1) {
    return (<div className="flex w-full flex-col min-h-screen items-center font-sans dark:bg-black">
      <h1 className="bold pt-4 text-3xl font-semibold pb-4">Colour Psychology: An Experiment</h1>
      <div className="flex w-full flex-col min-h-screen items-center font-sans dark:bg-black">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="flex flex-col items-center font-sans dark:bg-black"
        >
          <Label className="text-xl pb-4">What is your name?</Label>
          <Input onBlur={(event) => {
            setPersonal({ ...personal_results, name: event.target.value })
            setIsFilled(true)
            console.log(isFieldFilled)
          }} placeholder="John Smith" required />
        </motion.div>
        <AnimatePresence>
          {isFieldFilled && (
            <motion.div
              key="next"
              initial={{ opacity: 0, y: 10 }}       // start faded + lower
              animate={{ opacity: 1, y: 0 }}       // fade + slide in
              exit={{ opacity: 0, y: 10 }}         // fade out when removed
              transition={{ duration: 0.3 }}
              className="mt-4 text-white px-4 py-2 rounded"
            >
              <Button onClick={() => {
                
                
                setState(2)
                }}>Next</Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>)
  } 
  
  if (state == 2) {
    return <div className="flex w-full flex-col min-h-screen items-center font-sans dark:bg-black">
      <h1 className="bold pt-4 text-3xl font-semibold pb-4">Colour Psychology: An Experiment</h1>
      <div className="flex w-full flex-col min-h-screen items-center font-sans dark:bg-black">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="flex flex-col min-h-screen items-center font-sans dark:bg-black"
        >
          <Label className="text-xl pb-4">What colour best represents you as a person?</Label>
          <Sketch style={{}} color={hex} onChange={(color) => {
            setHex(color.hex)
          }}/>


            <motion.div
              key="next"
              initial={{ opacity: 0, y: 10 }}       // start faded + lower
              animate={{ opacity: 1, y: 0 }}       // fade + slide in
              exit={{ opacity: 0, y: 10 }}         // fade out when removed
              transition={{ duration: 1.5, delay: 2}}
              className="mt-4 text-white px-4 py-2 rounded"
            >
              <Button onClick={() => {
                
                setState(3)
                }}>Next</Button>
            </motion.div>


        </motion.div>
      </div>
    </div>
  }



}
