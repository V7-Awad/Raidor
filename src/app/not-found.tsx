import Link from "next/link";
import { Figure } from "@/components/figure/Figure";
export default function NotFound() { return <div className="not-found"><Figure/><h1>This page does not exist.</h1><p><Link href="/">Go back home.</Link></p></div>; }
