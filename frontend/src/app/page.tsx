import MainInfo from "./components/MainInfo";
import Navbar from "./components/Navbar";

export default function Home() {
  return (
    <>
    <Navbar />
    <main className="pt-20 flex flex-col items-center">
      <MainInfo />
    </main>
    </>
  );
}
