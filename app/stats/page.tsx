'use client'
import { promises as fs } from 'fs'
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
import { Axis3DIcon, ScatterChart } from "lucide-react";
import axios from "axios";
import respondants from "../respondants.json";
import responses from "../responses.json";
import Color from 'colorjs.io';
import { getDeltaE00 } from 'delta-e';
import ScatterPlot from '@/components/ui/scatter_plot';


type Response = {

  _id: string;
  subject_id: string;
  familiarity: string;
  colour: string | null;
  respondant_name: string;
  __v: number
};


function groupBySubjectId(arr: Response[]) {
  const groups: Record<string, Response[]> = {};

  for (const item of arr) {
    const key = item.subject_id;

    if (!groups[key]) groups[key] = [];
    if (item.colour) groups[key].push(item);
  }

  return Object.values(groups);
}

function colourAverage(arr: Response[][]) {
  let colour_converted = arr.map((ele) => ele.map((c) => {
    if (c.colour) {
      return { ...c, colour: new Color(c.colour).to("srgb") }
    }
  }))

  let averages: { subject: string | undefined, color: string, subject_id: string| undefined }[] = []
  colour_converted.forEach((r) => {
    let rating_adjust = 0
    let sums = { L: 0, a: 0, b: 0 }
    r.forEach((response) => {
      if (response) {
        let fam = parseInt(response.familiarity)
        sums.L = sums.L + (fam * response.colour.lab.l)
        sums.a = sums.a + (fam * response.colour.lab.a)
        sums.b = sums.b + (fam * response.colour.lab.b)

        rating_adjust = rating_adjust + fam
      }
    })
    let final_c = new Color("white");
    final_c.lab.l = sums.L / rating_adjust
    final_c.lab.a = sums.a / rating_adjust
    final_c.lab.b = sums.b / rating_adjust

    let res = respondants.respondants.find(n => n.id == r[0]?.subject_id);
    averages.push({ subject: res?.name, color: final_c.to('lab').toString(), subject_id: res?._id })
  })
  return averages.filter((element) => { return (element.subject != undefined) })
}




function distances(respondants: {
  _id: string;
  id: string;
  name: string;
  colour: string;
  __v: number;
}[], arr: {
  subject: string | undefined;
  color: string;
}[]) {
  let dist: { name: string, distance: number, c1: string, c2: string }[] = []
  respondants.forEach((respondant) => {
    let data = arr.find((e) => e.subject === respondant.name)
    if (data) {
      let c1 = new Color(respondant.colour);
      let c2 = new Color(data.color);
      let color1 = { L: c1.lab.L, A: c1.lab.a, B: c1.lab.b }
      let color2 = { L: c2.lab.L, A: c2.lab.a, B: c2.lab.b }
      dist.push({ name: respondant.name, distance: getDeltaE00(color1, color2), c1: c1.to('srgb').toString(), c2: c2.to('srgb').toString() })
    }
  })
  return dist
}

function _distances(respondants: {
  _id: string;
  id: string;
  name: string;
  colour: string;
  __v: number;
}[], arr: ({
  _id: string;
  subject_id: string;
  respondant_name: string;
  colour: string;
  familiarity: string;
  __v: number;
} | {
  _id: string;
  subject_id: string;
  respondant_name: string;
  colour: null;
  familiarity: string;
  __v: number;
})[]) {
  let dist: [number, number][] = []
  responses.data.forEach((response) => {
    let data = arr.find((e) => e.subject_id === response.subject_id)
    if (data) {
      if (data.colour && response.colour) {
        let c1 = new Color(response.colour);
        let c2 = new Color(data.colour);
        let color1 = { L: c1.lab.L, A: c1.lab.a, B: c1.lab.b }
        let color2 = { L: c2.lab.L, A: c2.lab.a, B: c2.lab.b }
        dist.push([parseInt(data.familiarity),getDeltaE00(color1, color2), ])
      }
    }
  })
  return dist
}


function __distances(respondants: {
  _id: string;
  id: string;
  name: string;
  colour: string;
  __v: number;
}[], arr: {
    subject: string | undefined;
    color: string;
}[]) {
  let dist: [number, number][] = []
  responses.data.forEach((response) => {
    let data = respondants.find((e) => e.id === response.subject_id)
    if (data) {
      if (data.colour && response.colour) {
        let c1 = new Color(response.colour);
        let c2 = new Color(data.colour);
        let color1 = { L: c1.lab.L, A: c1.lab.a, B: c1.lab.b }
        let color2 = { L: c2.lab.L, A: c2.lab.a, B: c2.lab.b }
        dist.push([parseInt(response.familiarity),getDeltaE00(color1, color2), ])
      }
    }
  })
  return dist
}



