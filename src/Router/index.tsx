import { Chose } from "@/pages/Chose";
import { Playground } from "@/pages/Playground";
import { Routes, Route } from "react-router-dom";

export function Router() {
  return (
    <Routes>
      <Route>
        <Route path="/" element={<Chose />} />
        <Route path="/playground" element={<Playground />} />
      </Route>
    </Routes>
  )
}