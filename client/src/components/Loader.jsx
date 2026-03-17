const Loader = () => {
  return (
    <div className="fixed inset-0 bg-white z-[100] flex flex-col items-center justify-center gap-6">
      <div className="relative w-20 h-20">
        <div className="absolute inset-0 border-4 border-gray-100 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-black rounded-full border-t-transparent animate-spin"></div>
      </div>
      <div className="flex flex-col items-center">
        <h2 className="text-xl font-black uppercase tracking-[0.3em] animate-pulse">
          ZENZLOOM
        </h2>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2">
          Curating your finds...
        </p>
      </div>
    </div>
  );
};

export default Loader;