export default function Stats() {

  let sorted = groupBySubjectId(responses.data)
  let colours = colourAverage(sorted)
  let dists = distances(respondants.respondants, colours)
  dists.sort((a, b) => a.distance - b.distance)
  let [data, setData] = useState<Response[]>([]);

  let avg_familiarity = 0;
  responses.data.forEach((response) => {
    avg_familiarity = avg_familiarity + parseInt(response.familiarity);
  })
  avg_familiarity = avg_familiarity / responses.data.length

  let plot_differences = _distances(respondants.respondants, responses.data)
  let other_plot_differences = __distances(respondants.respondants, colours)

  useEffect(() => {
    const fetchData = async () => {
      try {
        let result = await axios.get("/api/response/get")
        console.log(result.data)
        setData(result.data.respondants)
        console.log(averageScore("X86uYjag"));
      } catch (err) {

      }
    }
    fetchData()


  }, [])


  let averageScore = (subject: string) => {
    console.log(data)
    let numbers: number[] = []
    data.forEach((response) => {
      if (response.subject_id == subject) {
        console.log(response)

      }
    })
    return numbers.reduce((sum, num) => sum + num, 0) / numbers.length;
  }
  return (

    <div className="flex w-full flex-col items-center font-sans dark:bg-black">
      <h1 className="bold pt-4 text-3xl font-semibold pb-4">Colour Psychology</h1>
      <h2 className='pt-4 text-2xl'>What colour are you?</h2>

      {/* SMALL RESPONSIVE GRID */}
      <div className="grid w-full gap-4 p-4 
                    grid-cols-3 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-10">
        {colours.map((c) => (
          <div
            className="flex flex-col items-center font-sans gap-1"
            key={c.subject + "_colour"}
          >
            <div
              style={{ backgroundColor: c.color }}
              className="w-30 h-30"
            ></div>

            <h1 className="text-xs text-center">{c.subject}</h1>
          </div>
        ))}
      </div>
      <h2 className='pt-4 text-2xl'>What colour did you choose for yourself?</h2>
      {/* SMALL RESPONSIVE GRID */}
      <div className="grid w-full gap-4 p-4 
                    grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10">
        {respondants.respondants.map((c) => (
          <div
            className="flex flex-col items-center font-sans gap-1"
            key={c.name + "_colour"}
          >
            <div
              style={{ backgroundColor: c.colour }}
              className="w-30 h-30"
            ></div>

            <h1 className="text-xs text-center">{c.name}</h1>
          </div>
        ))}
      </div>
      <h2 className='pt-4 text-2xl'>How far was your colour from what you picked?</h2>
      <div className="grid w-full gap-4 p-4 
                    grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {dists.map((dist) => (
          <div
            className="flex flex-col items-center font-sans gap-1"
            key={dist.name + "_colour"}
          >
            <div className='flex flex-row items-center'>
              <div
                style={{ backgroundColor: dist.c1 }}
                className="w-30 h-30"
              ></div>
              <div
                style={{ backgroundColor: dist.c2 }}
                className="w-30 h-30"
              ></div>
            </div>


            <h1 className="text-xs text-center">{dist.name}</h1>
            <h1 className="text-xs text-center font-semibold">{dist.distance.toFixed(2)}</h1>
          </div>
        ))}
      </div>
      <h2 className='pt-4 text-2xl pb-4'>What was the average familiarity rating?</h2>
      <h3 className='text-xl'>The average score between all recipients was <b>{avg_familiarity.toFixed(2)}</b> out of 10</h3>


      <h2 className='pt-4 text-2xl pb-4'>How did familiarity affect voted colour distance?</h2>
      <ScatterPlot data={plot_differences} width={500} height={500}></ScatterPlot>
      <h2 className='pt-4 text-2xl pb-4'>How did familarity affect proximity to self-selected colour?</h2>
      <ScatterPlot data={other_plot_differences} width={500} height={500}></ScatterPlot>
    </div>
  );


}
