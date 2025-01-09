import { Chose } from "@/pages/Chose";
import { Home } from "@/pages/Home";
import { Playground } from "@/pages/Playground";
import { Routes, Route } from "react-router-dom";
import { AuthGuard } from "./AuthGuard";

export function Router() {
  return (
    <Routes>
      <Route element={<AuthGuard isPrivate />} >
        <Route path="/" element={<Chose />} />
        <Route path="*" element={<Chose />} />
        <Route path="/playground" element={<Playground />} />
      </Route>

      <Route element={<AuthGuard isPrivate={false} />} >
        <Route path="/login" element={<Home />} />
      </Route>
    </Routes>
  )
}