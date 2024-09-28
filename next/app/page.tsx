import LoginForm from "./ui/login-form"

export default function Page() {
  return (
    <div className="flex h-screen">
      {/* Left half - Dark */}
      <div className="w-1/2 bg-gray-900 text-white flex flex-col justify-center items-center p-12">
        <h1 className="text-7xl font-bold mb-4">Hey, I'm Lisa</h1>
        <p className="text-3xl text-gray-300">Your Local Intelligent School Advisor</p>
      </div>

      {/* Right half - Light */}
      <div className="w-1/2 bg-white flex flex-col justify-center items-center p-12">
        <LoginForm />
      </div>
    </div>
  )
}