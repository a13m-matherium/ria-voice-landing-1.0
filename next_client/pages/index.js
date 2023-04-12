import { AnimalBG } from "@/components/AnimalBG";
import { Hero } from "@/components/Hero";
import { FeatureDescription } from "@/components/FeatureDescription";
import RegisterSectionLandingPage from "@/components/RegisterSectionLandingPage";
import { VoicePanel } from "@/components/VoicePanel";

import Head from "next/head";

export default function Home() {
  return (
    <>
      <Head>
        <title>Matherium</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Hero/>
      <FeatureDescription/>
      <RegisterSectionLandingPage />
    </>
  );
}
