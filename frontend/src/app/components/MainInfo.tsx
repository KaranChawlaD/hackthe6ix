export default function MainInfo() {
  return (
    <>
      <div className="w-1/3 flex flex-col items-center justify-center">
        <h1 className="text-foreground text-8xl font-bold pt-20 mt-48 text-center">
          coach.ai
        </h1>
        <h2 className="mt-4 text-foreground text-xl text-center">
          Greater Access, Better Athletes
        </h2>
        <a href="/upload" className="mt-4 text-foreground text-xl align-middle text-center underline">
          Elevate Your Performance
        </a>
        <h2 className="text-foreground text-xl text-center">
          To The Next Level With AI
        </h2>
      </div>
      <div className="absolute top-0 left-0 w-full h-full -z-10 overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover opacity-40"
        >
          <source src="backgroundvid.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    </>
  );
}
