import LoginForm from "@/components/login-form"

export default function Page() {
  return (
    <div className="flex h-screen">
      <div className="w-1/2 bg-gray-900 text-white flex flex-col justify-center items-center p-12">
        <h1 className="text-7xl font-bold mb-4">Hey, I&apos;m Lisa</h1>
        <p className="text-3xl text-gray-300 mb-8">Your Local Intelligent School Advisor</p>
        
        <div className="space-y-6 text-center">
          <div>
            <h2 className="text-2xl font-semibold mb-2">Personalized Guidance</h2>
            <p className="text-gray-400">Get tailored advice for your educational journey</p>
          </div>
          
          <div>
            <h2 className="text-2xl font-semibold mb-2">24/7 Availability</h2>
            <p className="text-gray-400">Access expert insights anytime, anywhere</p>
          </div>
          
          <div>
            <h2 className="text-2xl font-semibold mb-2">Data-Driven Decisions</h2>
            <p className="text-gray-400">Make informed academic choices with up-to-date information</p>
          </div>
          
          <div className="pt-6">
            <p className="text-xl text-gray-300">Join students at your university making smarter educational choices with Lisa</p>
          </div>
        </div>
      </div>

      <div className="w-1/2 bg-white flex flex-col justify-center items-center p-12">
        <LoginForm />
      </div>
    </div>
  )
}