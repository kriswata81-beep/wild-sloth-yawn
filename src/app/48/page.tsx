import { redirect } from 'next/navigation'

export const metadata = {
  title: 'Mayday 48 · Mākoa Brotherhood · West Oʻahu',
  description: 'The once-ever founding event. May 2026. 4 weekends. 2 full moons. 20 Aliʻi founder seats.',
}

export default function Redirect48() {
  redirect('/founding48')
}
