import Navbar from "../components/Navbar";
import UploadMainInfo from "../components/UploadMainInfo";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="pt-20 flex flex-col items-center">
        <UploadMainInfo />
      </main>
    </>
  );
}
