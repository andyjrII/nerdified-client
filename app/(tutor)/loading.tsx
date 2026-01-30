export default function TutorLoading() {
  return (
    <div className="flex items-center justify-center min-h-[50vh] px-4">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-gray-500">Loading...</p>
      </div>
    </div>
  );
}
